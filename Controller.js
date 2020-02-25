var con = require('./conn')


module.exports = function(app,us){
	app.post('/ap', (req,res,next)=>{
		name = req.body.dt1;
		surname = req.body.dt2;
		pass = req.body.dt3;
	
	console.log('I m here!'+ name + '\n' + surname+'\n'+pass);
	
	
  console.log("Connected!");
  con.query("insert into users(name,surname,password) values ('"+name+"','"+surname+"','"+pass+"')",(err,res)=>{
	  if(err) throw err;
	  console.log("1 record inserted!");
	  
  })
	
});

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
			console.log("findit")
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

app.get('/ans',function(req,res,next){
  console.log("tak "+us)
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

	
	
	
}