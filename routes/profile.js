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
        var noteid = req.params.id;
        con.query('select userkey from users where id=?' , [userid] ,function(err,row){
            var key = row[0].userkey;
            con.query(
                "select * from "+userid+" where id=?",
                [noteid],
                function(err,rows){
                    if(rows.length){
                        res.render('read',{
                            name : obj.decrypt(rows[0].name,key),
                            content : obj.decrypt(rows[0].content,key),
                            id : noteid
                        });
                    }
                    else{
                        res.send('does not exist');
                    }
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

router.get('/deletenote/:id' , function(req,res,next){
    if(!obj.siStatus(req,obj,keys.cookieKey)){
        res.redirect('/');
    }
    else{
        var userid = obj.siStatus(req,obj,keys.cookieKey);
        
        con.query(
            'delete from '+userid+' where id=?', 
            [req.params.id] , 
            function(err){
                if(err) throw err;
                res.redirect('/profile/list')
            });
    }
});


router.get('/logout' , function(req,res,next){
    res.clearCookie('user');
    res.redirect('/');
})

router.post('/edit/:id' , function(req,res,next){
    if(!obj.siStatus(req,obj,keys.cookieKey)){
        res.redirect('/');
    }
    else{
        var userid = obj.siStatus(req,obj,keys.cookieKey);
        var noteid = req.params.id;
        con.query('select userkey from users where id=?' , [userid] ,function(err,row){
            var key = row[0].userkey;
            var name = obj.encrypt(req.body.editedName,key);
            var content = obj.encrypt(req.body.editedContent,key);
            
            con.query("update "+userid+" set name=?,content=? where id=?",
                     [name,content,noteid],
                      function(err){if(err) throw err;}
                     );
            
            con.query(
                "select * from "+userid+" where id=?",
                [noteid],
                function(err,rows){
                        res.redirect('/profile/readnote/'+noteid);
                    });
        });
    }
    
});

module.exports = router;