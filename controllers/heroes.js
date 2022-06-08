const { default: axios } = require('axios')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
  res.render('list/index.ejs', {msg:null})
})



router.get('/details', async (req, res) =>{
    try {
      let heroURL = `https://superheroapi.com/api/${process.env.API_KEY}/search/${req.query.name}`
      const heroesData = await axios.get(heroURL)
      
      if(heroesData.data.response === 'success'){
        res.render('list/details.ejs', {heroesData: heroesData.data.results})
      }else{
        res.render('list/index.ejs', {msg: 'Hero Not Found'})
      }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router