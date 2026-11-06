 
function regComment(){
    ajaxProc('', 'cFrm', '/_Prog/common/comment/commentProc.php', '', regCommentEnd);
}
function regCommentEnd(v){
    if(v == 'OK'){
        alert('评论已发布。');
        location.reload();
    }else if(v == 'LOGIN'){
        alert('该功能需要登录。');
        openModal('login_1');
    }else{
        alert(v);
    }
}

 
function addReComment(idx, postRef, type){
    const formElement = document.getElementById('reFrm'+idx+'_'+postRef);
    if(formElement == null){
        ajaxJsonProc('', '', '/_Prog/common/comment/reCommentView.php', 'idx='+idx+'&comRef='+postRef+'&type='+type, addReCommentEnd);
    }
}
function addReCommentEnd(v){
    if(v.result){
        $('#commentBox'+v.comRef).after(v.listViewHTML);
    }else{
        alert('该功能需要登录。');
        openModal('login_1');
    }
}

 
function regReComment(idx, postRef){
    ajaxProc('', 'reFrm'+idx+'_'+postRef, '/_Prog/common/comment/commentProc.php', '', regReCommentEnd);
}
function regReCommentEnd(v){
    if(v == 'OK'){
        //alert('评论已发布。');
        location.reload();
    }else{
        if(v == 'LOGIN'){
            alert('该功能需要登录。');
            openModal('login_1');
        }else{
            alert(v);
        }
    }
}



 
function commentListView(type, idx){
    ajaxProc('commentListView', '', '/_Prog/common/comment/commentListView.php', 'type='+type+'&idx='+idx , '');
}

 
function delComment(idx){
    if(confirm('确定删除所选内容吗？')){
        ajaxProc('', '', '/_Prog/common/comment/commentProc.php', 'mode=delete&idx='+idx, delCommentEnd);
    }
}
function delCommentEnd(v){
    if(v == 'OK'){
        alert('评论已删除。');
        location.reload();
    }else{
        alert(v);
    }
}

function updateComment(idx){
    ajaxProc('recommentFrom_'+idx, '', '/_Prog/common/comment/reCommentForm.php', 'idx='+idx, '');
}

