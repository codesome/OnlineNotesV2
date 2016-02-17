$(document).ready(function(){
    
   $("#signup,#login,#create,#read").mouseover(function(){
       $(this).css({"border-top":"4px solid #00ccff" , "transition":"border-top 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"});
       $(".navbar").css({"border-bottom":"2px solid #00ccff"/*, "transition":"border-bottom 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"*/});
    }); 
    
    $("#signup,#login,#create,#read").mouseout(function(){
       $(this).css({"border-top":"2px solid #00ccff" , "transition":"border-top 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"});
       $(".navbar").css({"border-bottom":"0"/*, "transition":"border-bottom 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"*/});
    });
    
    $("#generate-p-link").click(function(){
        $(this).slideUp();
        $("#public-link").slideDown();
        $("#copy").slideDown();
        $("#delete-p-link").slideDown();
    });
    
    $("#delete-p-link").click(function(){
        $(this).slideUp();
        $("#public-link").slideUp();
        $("#copy").slideUp();
        $("#generate-p-link").slideDown();
    });
    
    $(".glyphicon-align-left").click(function(){
        $("#note-content,.read-note-name").css('text-align','left');
    });
    
    $(".glyphicon-align-center").click(function(){
        $("#note-content,.read-note-name").css('text-align','center');
    });
    
    $(".glyphicon-align-right").click(function(){
        $("#note-content,.read-note-name").css('text-align','right');
    });
    
    $("#edit").click(function(){
        $(".read-mode").slideUp();
        $(".read-mode-btn").css('display','none');
        $(".edit-mode").css('display','block');
    });
    
});