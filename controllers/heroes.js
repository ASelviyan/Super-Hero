const { default: axios } = require('axios')
const express = require('express')
const router = express.Router()


router.get('/list', (req, res) => {
  res.render('list/index.ejs', {msg:null})
})



router.get('/list/details', async (req, res) =>{
    try {
      let heroURL = `https://superheroapi.com/api/${process.env.API_KEY}/search/${req.query.name}`
  const heroesData = await axios.get(heroURL)
  // console.log('❤❤❤❤❤',heroesData)
  if(heroesData.data.results.length !== 0){
res.render('list/details.ejs', {heroesData: heroesData.data.results})
  }else{
    res.render('list/index.ejs', {msg: 'Hero Not Found'})
  }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router