const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const todos = [];

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

app.get('/ping', (req, res) => {
    res.json({pong: 1});
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
