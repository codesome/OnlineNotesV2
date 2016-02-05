var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'gan',
    database : 'onlinenotesv2'
});

router.post('/createnote' , function(req,res,next){
    
    con.connect(function(err){
        if(err){console.log("Database Error");}
        else {console.log("Database Connected");}
    });
    
    var name = req.body.name.toString();
    var content = req.body.content.toString();
    
    con.query("insert into notes set ?" , {name:name , content:content} , function(err){if(err) throw err;})
    
    res.redirect('/profile');
});

module.exports = router;