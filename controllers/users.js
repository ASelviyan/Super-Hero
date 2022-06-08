const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");
const cryptoJS = require("crypto-js");

//GET list of users
router.get("/", (req, res) => {
  res.render("user/teams.ejs");
});

//GET users/new
router.get("/new", (req, res) => {
  //render the new page which is the sign up page
  res.render("user/new.ejs", { msg: null });
});

//POST user/new -- create a new user
router.post("/new", async (req, res) => {
  try {
    //this will protect your password by hashing your password and go through 12 rounds of salt
    const hashedPassword = bcrypt.hashSync(req.body.password, 12);

    //create a new user by using the find of create method
    //create a new user
    const [user, userCreated] = await db.user.findOrCreate({
      //this will look if this user is already created if not then...
      where: { email: req.body.email },
      //add a new user with this hashed password
      defaults: {
        password: hashedPassword,
        username: req.body.username,
      },
    });

    //if the user is new
    if (userCreated) {
      //NOTE:
      //encrypt id ??????????????????????
      const encryptedId = cryptoJS.AES.encrypt(
        user.id.toString(),
        process.env.ENC_KEY
      ).toString();
      //create a cookie for the user
      res.cookie("userId", encryptedId);
      //render the list page
      res.redirect("/heroes");

      //if the user already exists or was not created...
    } else {
      //then re render the sing up page with a alert saying that the user already exits
      //in sign up page print the msg
      res.render("user/new.ejs", {
        msg: "email exists in database already 🤦‍♂️",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//GET users/login
router.get("/login", async (req, res) => {
  res.render("user/login.ejs", { msg: null });
});

//POST users/login --  POST means the browser will send the data to the web server to be processed. This is necessary when adding data to a database, or when submitting sensitive information, such as passwords.
router.post("/login", async (req, res) => {
  try {
    //look for the user in the database  based on there email
    const foundUser = await db.user.findOne({
      where: { email: req.body.email },
    });
    const msg = "bad login credentials, you are not authenticated!";
    //if the user is not found in the database then...
    if (!foundUser) {
      //then render the lgin page again with a message
      res.render("user/login.ejs", { msg });
      //makes sure you return here so that the function doesnt keep going
      return;
    }
    //compare the password that was given to the password in the database
    const compare = bcrypt.compareSync(req.body.password, foundUser.password);
    //if the user was found in the database then...
    if (compare) {
      console.log(req.body.password);
      console.log(foundUser.id.toString());
      //send the user a cookie! to log them in
      const encryptedId = cryptoJS.AES.encrypt(
        foundUser.id.toString(),
        process.env.ENC_KEY
      ).toString();
      console.log(encryptedId);
      res.cookie("userId", encryptedId);
      //render to the list page
      res.redirect("/heroes");
    } else {
      //if the password did not match then render the login page with a message
      res.render("user/login.ejs", { msg });
    }
  } catch (error) {
    console.log(error);
  }
});

//GET logout
router.get("/logout", async (req, res) => {
  //check if user is authorized
  res.clearCookie("userId");

  res.redirect("/");
});

//GET users/teams
router.get("/teams", async (req, res) => {
  //get all the users from the table
  const allUsers = await db.user.findAll();
  //and render the teams page
  res.render("user/teams.ejs", { allUsers });
});

//GET users/blog/:id -- render the a spacific users team why using there id
router.get("/blog/:id", async (req, res) => {
  try {
    // console.log(req.query.name)
    //this finds the spacific user through the id that was given to use from the req.params
    const foundUser = await db.user.findOne({
      where: { id: req.params.id },
    });

    //
    const currentUser = res.locals.user;
    // console.log('❤❤❤',res.locals.user)

    const team = await db.hero.findAll({
      where: { userId: foundUser.id },
    });

    // console.log('🤍❤❤❤',team[0])

    const comments = await db.comment.findAll({
      where: { teamId: req.params.id },
    });

    console.log(comments[0]);
    // console.log(team)
    res.render("user/blog.ejs", { foundUser, team, comments, currentUser });
  } catch (error) {
    console.log(error);
  }
});

//This adds comment to the team
router.post("/blog/:id", async (req, res) => {
  try {
    const comments = await db.comment.findAll();

    const newComment = await db.comment.create({
      username: req.body.username,
      comment: req.body.comment,
      rating: req.body.rating,
      teamId: req.params.id,
    });

    const findTeam = await db.hero.findOne({
      where: { userId: req.params.id },
    });

    const currentUser = await db.user.findOne({
      where: { id: res.locals.user.id },
    });

    await currentUser.addComment(newComment);
    // console.log(newComment)

    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
});

//DELETE users/blog -- delete a comment
router.delete("/blog", async (req, res) => {
  try {
    //find the comment that needs to be deleted
    const foundComment = await db.comment.findOne({
      where: {
        id: req.body.id,
      },
    });
    // console.log('❤❤❤❤❤', foundComment)
    //wait till the comment is found and then delete it
    await foundComment.destroy();
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
});

//GET users/comment
router.get("/comment/:id", async (req, res) => {
  const currentComment = await db.comment.findOne({
    where: { id: req.params.id },
  });
  // console.log(currentComment.id)
  res.render("user/editComment.ejs", { currentComment });
});

//PUT users/comment
router.put("/comment/:id", async (req, res) => {
  try {
    const currentComment = await db.comment.findOne({
      where: { id: req.params.id },
    });

    console.log("💕", currentComment);

    await currentComment.set({
      comment: req.body.comment,
      rating: req.body.rating,
      userId: currentComment.userId,
    });

    await currentComment.save();

    res.redirect(
      `/users/blog/${currentComment.userId}?id=${currentComment.userId}`
    );
  } catch (error) {
    console.log(error);
  }
});


//GET /users/profile -- render the profile page 
router.get("/profile", async (req, res) => {
  const team = await db.hero.findAll({
    where: { userId: res.locals.user.id },
  });
  
  const currentUser = res.locals.user;
  
  res.render("user/profile.ejs", { currentUser, team });
  console.log(res.locals.user);
});

//POST /profile --when the button in the details page is pressed the POST will add it to the heros table
router.post("/profile", async (req, res) => {
  try {
    const newHero = await db.hero.create(req.body);
    res.locals.user.addHero(newHero);
    res.redirect("/heroes");
  } catch (error) {
    console.log(error);
  }
});

//DELETE /profile -- delete a hero from team
router.delete("/profile", async (req, res) => {
  try {
    //find the spacific hero we are deleting from the hero table
    const foundHero = await db.hero.findOne({
      where: { name: req.body.name },
    });
    //wait till the hero is found and then delete it from the heros table
    await foundHero.destroy();
    //re direct to the /users/team page
    res.redirect("/users/profile");
  } catch (error) {
    console.log(error);
  }
});

//GET /user/editPassword -- render a from with the users info and a input box with a new password entry
router.get("/editPassword", async (req, res) => {
  const currentUser = res.locals.user;
  res.render("user/editPassword.ejs", { currentUser });
});

//put /user/editPassword --edit the awpssword 
router.put("/editPassword", async (req, res) => {
  try {
    const foundUser = await db.user.findOne({
      where: { email: req.body.email },
    });
    console.log(foundUser);

    //this will protect your password by hashing your password and go through 12 rounds of salt
    const hashedPassword = bcrypt.hashSync(req.body.password, 12);
    await foundUser.set({
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
    });

    await foundUser.save();

    res.redirect("/heroes");
  } catch (error) {
    console.log(error);
  }
});

//---------------------------------------------------------------------------------------


module.exports = router;
