$(document).ready(function(){
   $("#signup").mouseover(function(){
       $(this).css({"border-top":"4px solid #00cc00" , "transition":"border-top 0.15s"});
       $(".navbar").css({"border-bottom":"4px solid #00cc00" , "transition":"border-bottom 0.15s"});
    }); 
    
    $("#signup").mouseout(function(){
       $(this).css({"border-top":"1px solid #00cc00" , "transition":"border-top 0.15s"});
       $(".navbar").css({"border-bottom":"0" , "transition":"border-bottom 0.15s"});
    });
    
    $("#login").mouseover(function(){
       $(this).css({"border-top":"4px solid #00ccff" , "transition":"border-top 0.15s"});
       $(".navbar").css({"border-bottom":"4px solid #00ccff" , "transition":"border-bottom 0.15s"});
   }); 
    
    $("#login").mouseout(function(){
       $(this).css({"border-top":"1px solid #00ccff" , "transition":"border-top 0.15s"});
       $(".navbar").css({"border-bottom":"0" , "transition":"border-bottom 0.15s"});
   });
});