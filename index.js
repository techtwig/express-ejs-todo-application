const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const app = express();
const db = require("./App/models/database");
const bcrypt = require("bcrypt");

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

async function checkLoggedIn  (req, res, next) {
    console.log('checkLoggedIn',req.body)
  if (req.session.id && req.session.userId) {
  const user = await db.users.findOne({
      where: {
        id: req.session.userId,
      },
      raw: true,
    });
  if(user){
     next();
  }
  else{
    res.redirect("/login");
  }

   
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
    
    if (password === confirmPassword) {
     const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        userName: userName,
        email: email,
        password: hashedPassword,
      };
    
      await db.users.create(user);
      res.status(200).redirect("/login");
    }
    else {
        throw new Error('password and confirmPassword not matched.');
    }
  } catch (e) {
    res.status(500);
  }

});

app.get("/", checkLoggedIn, (req, res) => {
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
        if (result) {
          res.status(200);
          req.session.userId = isExistUser.id;
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

app.get('/ping', (req, res) => {
    res.json({pong: 1});
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
