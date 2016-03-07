var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var obj = require('./obj');

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


router.get('/:userid/:str' , function(req,res,next){
    var str = req.params.str;
    var userid = req.params.userid;
    
    con.query('select * from '+userid+' where str=?',[str],
             function(err,rows){
                    if(!rows.length){
                        res.send("Invalid Link");
                    }
                    else if(rows[0].public == 0){
                        res.send("This note is private");
                    }
                    else{
                        con.query('select * from users where id=?',[userid],
                                 function(err,row){
                                    var key = row[0].userkey;
                                    var name = obj.decrypt(rows[0].name,key);
                                    var content = obj.decrypt(rows[0].content,key);
                                    var logged = 0;
                            
                                    if(obj.siStatus(req,obj,obj.cookieKey)){
                                        logged = 1;
                                    }
                                    con.query('select * from p'+rows[0].str , 
                                             function(err,cRow){
                                        console.log(logged);
                                        res.render('public',{
                                            name:name , 
                                            content:content , 
                                            author:row[0].username, 
                                            str:rows[0].str , 
                                            cRow:cRow,
                                            align: rows[0].align,
                                            logged:logged
                                        });
                                    });
                            });
                    }
        });
    
    /*con.query(
        'select * from public where str=?',
        [str],
        function(err,rows){
            if(!rows.length){
                res.send('Invalid Link');
            }
            else{
                con.query(
                    'select * from '+rows[0].userid+' where id=?',
                    [rows[0].noteid],
                    function(err,row){
                        con.query('select username from users where id=?',
                                  [rows[0].userid],
                                  function(err,R){
                            con.query(
                                'select userkey from users where id=?',
                                [rows[0].userid],
                                function(err,user){
                                    var key = user[0].userkey;
                                    var name = obj.decrypt(row[0].name,key);
                                    var content = obj.decrypt(row[0].content,key);
                                    res.render('public',{name:name ,    content:content , author:R[0].username});
                                });
                        });
                    }
                );
            }
        }
    );*/
});

router.post('/comment/:str', function(req,res,next){
    var str = req.params.str;
    var comment = req.body.comment;
    var userid = obj.siStatus(req,obj,obj.cookieKey);
    
    if(!userid){
        res.send("19246918");
    }
    else{
        con.query('select username from users where id=?',[userid],function(err,rows){
            var data = {username:rows[0].username,comment:comment};
            con.query(
                "insert into p"+str+" set ?" , 
                data , 
                function(err){
                    if(err) throw err;
                    res.send(data);
                }
            );    
        });
    }
    
});

router.post('/check/iflogged',function(req,res,next){
    if(obj.siStatus(req,obj,obj.cookieKey)){
        res.send("1");
    }
    else{
        res.send(0);
    }
});


module.exports = router;