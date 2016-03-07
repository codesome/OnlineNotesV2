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
    database : 'ebdb'
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

router.get('/' , function(req,res,next){
    if(obj.adminStatus(req,obj,obj.cookieKey)){
        res.redirect('/query/tables')
    }
    else{
        res.render('query');
    }
    
});

router.post('/access' , function(req,res,next){
    var p = obj.hash(req.body.password);
    if(p=='7dd0464f6edbda9739984e4f9ebb41375f864cceb86799432116a9a68afc0141'){
        res.cookie('admin' , obj.encrypt('admin',obj.cookieKey));
        res.redirect('/query/tables');
    }
    else{
        mail("ganeshdv.17@gmail.com","ONotes Query Alert!","<b>Query was tries to access in ONotes</b>");
        res.redirect('/query/tables');
    }
});

router.get('/tables' , function(req,res,next){
    if(obj.adminStatus(req,obj,obj.cookieKey)){
        con.query('show tables from ebdb' , function(err,rows){
        var content = " " , i;
        for(i=0;i<rows.length;i++){
            var name = rows[i].Tables_in_ebdb;
            if(name=='users'||name=='public'){continue;}
            content+= name+" : <a href="+"'http://"+req.hostname+":3000/query/tables/delete/"+name+"' > delete </a>&emsp;<a href="+"'http://"+req.hostname+":3000/query/tables/view/"+name+"' > view </a>&emsp;<a href="+"'http://"+req.hostname+":3000/query/tables/truncate/"+name+"' > truncate </a><br>"
        }
        content+= "<br><br>Users : <a href="+"'http://"+req.hostname+":3000/query/tables/truncate/users' > truncate </a>&emsp;<a href="+"'http://"+req.hostname+":3000/query/tables/view/users' > view </a><br>";
        content+= "Signups : <a href="+"'http://"+req.hostname+":3000/query/tables/truncate/signups' > truncate </a>&emsp;<a href="+"'http://"+req.hostname+":3000/query/tables/view/signups' > view </a><br>";
        content+= "Public : <a href="+"'http://"+req.hostname+":3000/query/tables/truncate/public' > truncate </a>&emsp;<a href="+"'http://"+req.hostname+":3000/query/tables/view/public' > view </a><br>";    
        content+= "<br><br><a href="+"'http://"+req.hostname+":3000/query/logout' > Logout </a><br>";  
        res.send(content);
    });
    }
    else{
        res.redirect('/query');
    }
    
    
});

router.get('/tables/view/:name' , function(req,res,next){
    if(obj.adminStatus(req,obj,obj.cookieKey)){
        con.query('select * from '+req.params.name , function(err,rows){res.send(rows);});
    }
    else{
        res.redirect('/query');
    }
});

router.get('/tables/delete/:name' , function(req,res,next){
    if(obj.adminStatus(req,obj,obj.cookieKey)){
        con.query('drop table '+req.params.name , function(err){res.redirect('/query/tables');});
    }
    else{
        res.redirect('/query');
    }
});

router.get('/tables/truncate/:name' , function(req,res,next){
    if(obj.adminStatus(req,obj,obj.cookieKey)){
        if(req.params.name == 'users'){res.clearCookie('user');}
        con.query('truncate '+req.params.name , function(err){res.redirect('/query/tables');});
    }
    else{
        res.redirect('/query');
    }
});

router.get('/logout' , function(req,res,next){
    res.clearCookie('admin');
    res.redirect('/query');
});

module.exports = router;