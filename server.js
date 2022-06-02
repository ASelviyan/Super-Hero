require('dotenv').config()
// required packages
const express = require('express')
const rowdy = require('rowdy-logger')
const cookieParser = require('cookie-parser')
const db = require('./models')
const cryptoJS = require('crypto-js') 
const methodOverride = require('method-override')


//app config
const app = express()
//note:
const PORT = process.env.PORT || 5000
app.set('view engine', 'ejs')

//middleware
//note: shows you the url paths in nodemon
const rowdyRes = rowdy.begin(app)
app.use(require('express-ejs-layouts'))
//note: it allows you to use the req.body and mostly needed for post and put
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(express.static('public'))

// DIY middleware
// auth middleware
app.use(async (req, res, next) => {
  try {
    // if there is a cookie -- 
    if (req.cookies.userId) {
      // try to find that user in the db
      const userId = req.cookies.userId
      const decryptedId = cryptoJS.AES.decrypt(userId, process.env.ENC_KEY).toString(cryptoJS.enc.Utf8)
      const user = await db.user.findByPk(decryptedId)
      // mount the found user on the res.locals so that later routes can access the logged in user
      // any value on the res.locals is availible to the layout.ejs
      res.locals.user = user
    } else {
      // the user is explicitly not logged in
      res.locals.user = null
    }
  
  } catch (err) {
    console.log(err)
  }finally{
    next() //like a return 
  }
})

// home page 
app.get('/', (req, res) =>{
  res.render('index.ejs')
}) 

//GET /teams 
app.get('/teams', (req, res) =>{
  res.render('teams.ejs')
})


//POST to /teams --create a spot in the table for the hero that needs t obe added 
app.post('/teams', (req, res) => {
  //if the add button gets pressed 
  //then the hero is added to the teams table 
})

//controllers
app.use('/users', require('./controllers/users'))
app.use('/heroes', require('./controllers/heroes'))

app.listen(PORT, () => {
    console.log("server is running on port 5000")
    rowdyRes.print()
})