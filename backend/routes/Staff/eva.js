const express =require('express')
const bc = require('bcrypt')
const db= require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()

//เพิ่มหัวข้อการประเมิน
router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_member,id_sys,day_eva} = req.body
        const [rows] = await db.query(`insert into tb_eva(id_member,id_sys,day_eva) values(?,?,?)`,[id_member,id_sys,day_eva])
        res.json(rows,{message:"save success"})
    } catch (error) {
        console.error("save error",error);
        res.status(500).json({message:"save error"})
        
    }
    
})

router.put('/update/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_member,id_sys,day_eva} = req.body
        const {id_eva} = req.params

        const [rows] = await db.query(`update tb_eva set id_member=?,id_sys=?,day_eva=? where id_eva = ?`,[id_member,id_sys,day_eva,id_eva])
        res.json(rows,{message:"update success"})

        
    } catch (error) {
        console.error("update error",error);
        res.status(500).json({message:"update error"})
        
    }
    
})

router.delete('/delete/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_eva} = req.params

        const [rows] = await db.query(`delete from tb_eva where id_eva = ?`,[id_eva])
        res.json(rows,{message:"delete success"})
    } catch (error) {
        console.error("delete error",error);
        res.status(500).json({message:"delete error"})
        
    }
    
})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const [rows] = await db.query(`select * from tb_system s,tb_eva e,tb_member m where  e.id_member = m.id_member and e.id_sys = s.id_sys order by id_eva desc`)
        res.json(rows)
    } catch (error) {
        console.error("get error",error);
        res.status(500).json({message:"get error"})
        
    }
    
})




module.exports = router