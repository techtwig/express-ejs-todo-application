const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session')
const app = express();
const db = require("./App/models/database");
const bcrypt = require('bcryptjs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.set('view engine', 'ejs');

const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
    key:'user_id',
    secret: 'your-secret-key',
    resave: false,
    cookie: {
        maxAge: oneDay,secure: true 
    },
    saveUninitialized: false
}))


const todos = [];
let error;

function isLoggedIn(req,res,next) {
    console.log('isLoggedIn',req.session.id,req.cookies.user_id)
    if(req.session.id){
        console.log('req.session.user',req.session.user);
        next()
    }
    else {
        res.redirect('/login')
    }

}

app.get('/registration', (req, res) => {

    res.render('pages/registration')
});

app.post('/registration', async (req, res) => {
	
    const data = req.body;
	const user={
        userName: data.userName,
        email:data.email,
        password:data.password,
        confirmPassword:data.confirmPassword
    }

	if(user.password===user.confirmPassword){
		db.users.create(data)
	.then(()=>{
		 res.redirect('/login')
	})
	.catch(e=>console.log(e))
	}
	else {
         error='Password not matched';
         console.log('===',data)
     }

});


app.get('/', isLoggedIn,(req, res) => {
    res.render('pages/index', {todos});
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post('/login', async (req, res) => {

    try{
    const isExistUser = await db.users.findOne({
    where: {
    email: req.body.email,
     },
    raw:true,
    });


    if(isExistUser){
        req.session.userId=isExistUser.id;
        res.redirect('/');

    }
    else {
        res.redirect('/login')
    }
 } catch(err){
    res.redirect('/login')
 }

});



app.post('/', (req, res) => {
    const { todo, deleteIndex } = req.body;

    if (deleteIndex !== undefined) {
        todos.splice(deleteIndex, 1);
    } else if (todo !== '') {
        todos.push(todo);
    }

    res.redirect('/');
});


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
   .catch((err) => {
     console.log("Failed to sync db: " + err.message);
   });
