const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const todos = [];
const users=[];
let error;

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post('/login', (req, res) => {
    const data = req.body;
    console.log('===',data)


    res.redirect('/');
});
app.get('/registration', (req, res) => {
    console.log({res,req})

    res.render('pages/registration',{userName:'dd'})
});

app.post('/registration', async (req, res) => {
    const data = req.body;
    const user={
        userName: data.userName,
        email:data.userName,
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
    res.render('pages/index', { todos });
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
