$(document).ready(function(){
   $("#create").click(function(){
       $("#new-note").css({"display":"block" , "transition":"display 1s"});
   });
    
    $("#edit").click(function(){
        $("#aNote").slideUp();
        $("#edit-form").slideDown();
    });
    
    $("#cancel-edit").click(function(){
        window.location.reload(true);
    });
});