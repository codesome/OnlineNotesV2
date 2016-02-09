var express = require('express');
var mysql = require('mysql');
var app = express();
var router = express.Router();
var obj = require('./obj');

var con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'gan',
    database : 'onlinenotesv2'
});
con.connect(function(err){
    if(err){console.log("Database Error");}
     else {console.log("Database Connected");}
});

router.get('/', function(req, res, next) {
    if(!obj.siStatus(req,obj,obj.cookieKey)){
        res.render('index' , {signuperror:"",loginerror:""});
    }
    else{
        res.redirect('/profile');
    }
});


router.post('/signup' , function(req,res,next){
    
    var username = req.body.username , password = obj.hash(req.body.password);
    
    con.query(
        "select * from users where username=?",
        [username],
        function(err,userRow){
            if(userRow.length){
                res.clearCookie('user');
                res.render('index',{signuperror: "username already exists" , loginerror:""})
            }
            else{
                var date = new Date();
    
                var id ="u"+date.getFullYear().toString()+date.getMonth().toString()+date.getDate().toString()+date.getHours().toString()+date.getMinutes().toString()+date.getSeconds().toString();
                var key = id + '0^!in#N0TE$~~v2' + id + 398*Number(id);
    
                con.query(
                    "insert into users set ?" , 
                    {id:id , username:username , password:password , userkey:key} , 
                    function(err){if(err) throw err;}
                );
    
                con.query(
                    "create table "+id+" ( id int(5) not null auto_increment, name text , content text, primary key (id) )" ,
                    function(err){
                        if(err) throw err;
                    }
                );
           
                res.cookie('user' , obj.encrypt(id , obj.cookieKey));
                res.render('profile' , {rows: []});
            }
        }
    );
    
    
});

router.post('/login' , function(req,res,next){
    var username = req.body.username , password = obj.hash(req.body.password);
    
    con.query('select * from users where username=?' , 
              [username] ,
              function(err,rows){
                if(rows.length && password==rows[0].password){
                    var c = obj.encrypt(rows[0].id , obj.cookieKey);
                    res.cookie('user' , c);
                    res.redirect('profile');
                }
                else{
                    res.render('index' , {signuperror:"",loginerror:"invalid credentials"});;
                }
            });
});

module.exports = router;
