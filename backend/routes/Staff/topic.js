const express =require('express')
const bc = require('bcrypt')
const db= require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()

//เพิ่มหัวข้อการประเมิน
router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {name_topic} = req.body
        const [rows] = await db.query(`insert into tb_topic(name_topic) values(?)`,[name_topic])
        res.json(rows,{message:"save success"})
    } catch (error) {
        console.error("save error",error);
        res.status(500).json({message:"save error"})
        
    }
    
})

router.put('/update/:id_topic',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {name_topic} = req.body
        const {id_topic} = req.params

        const [rows] = await db.query(`update tb_topic set name_topic=? where id_topic = ?`,[name_topic,id_topic])
        res.json(rows,{message:"update success"})

        
    } catch (error) {
        console.error("update error",error);
        res.status(500).json({message:"update error"})
        
    }
    
})

router.delete('/delete/:id_topic',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_topic} = req.params

        const [rows] = await db.query(`delete from tb_topic where id_topic = ?`,[id_topic])
        res.json(rows,{message:"delete success"})
    } catch (error) {
        console.error("delete error",error);
        res.status(500).json({message:"delete error"})
        
    }
    
})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_topic order by id_topic`)
        res.json(rows,{message:"get success"})
    } catch (error) {
        console.error("get error",error);
        res.status(500).json({message:"get error"})
        
    }
    
})

// router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
//     try {

//         const [rows] = await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member`)
//         res.json(rows,{message:"get success"})
//     } catch (error) {
//         console.error("get error",error);
//         res.status(500).json({message:"get error"})
        
//     }
    
// })

module.exports = router