const express = require('express')
const router = express.Router()

//GET hero list
router.get('/', (req, res) =>{
    res.render('list/index.ejs')
})

///GET users/login 
router.get('/login', (req, res) =>{
    // render the login page 
    res.render('user/login.ejs')
})

//GET users/signup
router.get('/signup', (req,res) => {
    //render the signup page 
    res.render('user/signup.ejs')
})

//POST user/signup -- create a new user
router.post('/signup', (req,res) =>{
    //if a new user was created {
    //then res.render list page 
//}else {
    //tell them to ue an email that hasnt been used before
    //res.render(/user/signup) back to the sign up page 
    //}
//}


})

module.exports = router