var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var obj = require('./obj');
var keys = require('./keys');


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
    
    if(!obj.siStatus(req,obj,keys.cookieKey)){
        res.redirect('/')
    }
    else{
        res.render('profile');
    }
  
});

router.post('/createnote' , function(req,res,next){
    
     var userid = obj.siStatus(req,obj,keys.cookieKey);
    con.query('select userkey from users where id=?' , [userid] ,function(err,rows){
        var key = rows[0].userkey;
        
        var name = obj.encrypt(req.body.name,key);
        var content = obj.encrypt(req.body.content,key);
    
        con.query(
            "insert into "+userid+" set ?" , 
            {name:name , content:content} , 
            function(err){if(err) throw err;}
        );
    
        res.redirect('/profile');
    });
});

router.get('/list', function(req, res, next) {
    
    if(!obj.siStatus(req,obj,keys.cookieKey)){
        res.redirect('/')
    }
    else{
        var userid = obj.siStatus(req,obj,keys.cookieKey); 
        
        con.query('select userkey from users where id=?' , [userid] ,function(err,row){
            var key = row[0].userkey;
            con.query(
                "select * from "+userid , 
                function(err,rows){
                    var i;
                    for(i=0;i<rows.length;i++){
                        rows[i].name = obj.decrypt(rows[i].name,key) 
                    }
                    res.render('list' , {rows:rows});
                });
        });
        
    }
  
});




router.get('/readnote/:id' , function(req,res,next){
    if(!obj.siStatus(req,obj,keys.cookieKey)){
        res.redirect('/');
    }
    else{
        var userid = obj.siStatus(req,obj,keys.cookieKey);
        con.query('select userkey from users where id=?' , [userid] ,function(err,row){
            var key = row[0].userkey;
            con.query(
                "select * from "+userid+" where id=?",
                [req.params.id],
                function(err,rows){
                    res.render('read',{name:obj.decrypt(rows[0].name,key),content:obj.decrypt(rows[0].content,key)});
                });
        });
        /*con.query(
            "select * from "+userid+" where id=?",
            [req.params.id],
            function(err,rows){
            res.render('read',{name:rows[0].name,content:rows[0].content});
        });*/
    }
    
});

router.get('/logout' , function(req,res,next){
    res.clearCookie('user');
    res.redirect('/');
})

/*router.get('/notelist' , function(req,res,next){
    if(!obj.siStatus(req,obj,keys.cookieKey)){
        res.redirect('/')
    }
    else{
        con.query(
        "select * from notes" , 
        function(err,rows){
            console.log(rows);
            var i , content = '';
            for(i=0;i<rows.length;i++){
                content+='<br>'+rows[i].name+'&nbsp; <a href="/profile/readnote/'+rows[i].id+'">read</a>';
            }
            res.send(content);
        });
    }
    
});*/

module.exports = router;