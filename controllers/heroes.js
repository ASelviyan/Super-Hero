const { default: axios } = require('axios')
const express = require('express')
const router = express.Router()
router.get('/list', (req, res) => {
  res.render('list/index.ejs')
})


router.post('/list', async(req, res) =>{
  let heroURL = `https://superheroapi.com/api/${process.env.API_KEY}/search/${req.body.name}`
  const heroesData = await axios.get(heroURL)
  // console.log(heroesData.data.results[0])
  res.render('list/details.ejs', {heroesData: heroesData.data.results[0]})
})

router.get('/details', (req, res) =>{
  res.render('list/details.ejs')
})

module.exports = router