const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session')

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
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
    console.log('req.session islog',req.session);
    console.log('req.session.user',req.session.user);
    // if(req.session.user){
    //     console.log('req.session.user',req.session.user);
    //     next()
    // }
    // else {
    //     error='user not found'
    //     next(error);
    // }

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
        console.log('hello')
                users.push(user);
        res.redirect('/login');
    }
    else {
        error='Password not matched';
        res.render('pages/registration');
        console.log('===',data)
    }



});


app.get('/', (req, res) => {
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
    try{
        const data = req.body;
        console.log("req session",req.session)
        const existingUser = users.filter((currentUser,index)=>currentUser.email == req.body.email && currentUser.password==req.body.password);
        console.log("existingUser",existingUser);
        if(existingUser.length > 0 && existingUser[0]){
            console.log("existingUser[0]",existingUser[0]);
            req.session.user=existingUser[0];
           // res.redirect('/');
        }
        console.log('eee')

   /*     users.filter((currentUser,index)=>{
            if(currentUser.email===req.body.email && currentUser.password===req.body.password){
                console.log("currentUser",currentUser);
                req.session.user=currentUser
                console.log(" req.session.currentUser", req.session.currentUser);
                //res.redirect('/');
            }
        })*/
        res.redirect('/');
    }
    catch (e) {
        console.log('e',e);
        throw e;
    }

});







//
//
// app.post('/', (req, res) => {
//     const { todo, deleteIndex } = req.body;
//
//     if (deleteIndex !== undefined) {
//         todos.splice(deleteIndex, 1);
//     } else if (todo !== '') {
//         todos.push(todo);
//     }
//
//     res.redirect('/');
// });


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
