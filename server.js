// 廖安心作品集 —— 公网部署用静态服务器（零依赖，单端口）
//
// 职责：
//   1. 托管 next 静态导出（out/）的全部文件
//   2. 把 index.html 里构建期写死的 og 占位域名，按请求 Host 实时改写成真实域名
//      —— 这样发到任何域名，微信/招聘平台的分享卡片都能出图
//   3. 支持 HTTP Range（视频拖进度条）与缓存头
//
// 启动：PORT 环境变量指定端口（部署平台注入），默认 3000。
// 本地测试：SERVE_ROOT=<目录> node server.js

const http = require("http");
const fs = require("fs");
const path = require("path");

// path.resolve 会把分隔符归一化（Windows 下 "C:/x" -> "C:\x"），
// 否则下面的 startsWith 防穿越判断会因分隔符不一致把所有请求判成 403
const ROOT = path.resolve(process.env.SERVE_ROOT || __dirname);
const PORT = process.env.PORT || 3000;
// 构建期写进 og 标签的占位域名（见 build-deploy-bundle.py 的 NEXT_PUBLIC_SITE_URL）
const OG_PLACEHOLDER = "https://og.placeholder";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

function originOf(req) {
  const host =
    (req.headers["x-forwarded-host"] || "").split(",")[0].trim() ||
    req.headers.host ||
    "127.0.0.1";
  const proto =
    (req.headers["x-forwarded-proto"] || "").split(",")[0].trim() ||
    (String(host).startsWith("127.0.0.1") || String(host).startsWith("localhost")
      ? "http"
      : "https");
  return proto + "://" + host;
}

// index.html 很小（~1MB），缓存进内存，每个请求只做一次字符串替换
let cachedHtml = null;
function getIndexHtml() {
  if (cachedHtml === null) {
    cachedHtml = fs.readFileSync(path.join(ROOT, "index.html"));
  }
  return cachedHtml;
}

function sendErr(res, code, msg) {
  res.writeHead(code, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(msg || String(code));
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") return sendErr(res, 405);

  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch (e) {
    return sendErr(res, 400);
  }
  if (urlPath === "/") urlPath = "/index.html";

  // 防目录穿越
  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    return sendErr(res, 403);
  }
  // 服务器自身文件不对外
  if (urlPath === "/server.js" || urlPath === "/package.json") {
    return sendErr(res, 404);
  }

  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch (e) {
    return sendErr(res, 404);
  }
  if (stat.isDirectory()) return sendErr(res, 404);

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";

  const baseHeaders = {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    // _next/ 带内容哈希，可以永久缓存；其余协商缓存
    "Cache-Control": urlPath.startsWith("/_next/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=3600",
  };

  // Range 请求（视频拖进度条）
  const range = req.headers.range;
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!m) {
      res.writeHead(416, { "Content-Range": "bytes */" + stat.size });
      return res.end();
    }
    let start = m[1] === "" ? undefined : parseInt(m[1], 10);
    let end = m[2] === "" ? undefined : parseInt(m[2], 10);
    if (start === undefined && end === undefined) return sendErr(res, 416);
    if (start === undefined) {
      // 后缀范围：bytes=-N
      start = Math.max(0, stat.size - (end || 0));
      end = stat.size - 1;
    } else {
      end = Math.min(end === undefined ? stat.size - 1 : end, stat.size - 1);
    }
    if (start > end || start >= stat.size) {
      res.writeHead(416, { "Content-Range": "bytes */" + stat.size });
      return res.end();
    }
    res.writeHead(206, {
      ...baseHeaders,
      "Content-Range": "bytes " + start + "-" + end + "/" + stat.size,
      "Content-Length": end - start + 1,
    });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  // index.html：改写 og 域名（占位域名 → 请求方真实域名）
  if (urlPath === "/index.html") {
    const origin = originOf(req);
    let body = getIndexHtml();
    if (body.includes(OG_PLACEHOLDER)) {
      body = Buffer.from(
        body.toString("utf8").split(OG_PLACEHOLDER).join(origin)
      );
    }
    res.writeHead(200, { ...baseHeaders, "Content-Length": body.length });
    if (req.method === "HEAD") return res.end();
    return res.end(body);
  }

  res.writeHead(200, { ...baseHeaders, "Content-Length": stat.size });
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("[portfolio] serving " + ROOT + " on 0.0.0.0:" + PORT);
});
