
const fs    = require('fs');
const async = require('async');
const path  = require('path');
var express =require('express');
var bodyParser=require('body-parser');
var ejs= require('ejs');
var app=express();


var testFolder = __dirname + '/';

var current = testFolder;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/Git-Heat week 1',express.static(__dirname + '/views'));

function currentDirectory(test)
{
var directorySize =function(folder)
{
  var fs = fs || require('fs');
  var size=0;
  files=fs.readdirSync(folder);
  files.forEach(function(file){
    var stats = fs.statSync(folder+file);
    if(stats.isDirectory())
    {
      size+= directorySize(folder + file +'/');
    }
    else
    size+=stats.size;
    
  });
  return size;
}
var result=[];
var resultdirectory=[];
fs.readdirSync(test).forEach(file =>{
  var stats = fs.statSync(test+file);
  if(stats.isDirectory())
  {
    var size = directorySize(test + file +'/');
    var data={
      name : file,
      storage : size
    };
    result.push(data);
  }
  else
  {
    var data={
      name : file,
      storage : stats.size
    };
    result.push(data);
  }
});
return result;
}


app.get('/',(req,res)=>{
  var answer = currentDirectory(testFolder);
  current = testFolder;
  app.set('view engine','ejs');
  res.render('home',{display : answer, dir : testFolder});
}).listen(3000);

app.post('/child',(req,res)=>{
  var currentdir= req.body.directory;
  var child=current + req.body.name + '/';
  current=child;
  var answer = currentDirectory(child);
  app.set('view engine','ejs');
  res.render('home',{display : answer, dir : child});
});

app.post('/parent',(req,res)=>{
  var currentdir2= req.body.directory2;
  var parent = (path.dirname(current))+'/';
  current=path.dirname(current) + '/';
  var answer2 = currentDirectory(parent);
  app.set('view engine','ejs');
  res.render('home',{display : answer2, dir : parent});
});