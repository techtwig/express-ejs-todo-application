const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const app = express();
const db = require("./App/models/database");
const bcrypt = require("bcrypt");
const { log } = require("console");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    key: "user_id",
    secret: "your-secret-key",
    resave: false,
    cookie: {
      maxAge: oneDay,
    },
    saveUninitialized: false,
  })
);

const todos = [];
let error;

function isLoggedIn(req, res, next) {
  if (req.session.id && req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/registration", (req, res) => {
  res.render("pages/registration");
});

app.post("/registration", async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;
    let user;
    if (password === confirmPassword) {

     bcrypt.hash(password, 10,async function (err, hash) {
      user = {
        userName: userName,
        email: email,
        password: hash,
      };
      await db.users.create(user);
      res.status(200);
      res.redirect("/login");
    });

    }
  } catch (e) {
    console.log('===============error=============',e)
    res.status(500).json(e.message);
  }

});

app.get("/", isLoggedIn, (req, res) => {
  res.render("pages/index", { todos });
});

app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const isExistUser = await db.users.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    if (isExistUser) {
      bcrypt.compare(password, isExistUser.password, function (err, result) {
        if (result === true) {

          res.status(200);
          req.session.userId = isExistUser.id;
          console.log(' req.session.userId=====', req.session.userId, req.session);
          res.redirect("/");
        } 
        else {
          res.status(404);
        }
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    res.redirect("/login");
  }
});

app.post("/", (req, res) => {
  const { todo, deleteIndex } = req.body;

  if (deleteIndex !== undefined) {
    todos.splice(deleteIndex, 1);
  } else if (todo !== "") {
    todos.push(todo);
  }

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

db.sequelize
  .sync({force:false})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
