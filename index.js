const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session')

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    key:'user_id',
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}))


app.set('view engine', 'ejs');

const todos = [];
const users=[{
    userName: "userName",
    email:"email",
    password:"password",
    confirmPassword:"password"
}];
let error;

function isLoggedIn(req,res,next) {
    // console.log('req.session islog',req.session);
    // console.log('req.session.user',req.session.user);
    if(req.session.user && req.cookies.user_id){
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
                users.push(user);
        res.redirect('/login');
        console.log('hello user',user)
    }
    else {
        error='Password not matched';
        res.render('pages/registration');
        console.log('===',data)
    }



});


app.get('/', isLoggedIn,(req, res) => {
    console.log(req.session);
    res.render('pages/index', {todos});
});

app.use('/',function (err, req, res, next){
    console.log('err',err)
  //  res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post('/login', async (req, res) => {
    const existingUser = users.filter((currentUser,index)=>currentUser.email == req.body.email && currentUser.password==req.body.password);

    if(existingUser.length > 0 && existingUser[0]){
        req.session.user=existingUser[0];
        res.redirect('/');
    }
    else {
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
