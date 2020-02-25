var http = require('http');
var express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session')
var Controller = require('./userController');
var con = require('./conn')
const app = express();
 var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({secret:'hejooo', user:0, cookie: { maxAge: 30000, sameSite: true}}));
app.use(cookieParser());


var tm =-2;

const __driname = './';
   app.use(cors({
        origin: 'http://10.0.0.8:3000',
        credentials: true
    }));


	
var userC = require('./userController');
app.use(userC);
	

app.listen(8080,()=> console.log('Connect!'));