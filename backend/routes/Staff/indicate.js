const express =require('express')
const bc = require('bcrypt')
const db= require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()

//เพิ่มหัวข้อการประเมิน
router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`insert into tb_indicate(id_topic,name_indicate,detail_indicate,point_indicate,check_indicate) values(?,?,?,?,?)`,[id_topic,name_indicate,detail_indicate,point_indicate,check_indicate])
        res.json(rows,{message:"save success"})
    } catch (error) {
        console.error("save error",error);
        res.status(500).json({message:"save error"})
        
    }
    
})

router.put('/update/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const {id_indicate} = req.params

        const [rows] = await db.query(`update tb_indicate set id_topic=?,name_indicate=?,detail_indicate=?,point_indicate=?,check_indicate=? where id_indicate = ?`,[id_topic,name_indicate,detail_indicate,point_indicate,check_indicate,id_indicate])
        res.json(rows,{message:"update success"})

        
    } catch (error) {
        console.error("update error",error);
        res.status(500).json({message:"update error"})
        
    }
    
})

router.delete('/delete/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_indicate} = req.params

        const [rows] = await db.query(`delete from tb_indicate where id_indicate = ?`,[id_indicate])
        res.json(rows,{message:"delete success"})
    } catch (error) {
        console.error("delete error",error);
        res.status(500).json({message:"delete error"})
        
    }
    
})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_indicate i,tb_topic t where i.id_topic = t.id_topic order by id_indicate`)
        res.json(rows)
    } catch (error) {
        console.error("get error",error);
        res.status(500).json({message:"get error"})
        
    }
    
})

// router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
//     try {

//         const [rows] = await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member`)
//         res.json(rows)
//     } catch (error) {
//         console.error("get error",error);
//         res.status(500).json({message:"get error"})
        
//     }
    
// })

module.exports = router