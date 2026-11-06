# เปรียบเทียบ Router `/scores`

เปรียบเทียบไฟล์ `backend/routes/Eva/score_commit.js` ใน `pretest29` และ `pretest23`

| จุดเปรียบเทียบ | pretest29 | pretest23 | ผลที่อาจเกิดขึ้น |
|---|---|---|---|
| เลือกแบบประเมิน | `order by e.id_eva` | `order by e.id_eva desc` | เมื่อมีหลายรอบ pretest29 เลือกรอบเก่าก่อน ส่วน pretest23 เลือกรอบใหม่ก่อน |
| กรองคะแนนตามรอบ | `order by d.id_eva=?` | `order by d.id_eva=?` | เหมือนกันทั้งคู่: เงื่อนไขนี้เป็นการเรียง ไม่ใช่การกรอง จึงอาจดึงคะแนนจากหลายรอบ |
| รูปแบบ response | `res.json({scores})` | `res.json(scores)` | pretest29 ห่อข้อมูลไว้ใน property `scores`; pretest23 ส่ง object คะแนนโดยตรง |
| การรวมคะแนนรายตัวชี้วัด | เก็บ `a`, `b`, `c` ตาม `status_eva` 2, 3, 4 และคูณด้วยน้ำหนัก | ทำแบบเดียวกัน | หลักการคำนวณเหมือนกัน |
| การตรวจข้อผิดพลาด | ข้อความ log/response เป็น `Error get profile` | ข้อความ log/response เป็น `Error get` | ต่างกันเฉพาะข้อความ ไม่กระทบวิธีคำนวณคะแนน |

## ผลต่อหน้า pretest29

หน้า `frontend/pages/Evaluatee/Score_commit.vue` กำหนด `scores.value = res.data` แล้วเข้าถึงคะแนนด้วย `scores[indicate.id_indicate]` แต่ API ของ pretest29 ส่ง `{ scores: ... }` ดังนั้นข้อมูลคะแนนจริงอยู่ที่ `res.data.scores` และการเข้าถึงแบบปัจจุบันอาจไม่พบคะแนน

## สรุป

pretest23 เลือกแบบประเมินล่าสุดและส่ง object คะแนนโดยตรง ส่วน pretest29 เลือกแบบประเมินเก่าก่อนและส่ง object ที่ห่อใน `{ scores }` ทั้งสองเวอร์ชันยังมีจุดผิดเหมือนกัน คือใช้ `ORDER BY d.id_eva=?` แทนการกรองรอบด้วย `WHERE d.id_eva=?` ควรตรวจรูปแบบ response ให้ตรงกับหน้าเว็บ และกรองคะแนนตาม `id_eva` ที่เลือก
