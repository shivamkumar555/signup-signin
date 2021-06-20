var express=require("express");
var bodyParser=require("body-parser");
var bcrypt = require('bcrypt');

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/employee",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log('connection is successful');
}).catch((e)=>{
    console.log('no connection');
})
var db=mongoose.connection;
var app=express();
  
  app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/sign_up', function(req,res){
    
    var cpass=req.body.confirmpassword;
    var name = req.body.name;
    var employeeid=req.body._id;
    var email =req.body.email;
    var pass = req.body.password;
    var phone =req.body.phone;
    var gender =req.body.gender;

    const salt = bcrypt.genSaltSync(10);
const hashpass = bcrypt.hashSync(pass, salt);
const hashcpass = bcrypt.hashSync(cpass, salt);

    var data = {
        "name": name,
        "_id":employeeid,
        "email":email,
        "password":hashpass,
        "confirmpassword":hashcpass,
        "phone":phone,
        "gender":gender,
    }
    
    if(pass===cpass)
    {
db.collection('information').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
    }
else{
   return res.send("password are not matching");
    }
return res.redirect('signup_success.html');
})
  
app.post('/login', function(req,res){
    

    var employeeid = req.body._id;
    var pass = req.body.password;
    var data = {
        "_id": employeeid,  
    
    }
    db.collection('information').findOne(data,function(err, collection){
        if (err) throw err;
        console.log(collection);
    
        if(collection==null)
          return res.send("INVALID DATA");
          else
          {
              if(bcrypt.compareSync(pass,collection.password)==true)
              {
                return  res.send(collection)  ;
              }
              else
              return res.send("INVALID DATA");
          }
        
          
    });
     
})
app.get('/login',function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
        });
    return res.redirect('login.html');
    })
app.get('/',function(req,res){
res.set({
    'Access-control-Allow-Origin': '*'
    });
return res.redirect('index.html');
})
app.listen(3000);
  
  
console.log("server listening at port 3000");