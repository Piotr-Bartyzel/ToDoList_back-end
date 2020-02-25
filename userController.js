var con = require('./conn')
var express = require('express');
var router = express.Router();

var id;
var sess;
response = (mes,ses,res) => {
	res.json({
					'message': mes,
					'session': ses,
					'user': null
					});
}

router.post('/ap', (req,res,next)=>{
		name = req.body.dt1;
		surname = req.body.dt2;
		pass = req.body.dt3;
	
	
  console.log('I m here!'+ name + '\n' + surname+'\n'+pass);

  con.query("select * from users where name='"+name+"'",(err,result)=>{
	  if(err) throw err;
			if(result == ""){
				con.query("insert into users(name,surname,password) values ('"+name+"','"+surname+"','"+pass+"')",(err,result)=>{
					if(err) throw err;
					console.log("1 record inserted!");
					response('Add new account!','',res);
	  
				})
			}
	  else response('This account exist!','',res);
		 
  })
 
	
});
router.delete('/del',(req,res,next)=>{

	del = req.body.del
	con.query("delete from users where name='"+del+"'",(err,result)=>{
			if(err) throw err;
			sess=null;
			response('Delete!',null,res);
	})
})
router.post('/ch',(req,res,next)=>{
	
	lo = req.body.lo;
	name = req.body.dt1;
	pass = req.body.dt2;
	
	if(lo!=1){
	console.log('I m here!'+ name + '\n'+pass);
	
	
	console.log("Connected!");
	con.query("select * from users where name='"+name+"' and password='"+pass+"'",(err,result)=>{
		if(err) throw err;
					if(result != "" &&( name== result[0].name && pass == result[0].password)){
					console.log("findit "+result[0].name+ " "+result[0].id)
					sess = req.session;
					id = result[0].id
					sess.initialised = true;
					sess.x = name;
					response('Ok!',sess.x,res);				
					}	  
			
			else {
					console.log(":/")
					response('I can\'t see this account',null,res);				
			}
	})
	}
	else {
		console.log("log out!")
		sess=null;
		response('log_out','',res);	
	}

})

router.post('/ans',function(req,res,next){
  usr = req.body.session;

  console.log("takie "+usr)
  
if(usr!=null && usr!='null'){
	if(usr.length>0){
		
		con.query("select id from users where name='"+usr+"'",(err,result)=>{
		if(err) throw err;
		console.log("result "+result[0].id);
			id=result[0].id
			
		})
		if(sess.cookie.maxAge<=0) sess.x = null;
		 res.json({
		'time': sess.cookie.maxAge,
		'session': sess.x
		
		})
		
		
	}
	
} else sess = null

  
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
		con.query("delete from tasks where tasks='"+todo+"' and id_u='"+id+"'",(err,result)=>{
			if(err) throw err;
			else{	console.log("1 record delete!")
					del =1;
					res.status(200).json({
					message: 'Ok!'
					});
			}
		})
		
	}

})

router.get('/gettodo',(req,res,next)=>{
		console.log("id: "+id)
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