var express = require('express');
var app = express();
var data = require("./data.json");
//setup mongodb
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options =  { useNewUrlParser: true , useUnifiedTopology: true } ;

//set the view engine to ejs
app.set('view engine','ejs');

app.get("/profile", function(req, res){
    res.render('profile', {profile : data});
});

app.get("/", function(req, res){
    res.render('pages/index');
});

app.get("/students", function(req, res){
    res.render('pages/students', {profile : data});
});

app.get("/classdetail/:id", function(req, res){
    var classid = req.params.id;
    // Get the calss detail from mongodb
    MongoClient.connect(url, options,function(err, db) {
        if (err) throw err;
        var dbo = db.db("coc");
        var query = {subject_id : classid };
           dbo.collection("classroom").findOne(query,function(err, result) {
          if (err) throw err;
          console.log(result);res.render('pages/classdetail',{detail:result});
          db.close();
        });
      });
    
});

app.get("/class", function(req, res){
    //get mongodb
    MongoClient.connect(url, options,function(err, db) {
        if (err) throw err;
        var dbo = db.db("coc");
        var query = {subject_id : /^140/ };
        var sort = { subject_name : 1}
        dbo.collection("classroom").find(query).sort(sort)
          .toArray(function(err, result) {
          if (err) throw err;
          console.log(result);res.render('pages/class',{classes:result});
          db.close();
        });
      });

    
});




app.listen(8080);
console.log('Express start at http://localhost:8080');
