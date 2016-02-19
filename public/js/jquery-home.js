$(document).ready(function(){
    //navbar
   $("#signup,#login,#create,#read").mouseover(function(){
       $(this).css({"border-top":"4px solid #00ccff" , "transition":"border-top 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"});
       $(".navbar").css({"border-bottom":"2px solid #00ccff"/*, "transition":"border-bottom 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"*/});
    }); 
    
    $("#signup,#login,#create,#read").mouseout(function(){
       $(this).css({"border-top":"2px solid #00ccff" , "transition":"border-top 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"});
       $(".navbar").css({"border-bottom":"0"/*, "transition":"border-bottom 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"*/});
    });
    
    //signup,login click
    
    $("#signup,#login").click(function(){
        $("#username,#email,#password,#lemail,#lpassword").val("");
        $(".error").html("");
    });

    
    //public link
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
    

    //text align
    $(".glyphicon-align-left").click(function(){
        $("#note-content,.read-note-name").css('text-align','left');
    });
    
    $(".glyphicon-align-center").click(function(){
        $("#note-content,.read-note-name").css('text-align','center');
    });
    
    $(".glyphicon-align-right").click(function(){
        $("#note-content,.read-note-name").css('text-align','right');
    });
    

    //edit button click
    $("#edit").click(function(){
        $(".read-mode").slideUp();
        $(".read-mode-btn").css('display','none');
        $(".edit-mode").css('display','block');
    });

    //username,email,password
    $("#username").keyup(function(){
        if(!$(this).val() || /^\s*$/.test($(this).val())){
            $("#usernameerror").html("This can't be empty");
            console.log($(this).val().length);
        }
        else{
            if (!(/^[a-zA-Z() ]+$/.test($(this).val()))){
                $("#usernameerror").html("Only alphabets are allowed");
            }
            else{
                $("#usernameerror").html("");    
            }
        }
    });
    
    $("#email").keyup(function(){
        if(!$(this).val() || /^\s*$/.test($(this).val())){
            $("#emailerror").html("This can't be empty");
            console.log($(this).val().length);
        }
        else{
            $("#emailerror").html("");
        }
    });
    
    $("#password").keyup(function(){
        if(!$(this).val() || /^\s*$/.test($(this).val())){
            $("#passworderror").html("This can't be empty");
            console.log($(this).val().length);
        }
        else{
            $("#passworderror").html("");
        }
    });
    
});