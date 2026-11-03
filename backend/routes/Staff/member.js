const express =require('express')
const bc = require('bcrypt')
const db= require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {fname,lname,email,username,password,role} = req.body
        const hash = await bc.hash(password,10)
        const [rows] = await db.query(`insert into tb_member(fname,lname,email,username,password,role) values(?,?,?,?,?,?)`,[fname,lname,email,username,hash,role])
        res.json(rows,{message:"save success"})
    } catch (error) {
        console.error("save error",error);
        res.status(500).json({message:"save error"})
        
    }
    
})

router.put('/update/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {fname,lname,email,username,password,role} = req.body
        const {id_member} = req.params
        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            const [rows] = await db.query(`update tb_member set fname=?,lname=?,email=?,username=?,password=?,role=? where id_member = ?`,[fname,lname,email,username,hash,role,id_member])
            res.json(rows,{message:"update success"})
        }else{
            const [rows] = await db.query(`update tb_member set fname=?,lname=?,email=?,username=?,role=? where id_member = ?`,[fname,lname,email,username,role,id_member])
            res.json(rows,{message:"update success"})
        }
        
    } catch (error) {
        console.error("update error",error);
        res.status(500).json({message:"update error"})
        
    }
    
})

router.delete('/delete/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_member} = req.params

        const [rows] = await db.query(`delete from tb_member where id_member = ?`,[id_member])
        res.json(rows,{message:"delete success"})
    } catch (error) {
        console.error("delete error",error);
        res.status(500).json({message:"delete error"})
        
    }
    
})

router.get('/showE',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_member where role='ผู้รับการประเมินผล' order by id_member`)
        res.json(rows,{message:"get success"})
    } catch (error) {
        console.error("get error",error);
        res.status(500).json({message:"get error"})
        
    }
    
})

router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member`)
        res.json(rows,{message:"get success"})
    } catch (error) {
        console.error("get error",error);
        res.status(500).json({message:"get error"})
        
    }
    
})

module.exports = router