var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';

router = {
    encrypt: function(text , key) {
        var cipher = crypto.createCipher(algorithm, key);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },

    decrypt: function(text , key) {
        var decipher = crypto.createDecipher(algorithm, key);
        var dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    },
    
    hash: function(text) {
        return crypto.createHash('sha256').update(text).digest("hex");
    },
    
    siStatus: function(req , obj ,key) {
        if(req.cookies.user){
            return obj.decrypt(req.cookies.user,key);
        }
        else{
            return 0;
        }
    },
    
    adminStatus: function(req , obj ,key) {
        if(req.cookies.admin){
            return obj.decrypt(req.cookies.admin,key);
        }
        else{
            return 0;
        }
    },
    
    randomString: function(n){
        var a = "PBNMmnbv789cxQTYUIOzasWERdfgGHJKL234ZXChjklpoiuyASDFVtrewq1560";
        var string = "" ,i;
        for(i=0;i<n;i++){
            string+=a[Math.floor(Math.random()*1000)%62];
        }
        return string;
    },
    
    greeting: function(name){
        var d = new Date();
        var h = d.getHours();
        if(h>=5 && h<=11){ return "Good Morning "+name+"!"}
        if(h>=12 && h<=16){ return "Good Afternoon "+name+"!"}
        if(h>=17 && h<=20){ return "Good Evening "+name+"!"}
        if(h>=21 && h<=4){ return "Good Evening "+name+"!"}
    },
    
    cookieKey : "T#!$isTh#$#(retK#Yf0rt##cookie$0^!in#N0TE$~~v2bR0n0U$#$#@R(h!^g",
    
    emailKey : "isTh#$#(retK#Yf0rtcookie$0^!in#N0TE$~~v2f0r#miILAPi"
          
}

module.exports = router;