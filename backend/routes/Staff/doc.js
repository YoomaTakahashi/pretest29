const express =require('express')
const path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../uploads/document')
const db= require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {name_doc} = req.body
        const file = req.files?.file
        const maxSize = 10 * 1024 *1024
        if(file.size > maxSize){
            return res.status(400).json({message:"ไฟล์มีขนาดเกิน 10MB"})
        }
        const filename = Date.now() + path.extname(file.name)
        await file.mv(path.join(uploadDir,filename))
        const [rows] = await db.query(`insert into tb_doc(name_doc,day_doc,file) values(?,CURDATE(),?)`,[name_doc,filename])
        res.json(rows,{message:"save success"})
    } catch (error) {
        console.error("save error",error);
        res.status(500).json({message:"save error"})
        
    }
    
})

router.delete('/delete/:id_doc',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_doc} = req.params
        const [[d]] = await db.query(`select file from tb_doc where id_doc=?`,[id_doc])
        const fp = path.join(uploadDir,d.file)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        const [rows] = await db.query(`delete from tb_doc where id_doc = ?`,[id_doc])
        res.json(rows,{message:"delete success"})
    } catch (error) {
        console.error("delete error",error);
        res.status(500).json({message:"delete error"})
        
    }
    
})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_doc order by id_doc desc`)
        res.json(rows)
    } catch (error) {
        console.error("get error",error);
        res.status(500).json({message:"get error"})
        
    }
    
})

module.exports = router