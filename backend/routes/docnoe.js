const express = require('express')
const db = require('../db.js')
const router = express.Router()

router.get('/',async(req,res)=>{
    try {
        const [rows] = await db.query(`select * from tb_doc where id_doc`)
        res.json(rows)
    } catch (error) {
        console.error('Error get ',error)
        res.status(500).json({message:'Error get'})
    }
})
module.exports = router