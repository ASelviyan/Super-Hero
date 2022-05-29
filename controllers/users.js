const express = require('express')
const router = express.Router()

//GET hero list
router.get('/', (req, res) =>{
    res.render('list/index.ejs')
})



module.exports = router