$(document).ready(function(){
   $("#create , #noN-create").click(function(){
       $("#new-note").css({"display":"block" , "transition":"display 1s"});
       $("#no-note,#note-content,#recent-notes,#comment-space,#comment-form,#aNote").css({"display":"none" , "transition":"display 1s"});
   });
    
    $("#edit").click(function(){
        $("#aNote").slideUp();
        $("#edit-form").slideDown();
    });
    
    $("#cancel-edit").click(function(){
        window.location.reload(true);
    });
});