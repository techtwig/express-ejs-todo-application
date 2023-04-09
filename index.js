const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./core/dbsqlite');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/User');
const sessionChecker = require("./middlewares/authGuard");

const app = express();
require('dotenv').config();

app.use(express.static('public'));

app.use(express.json());


app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

sequelize.sync().then(() => console.log('DB connected successfully'));

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 60 * 60 * 24,
	},
}));

const todos = [];

app.get('/', sessionChecker, (req, res) => {
	context = { todos }
    res.render('pages/index', context );
});

app.get('/signup', (req, res) =>{
	res.render('pages/signup', {});
});

app.get('/login', (req, res) =>{
	res.render('pages/login', {});
});

app.post('/signup', async (req, res) =>{
	const plainTextPassword = req.body.password;
	const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
	try{
		const userInfo={
			name: req.body.name,
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword
		}
		console.log(userInfo);
		User.create(userInfo).then(() => {
		res.redirect('/login');
	});
	}catch{
		res.status(401).json({
				"error": "Signup failed!"
			});
	}
});

app.post("/login", async (req, res) => {
	try{
	const user = await User.findOne({where:{username: req.body.username}, raw:true});
	
		if(user){
			const isValidPassword = await bcrypt.compare(req.body.password, user.password);
			
			
			if(isValidPassword){
				//generating session
				req.session.userAuthenticated = user;
				res.redirect('/');
			}else{
				res.status(401).json({
				"error": "Authentication failed."
			});
			
			}
			
		}else{
			res.status(401).json({
				"error": "Authentication failed."
			});
		}
		
	}catch (e){
		res.status(401).json({
				"error": "Authentication failed."
			});
	}
});

app.post('/', sessionChecker, (req, res) => {
    const { todo, deleteIndex } = req.body;

    if (deleteIndex !== undefined) {
        todos.splice(deleteIndex, 1);
    } else if (todo !== '') {
        todos.push(todo);
    }

    res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
