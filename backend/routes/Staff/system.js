const express =require('express')
const bc = require('bcrypt')
const db= require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()

//เพิ่มหัวข้อการประเมิน
router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {day_open,day_out,round_sys,year_sys,status_sys} = req.body
        const [rows] = await db.query(`insert into tb_system(day_open,day_out,round_sys,year_sys,status_sys) values(?,?,?,?,?)`,[day_open,day_out,round_sys,year_sys,status_sys])
        res.json(rows,{message:"save success"})
    } catch (error) {
        console.error("save error",error);
        res.status(500).json({message:"save error"})
        
    }
    
})

router.put('/update/:id_sys',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {day_open,day_out,round_sys,year_sys,status_sys} = req.body
        const {id_sys} = req.params

        const [rows] = await db.query(`update tb_system set day_open=?,day_out=?,round_sys=?,year_sys=?,status_sys=? where id_sys = ?`,[day_open,day_out,round_sys,year_sys,status_sys,id_sys])
        res.json(rows,{message:"update success"})

        
    } catch (error) {
        console.error("update error",error);
        res.status(500).json({message:"update error"})
        
    }
    
})

router.delete('/delete/:id_sys',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_sys} = req.params

        const [rows] = await db.query(`delete from tb_system where id_sys = ?`,[id_sys])
        res.json(rows,{message:"delete success"})
    } catch (error) {
        console.error("delete error",error);
        res.status(500).json({message:"delete error"})
        
    }
    
})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_system order by id_sys desc`)
        res.json(rows)
    } catch (error) {
        console.error("get error",error);
        res.status(500).json({message:"get error"})
        
    }
    
})

router.get('/showY',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_system where status_sys = 'y' order by id_sys desc`)
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