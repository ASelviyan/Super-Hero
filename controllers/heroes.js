const express = require('express')
const router = express.Router()

router.get('/list', (req, res) =>{
  res.render('list/index.ejs')
})

router.get('/details', (req, res) =>{
  res.render('list/details.ejs')
})

module.exports = router