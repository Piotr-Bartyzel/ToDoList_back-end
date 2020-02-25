var http = require('http');
var express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session')
var Controller = require('./Controller');
var con = require('./conn')
const app = express();
 var cors = require('cors');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({secret:'hejooo', user:0, cookie: { maxAge: 30000 }}));
app.use(cookieParser());

var tm =-2;

const __driname = './';
   app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
	



app.get('/',(req,res)=> {console.log('get!')
res.json({
		'name': 'hejo',
		'number': 2,
		'sth': 'wewewe',
		'sth2': 'aaaa',
	})
});
app.post('/ap', Controller.addOne);

/*
app.post('/ap',(req,res)=>{
	name = req.body.dt1;
	surname = req.body.dt2;
	pass = req.body.dt3;
	
	console.log('I m here!'+ name + '\n' + surname+'\n'+pass);
	
	
  console.log("Connected!");
  con.query("insert into users(name,surname,password) values ('"+name+"','"+surname+"','"+pass+"')",(err,res)=>{
	  if(err) throw err;
	  console.log("1 record inserted!");
	  
  })



})

*/
	var sess;
	var timer;
	var us=0;
	
	
	
app.post('/ch',(req,res,next)=>{
	
//res.header("Access-Control-Allow-Origin: *");
	console.log("jestem!")
	lo = req.body.lo;
	name = req.body.dt1;
	pass = req.body.dt2;
	if(lo!=1){
	console.log('I m here!'+ name + '\n'+pass);
	
	
  console.log("Connected!");
  con.query("select * from users where name='"+name+"' and password='"+pass+"'",(err,result)=>{
		if(err) throw err;
	 // console.log(result[0].name);
			if(result != ""){
					if( name== result[0].name && pass == result[0].password){
		
		    sess = req.session;
		
			sess.initialised = true;
			sess.x = 1;
			us = 1;
	
					}
	  
	  
	 }
			else {
		us=2;
		  console.log(":/")
		
	  }
  })
	}
	else {
		console.log("log out!")
		sess=null;
		us=0;
		
	}



})

app.post('/todo',function(req,res,next){

	todo = req.body.data;
	del = req.body.del;
	if(del!=1){
	console.log("Co zrobic: "+todo)	
  
  con.query("insert into tasks(tasks,finish) values ('"+todo+"','0')",(err,res)=>{
	  if(err) throw err;
	  console.log("1 record inserted!")
  })
	}
	else{
		con.query("update tasks set finish='1' where tasks='"+todo+"'",(err,res)=>{
			if(err) throw err;
			else{	console.log("1 record update!")
			del =1;
			}
  })
		
	}

})
app.get('/gettodo',(req,res,next)=>{
	  con.query("select * from tasks where finish='0'",(err,result)=>{
		if(err) throw err;
	 // console.log(result[0].name);
			if(result != ""){
					res.json({
						'resp': result
					})
	  
	  
	 }
		
  })
})
app.get('/ans',function(req,res,next){
 // console.log("tak")
	if(us==1){console.log("time to end: " + sess.cookie.maxAge)
		 res.json({
		'session': sess.cookie.maxAge,
		
	})
		if(sess.cookie.maxAge<=0) us=0;
	}
	else if(us==2){
		
		let myFirstPromise = new Promise((resolve, reject) => {
	res.json({
		'session': -1000
	})
	resolve("Success!");
		})
 myFirstPromise.then((successMessage) => {

	console.log("Yay! "+ successMessage);
	setTimeout(()=>{us=0},100)
});

		 
	//us=0;
	}
	
})



app.listen(8080, ()=> console.log('Connect!'));