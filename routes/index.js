var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var obj = require('./obj');
var mailer = require("nodemailer");

var con = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME || 'localhost',
  	user     : process.env.RDS_USERNAME || 'root',
  	password : process.env.RDS_PASSWORD || 'gan',
 	port     : process.env.RDS_PORT || '3306',
    database : "ebdb"
});
con.connect(function(err){
    if(err){console.log("Database Error");}
     else {console.log("Database Connected");}
});

function mail(to,subject,content){
        
    var smtpTransport = mailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "noreply.onotes@gmail.com",
            pass: "onlinenotesv2"
        }
    });

    var mail = {
        from: "ONotes <nororeply.onotes@gmail.com>",
        to: to,
        subject: subject,
        html: content
    }

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }
        smtpTransport.close();
    });
}


router.get('/create/tables/secure',function(req,res){
    con.query("create table if not exists users (id varchar(15) , username varchar(255) , password text, userkey varchar(100) , email varchar(255) , verified varchar(3) , primary key (id))", function(err, rows, fields){
        if (err) res.send(err);
    });
});

router.get('/delete/secure/public' , function(req,res){
    con.query('drop table public',function(err){if(err) throw err;})
});

router.get('/', function(req, res, next) {
    if(!obj.siStatus(req,obj,obj.cookieKey)){
      console.log("1123123");
        res.render('index' , {superroremail:"",superrorusername:"",loginerror:"",signupmodal:"hide",loginmodal:"hide",signupfield:""});
    }
    else{
        res.redirect('/profile');
    }
});

router.post('/check/:x' , function(req,res,next){
    var x = req.params.x, s=req.body.s;
    console.log(s);
    if(x=="Email"){
        con.query(
            'select * from users where '+x+'=?',
            [s],
            function(err,rows){
                console.log(rows);
                if(rows.length){
                    res.send(x+" already exists");
                }
                else{
                    res.send(0);
                }
            }
        );
    }
});

router.post('/signup' , function(req,res,next){
    var username = req.body.username, email = req.body.email , password = req.body.password;

    if((!username || /^\s*$/.test(username)) || (!email || /^\s*$/.test(email)) || (!password || /^\s*$/.test(password))){
        res.render('index',{superroremail: "" , loginerror:"",signupmodal:"show",loginmodal:"hide",signupfield:"All fields are mandatory!"});
    }
    else if(!(/^[a-zA-Z() ]+$/.test(username))){
        res.render('index',{superroremail: "" , loginerror:"",signupmodal:"show",loginmodal:"hide",signupfield:"Invalid Name"});
    }
    else{
        password = obj.hash(password);
        con.query(
        "select * from users where email=?",
        [email],
        function(err,Row){
            if(Row.length){
                res.clearCookie('user');
                res.render('index',{superroremail: "This Email already exists" , loginerror:"",signupmodal:"show",loginmodal:"hide",signupfield:""})
            }
            else{
                                
                var date = new Date();
    
                var id ="u"+date.getFullYear().toString()+date.getMonth().toString()+date.getDate().toString()+date.getHours().toString()+date.getMinutes().toString()+date.getSeconds().toString();
                var key = id + '0^!in#N0TE$~~v2' + id + 398*Number(id.slice(1));
    
                con.query(
                    "insert into users set ?" , 
                    {id:id , username:username, email:email , password:password , userkey:key , verified:'no'} , 
                    function(err){
                        if(err) throw err;
                        var subject = "Verify your email id for ONotes";
                        var content = "<a href="+"'http://"+req.hostname+"/verify/"+obj.encrypt(id,obj.emailKey)+"/"+obj.encrypt(username,obj.emailKey)+"/"+obj.encrypt(email,obj.emailKey)+"/"+password+"' > verify </a>";
                        
                        mail(email,subject,content);
                        res.send('check mail');
                    }
                );
            }
        });
    }
});


router.get('/verify/:id/:username/:email/:password' , function(req,res,next){
    
    var id = obj.decrypt(req.params.id,obj.emailKey);
    var username = obj.decrypt(req.params.username,obj.emailKey);
    var email = obj.decrypt(req.params.email,obj.emailKey); 
    var password = req.params.password;
    
    con.query(
        "select * from users where username=?",
        [username],
        function(err,userRow){
            if(!userRow.length){
                res.clearCookie('user');
                res.send("invalid link")
            }
            else if(userRow[0].verified == 'yes'){
                res.cookie('user' , obj.encrypt(id , obj.cookieKey));
                res.render('profile' , {rows: [] ,urows:[], greeting:obj.greeting(userRow[0].username)});
            }
            else{
                userRow[0].verified = 'yes';
                
                con.query('update users set verified="yes" where username=?',[username],function(err){if(err)throw err;});
                
                con.query(
                    "create table "+id+" ( id varchar(20) , name text , content text,align varchar(7) ,updates int, str varchar(10) , public int(1) ,upvotes int(4), primary key (id) )" ,
                    function(err){
                        if(err) throw err;
                    }
                );
                res.cookie('user' , obj.encrypt(id , obj.cookieKey),{signed:true});
                res.render('profile' , {rows: [],urows:[],greeting:obj.greeting(userRow[0].username)});
            }
        }
    );
    
    
});

router.post('/login' , function(req,res,next){
    var email = req.body.email , password = obj.hash(req.body.password);
    
    con.query('select * from users where email=?' , 
              [email] ,
              function(err,rows){
                if(rows.length && password==rows[0].password){
                    var c = obj.encrypt(rows[0].id , obj.cookieKey);
                    res.cookie('user' , c , {signed:true});
                    res.redirect('profile');
                }
                else{
                    res.render('index' , {superroremail:"",loginerror:"Invalid Credentials",signupmodal:"hide",loginmodal:"show",signupfield:""});;
                }
            });
});

router.get('/test', function(req, res, next) {
    
    if(!obj.siStatus(req,obj,obj.cookieKey)){
        res.redirect('/')
    }
    else{
        var userid = obj.siStatus(req,obj,obj.cookieKey); 
        
        con.query('select userkey from users where id=?' , [userid] ,function(err,row){
            var key = row[0].userkey;
            con.query(
                "select * from "+userid , 
                function(err,rows){
                    var i;
                    for(i=0;i<rows.length;i++){
                        rows[i].name = obj.decrypt(rows[i].name,key) 
                    }
                    res.send(rows);
                });
        });
        
    }
  
});

module.exports = router;
