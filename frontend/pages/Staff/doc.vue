<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center">เอกสารและคู่มือการประเมิน</h1>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อเอกสาร" v-model="name_doc" :error-messages="error.name_doc" prepend-inner-icon="mdi-file-edit"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-file-input label="เอกสาร" v-model="file" :error-messages="error.file" prepend-inner-icon="mdi-file-edit" accept=".pdf" hint="รองรับเฉพาะไฟล์ PDF ขนาด 10MB" persistent-hint></v-file-input>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" color="primary" type="submit">บันทึก</v-btn>
                                        <v-btn class="text-center ma-2" color="error" @click="reset()">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-text-field label="ค้นหา" v-model="seacrh" prepend-inner-icon="mdi-magnify" class="mt-3"></v-text-field>
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อเอกสาร</th>
                                    <th class="border text-center">วันที่ออกเอกสาร</th>
                                    <th class="border text-center">เอกสาร</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_doc">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_doc }}</td>
                                    <td class="border text-center">{{ formatDate(items.day_doc) }}</td>
                                    <td class="border text-center"><v-btn class="text-center text-white" size="small" color="info" @click="view(items.file)">เปิดดู</v-btn></td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn class="text-white text-center ma-2" size="small" color="error" @click="del(items.id_doc)">ลบ</v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-red" v-if="result.length===0" colspan="12">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'

const file = ref<File | null>(null)
const error = ref<Record<string,string>>({})
const seacrh = ref('')
const dataResult = ref([])
const name_doc = ref('')
const reset = ()=>{
    name_doc.value = ''
    file.value = null
}
const token = import.meta.client ? localStorage.getItem('token'):null
const saveMember = async()=>{
    if(!name_doc.value && !file.value)return alert('กรอกข้อมูลให้ครบถ้วน')
    const maxSize = 10 *1024 * 1024
    if(file.value?.size > maxSize){
        alert('ไฟล์มีขนาดใหญ่กว่า 10MB')
    }
    const formdata = new FormData
    formdata.append('file',file.value!)
    formdata.append('name_doc',name_doc.value)
    try {
        
        await axios.post(`${staff}/doc/save`,formdata,{headers:{Authorization:`Bearer ${token}`}})
        alert('ดำเนินการสำเร็จ')
        await reset()
        await fetch()
    } catch (error) {
        console.error("Error save",error);
        
    }

}

const fetch = async()=>{
    try {
        
        const res = await axios.get(`${staff}/doc/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data

    } catch (error) {
        console.error("Error get",error);
        
    }
}

const result = computed(()=>{
    if(!seacrh.value)return dataResult.value
    const s = seacrh.value.toLowerCase()
    return dataResult.value.filter((item:any)=>{
        return(
            item.name_doc.toLowerCase().includes(s)
        )
    })
})

const formatDate = (dateStr:string)=>{
    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear())

    return `${day}/${month}/${year}`
}

const view = (file:string)=>{
    const url = new URL(`/uploads/document/${file}`,api).href
    window.open(url,'_blank')
}


const del = async(id_doc:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/doc/delete/${id_doc}`,{headers:{Authorization:`Bearer ${token}`}})
        await reset()
        await fetch()
    } catch (error) {
        console.error("Error delete",error);
        
    }
}
</script>

<style scoped>

</style>