// ---------------------------------------------------------------------------
 
//
 
 
 
 
// ---------------------------------------------------------------------------

import * as THREE from "/inc/js/vendor/three/three.module.min.js";

const COMP = {
  5120: Int8Array, 5121: Uint8Array, 5122: Int16Array,
  5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array,
};
const NUM = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
const NORMALIZE = { 5120: 127, 5121: 255, 5122: 32767, 5123: 65535 };

function readAccessor(gltf, bin, index) {
  const acc = gltf.accessors[index];
  const n = NUM[acc.type];
  const Ctor = COMP[acc.componentType];
  const bv = gltf.bufferViews[acc.bufferView];
  const base = (bv.byteOffset || 0) + (acc.byteOffset || 0);
  const elemBytes = Ctor.BYTES_PER_ELEMENT * n;
  let arr;
  if (bv.byteStride && bv.byteStride !== elemBytes) {
     
    arr = new Ctor(acc.count * n);
    for (let i = 0; i < acc.count; i++) {
      const src = new Ctor(bin.buffer, bin.byteOffset + base + i * bv.byteStride, n);
      arr.set(src, i * n);
    }
  } else {
    arr = new Ctor(bin.buffer, bin.byteOffset + base, acc.count * n);
    arr = arr.slice();  
  }
  return { arr, itemSize: n, normalized: !!acc.normalized, componentType: acc.componentType };
}

// ---------------------------------------------------------------------------
 
//
 
 
 
// ---------------------------------------------------------------------------

function parseChunks(buffer) {
  const dv = new DataView(buffer);
  if (dv.getUint32(0, true) !== 0x46546c67) throw new Error("GLB 魔数不匹配");
  let off = 12, gltf = null, bin = null;
  while (off < dv.byteLength) {
    const len = dv.getUint32(off, true);
    const type = dv.getUint32(off + 4, true);
    const data = new Uint8Array(buffer, off + 8, len);
    if (type === 0x4e4f534a) gltf = JSON.parse(new TextDecoder().decode(data));
    else if (type === 0x004e4942) bin = data;
    off += 8 + len + ((4 - (len % 4)) % 4);
  }
  if (!gltf || !bin) throw new Error("GLB 数据块缺失");
  return { gltf, bin };
}






export async function loadGLBScene(url, bufferP, opts = {}) {
   
   
  let buffer;
  if (bufferP) buffer = await bufferP;
  else {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`GLB 加载失败 ${res.status}: ${url}`);
    buffer = await res.arrayBuffer();
  }
  const { gltf, bin } = parseChunks(buffer);

   
   
   
   
   
  const matNames = (gltf.materials || []).map((m) => m.name || "");
  const injected = opts.matTex && matNames.length > 0 && matNames.every((n) => opts.matTex.has(n));
  const textures = [];
  for (const img of injected ? [] : gltf.images || []) {
    const bv = gltf.bufferViews[img.bufferView];
    const bytes = bin.slice(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength);
    const bitmap = await createImageBitmap(new Blob([bytes], { type: img.mimeType }));
    const t = new THREE.Texture(bitmap);
    t.flipY = false;                           
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    t.needsUpdate = true;
    textures.push(t);
  }
  const materials = (gltf.materials || []).map((m) => {
    const pbr = m.pbrMetallicRoughness || {};
    const texIdx = pbr.baseColorTexture?.index;
    const mat = new THREE.MeshBasicMaterial({
      map: opts.matTex?.get(m.name || "")
        ?? (texIdx !== undefined && textures[gltf.textures[texIdx].source]) ?? null,
      side: m.doubleSided ? THREE.DoubleSide : THREE.FrontSide,
    });
    if (pbr.baseColorFactor) mat.color.fromArray(pbr.baseColorFactor);
    mat.name = m.name || "";
    return mat;
  });

  const group = new THREE.Group();
  const nodes = [];
  for (const node of gltf.nodes) {
    if (node.mesh === undefined) continue;
    const holder = new THREE.Group();
    holder.name = node.name || "";
    if (node.translation) holder.position.fromArray(node.translation);
    if (node.rotation) holder.quaternion.fromArray(node.rotation);
    if (node.scale) holder.scale.fromArray(node.scale);
    for (const prim of gltf.meshes[node.mesh].primitives) {
      const geo = new THREE.BufferGeometry();
      for (const [name, accIdx] of Object.entries(prim.attributes)) {
        const key = { POSITION: "position", NORMAL: "normal", TEXCOORD_0: "uv" }[name];
        if (!key) continue;
        const { arr, itemSize } = readAccessor(gltf, bin, accIdx);
        geo.setAttribute(key, new THREE.BufferAttribute(arr, itemSize));
      }
      if (prim.indices !== undefined) {
        const { arr } = readAccessor(gltf, bin, prim.indices);
        geo.setIndex(new THREE.BufferAttribute(arr, 1));
      }
      geo.computeBoundingBox();
      geo.computeBoundingSphere();
      const mesh = new THREE.Mesh(geo,
        prim.material !== undefined ? materials[prim.material] : new THREE.MeshBasicMaterial());
      holder.add(mesh);
    }
    group.add(holder);
    holder.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(holder);
    nodes.push({ name: holder.name, box });
  }
  return { group, nodes };
}
