require('dotenv').config
const express = require('express')
const rowdy = require('rowdy-logger')
// TODO: dont forget to add db once i make models 


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
    console.log("server is running on port 3000")
    rowdyRes.print()
})