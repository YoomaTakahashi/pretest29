const express = require('express')
const mysql2 = require('mysql2')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const [rows] = await db.query(`SELECT TABLE_NAME as name from information_schema.TABLES where TABLE_SCHEMA = DATABASE() and TABLE_TYPE = 'BASE TABLE' order by TABLE_NAME desc`)
        res.json(rows)
    } catch (error) {
        console.error("Error get",error);
        res.status(500).json({message:"Error get"})
    }
})

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
            const request = req.body?.tables
            if(!Array.isArray(request) || request.length === 0 || request.some(name => typeof name !== 'string')){
                return res.status(400).json({message:'กรุณาเลือกตาราง'})
            }
            const [avaiRows] = await db.query(`select TABLE_NAME AS name from information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() and TABLE_TYPE = 'BASE TABLE' `)
            const avaitables = new Set(avaiRows.map(row => row.name))
            const tables = [...new Set(request)]
            if(tables.some(table => !avaitables.has(table))){
                return res.status(400).json({message:"ไม่พบตารางที่เลือก"})
            }
            const quote = value => `\`${value.replace(/`/g,'``')}\``
            const dump = [
                `-- NTC EVALUATION SYSTEM database backup`,
                `-- Generate at ${new Date().toISOString()}`,
                `SET NAMES utf8mb4;`,
                `SET FOREIGN_KEY_CHECKS=0;`,
                ''
            ]
            for(const table of tables){
                const quoteTable = quote(table)
                const [create] = await db.query(`SHOW CREATE table ${quoteTable}`)
                dump.push(`-- Structure for table ${table}`)
                dump.push(`DROP TABLE IF EXISTS ${quoteTable};`)
                dump.push(`${create[0]['Create Table']};`)

                const [rows] = await db.query(`SELECT * FROM ${quoteTable}`)
                if(rows.length > 0){
                    const col = Object.keys(rows[0])
                    const colList = col.map(quote).join(', ')
                    const  placeholders = col.map(()=> '?').join(', ')
                    const insert = `insert into ${quoteTable} (${colList}) values(${placeholders})`
                    dump.push(`-- Data for table ${table}`)
                    for(const row of rows){
                        dump.push(`${mysql2.format(insert,col.map(col=> row[col]))};`)
                    }
                }
                dump.push('')
            }
            dump.push('SET FOREIGN_KEY_CHECKS=1;')
            res.setHeader('Content-Type','application/sql; charset=utf-8')
            res.setHeader('Content-Dipositon','attachment; filename="database-backup.sql;')
            res.send(dump.join('\n'))

    } catch (error) {
        console.error("error export",error);
        res.status(500).json({message:"Error export"})
    }
})

module.exports = router