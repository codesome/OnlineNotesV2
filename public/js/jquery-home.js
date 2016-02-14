$(document).ready(function(){
    
   $("#signup,#login,#create,#read").mouseover(function(){
       $(this).css({"border-top":"4px solid #00ccff" , "transition":"border-top 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"});
       $(".navbar").css({"border-bottom":"2px solid #00ccff"/*, "transition":"border-bottom 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"*/});
    }); 
    
    $("#signup,#login,#create,#read").mouseout(function(){
       $(this).css({"border-top":"2px solid #00ccff" , "transition":"border-top 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"});
       $(".navbar").css({"border-bottom":"0"/*, "transition":"border-bottom 0.15s","-webkit-transition-timing-function": "ease-in-out" , "transition-timing-function": "ease-in-out"*/});
    });
});