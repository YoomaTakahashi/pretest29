const express = require('express')
const db =require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.get('/topic',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const id_member = req.user.id_member
        const [[evaCount]] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva`,[id_member])
        const id_eva = evaCount.id_eva
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where d.id_indicate=i.id_indicate and status_eva in (1) order by id_eva=?`,[id_eva])
        const result = topics.map(t=>({
            ...t, indicates:indicates.filter((i)=> i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error('Error get profile',error)
        res.status(500).json({Message:'Error get profile'})
    }
})

module.exports = router