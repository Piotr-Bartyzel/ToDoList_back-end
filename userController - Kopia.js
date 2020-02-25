var con = require('./conn')
var express = require('express');
var router = express.Router();

var us=0;
var user;
var id;
var sess;

router.post('/ap', (req,res,next)=>{
		name = req.body.dt1;
		surname = req.body.dt2;
		pass = req.body.dt3;
	
	

	console.log('I m here!'+ name + '\n' + surname+'\n'+pass);
	
	
  console.log("Connected!");
  con.query("select * from users where name='"+name+"'",(err,result)=>{
	  if(err) throw err;
			if(result == ""){
				con.query("insert into users(name,surname,password) values ('"+name+"','"+surname+"','"+pass+"')",(err,result)=>{
					if(err) throw err;
					console.log("1 record inserted!");
					res.json({
					'message': 'Add new account!'
					});
	  
				})
			}
	  else console.log("find")
		 
  })
 
	
});
router.delete('/del',(req,res,next)=>{

	del = req.body.del
	con.query("delete from users where name='"+del+"'",(err,result)=>{
			if(err) throw err;
			sess=null;
			us=0;
			res.status(200).json({
			message: 'Delete!'
			});
	})
})
router.post('/ch',(req,res,next)=>{
	

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
					console.log("findit "+result[0].name+ " "+result[0].id)
					sess = req.session;
					id = result[0].id
					sess.initialised = true;
					sess.x = 1;
					us = 1;
					user= name
					res.status(200).json({
					message: 'Ok!',
					
					});
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

router.get('/ans',function(req,res,next){
  console.log("tak "+us)
	if(us==1){console.log("time to end: " + sess.cookie.maxAge)
		 res.json({
		'session': sess.cookie.maxAge,
		'user': user
		
		})
		if(sess.cookie.maxAge<=0) us=0;
	}
	else if(us==2){
		
		let myFirstPromise = new Promise((resolve, reject) => {
		res.json({
		'session': -1000,
		
		})
		resolve("Success!");
		})
 myFirstPromise.then((successMessage) => {

	console.log("Yay! "+ successMessage);
	us=0;
	
});

		 
	
	}
	
})
	
router.post('/todo',function(req,res,next){

	todo = req.body.data;
	del = req.body.del;
	console.log("del: "+del)	
	if(del!=1){
		console.log("Co zrobic: "+todo)	
  
		con.query("insert into tasks(tasks,finish,id_u) values ('"+todo+"','0','"+id+"')",(err,result)=>{
			if(err) throw err;
			console.log("1 record to do inserted!")
			res.status(200).json({
			message: 'Ok!'
			});
		})
	}
	else{
		con.query("update tasks set finish='1' where tasks='"+todo+"'",(err,result)=>{
			if(err) throw err;
			else{	console.log("1 record update!")
					del =1;
					res.status(200).json({
					message: 'Ok!'
					});
			}
		})
		
	}

})

router.get('/gettodo',(req,res,next)=>{
	  con.query("select * from tasks where finish='0' and id_u='"+id+"'",(err,result)=>{
		if(err) throw err;
	 
			if(result != ""){
					res.json({
						'resp': result
					})
	  
	  
	 }
		
  })
})

module.exports = router;