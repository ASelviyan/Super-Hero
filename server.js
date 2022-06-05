require("dotenv").config();
// required packages
const express = require("express");
const rowdy = require("rowdy-logger");
const cookieParser = require("cookie-parser");
const db = require("./models");
const cryptoJS = require("crypto-js");
const methodOverride = require("method-override");

//app config
const app = express();
//note:
const PORT = process.env.PORT || 5000;
app.set("view engine", "ejs");

//middleware
//note: shows you the url paths in nodemon
const rowdyRes = rowdy.begin(app);
app.use(require("express-ejs-layouts"));
//note: it allows you to use the req.body and mostly needed for post and put
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static("public"));

// DIY middleware
// auth middleware
app.use(async (req, res, next) => {
  try {
    // if there is a cookie --
    if (req.cookies.userId) {
      // try to find that user in the db
      const userId = req.cookies.userId;
      const decryptedId = cryptoJS.AES.decrypt(
        userId,
        process.env.ENC_KEY
      ).toString(cryptoJS.enc.Utf8);
      const user = await db.user.findByPk(decryptedId);
      // mount the found user on the res.locals so that later routes can access the logged in user
      // any value on the res.locals is availible to the layout.ejs
      res.locals.user = user;
    } else {
      // the user is explicitly not logged in
      res.locals.user = null;
    }
  } catch (err) {
    console.log(err);
  } finally {
    next(); //like a return
  }
});

// home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

//GET /teams
app.get("/teams", (req, res) => {
  res.render("teams.ejs");
});

//controllers
app.use("/users", require("./controllers/users"));
app.use("/heroes", require("./controllers/heroes"));


app.use((req, res, next) => {
  // render a 404 template
  res.status(404).render('404.ejs')
})

// 500 error handler
// needs to have all 4 params
app.use((error, req, res, next) => {
  // log the error
  console.log(error)
  // send a 500 error template
  res.status(500).render('500.ejs')
})
 
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  rowdyRes.print();
});
