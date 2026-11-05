<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center">จัดการตัวชี้วัดการประเมิน</h1>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select label="หัวข้อการประเมิน" v-model="form.id_topic" :error-messages="error.id_topic" :items="topics.map((t)=>({title:t.name_topic,value:t.id_topic}))"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อตัวชี้วัด" v-model="form.name_topic" :error-messages="error.name_topic" ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-textarea label="รายละเอียดตัวชี้วัด" v-model="form.detail_indicate" :error-messages="error.detail_indicate" rows="3"></v-textarea>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="น้ำหนักคะแนน" v-model="form.point_indicate" :error-messages="error.point_indicate" :items="[1,2,3,4,5]"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="ประเภทตัวเลือก" v-model="form.check_indicate" :error-messages="error.check_indicate" :items="[{title:'มี',value:'y'},{title:'ไม่มี',value:'n'}]"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" color="primary" type="submit">{{ form.id_indicate ? 'อัปเดต':'บันทึก' }}</v-btn>
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
                                    <th class="border text-center">หัวข้อการประเมิน</th>
                                    <th class="border text-center">ชื่อตัวชี้วัด</th>
                                    <th class="border text-center">รายละเอียดตัวชี้วัด</th>
                                    <th class="border text-center">น้ำหนักคะแนน</th>
                                    <th class="border text-center">ประเภทตัวเลือก</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_indicate">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_topic }}</td>
                                    <td class="border text-center">{{ items.name_indicate }}</td>
                                    <td class="border text-center">{{ items.detail_indicate || '-' }}</td>
                                    <td class="border text-center">{{ items.point_indicate }}</td>
                                    <td class="border text-center">{{ items.check_indicate === 'y' ? 'มี':'ไม่มี' }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn class="text-white text-center ma-2" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                            <v-btn class="text-white text-center ma-2" size="small" color="error" @click="del(items.id_indicate)">ลบ</v-btn>
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


const error = ref<Record<string,string>>({})
const seacrh = ref('')
const dataResult = ref([])
const form = ref({
    id_indicate:null,
    id_topic:'',
    name_indicate:'',
    detail_indicate:'',
    point_indicate:'',
    check_indicate:''
})
const reset = ()=>{
    form.value = {
        id_indicate:null,
        id_topic:'',
        name_indicate:'',
        detail_indicate:'',
        point_indicate:'',
        check_indicate:''
    }
}
function validate(){
    const f = form.value
    error.value = {}
    if(!f.id_topic)error.value.id_topic = 'เลือกหัวข้อการประเมิน'
    if(!f.name_indicate.trim())error.value.name_indicate = 'กรุณากรอกชื่อตัวชี้วัด'
    if(!f.point_indicate)error.value.point_indicate = 'กรุณาเลือกน้ำหนักคะแนน'
    if(!f.check_indicate)error.value.check_indicate = 'กรุณาเลือกประเภทตัวเลือก'

    return Object.keys(error.value).length === 0
}

const token = import.meta.client ? localStorage.getItem('token'):null
const saveMember = async()=>{
    if(!validate())return
    const f = form.value
    try {
        f.id_topic
        ? await axios.put(`${staff}/indicate/update/${f.id_indicate}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/indicate/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        alert('ดำเนินการสำเร็จ')
        await reset()
        await fetch()
    } catch (error) {
        console.error("Error save",error);
        
    }

}

const fetch = async()=>{
    try {
        
        const res = await axios.get(`${staff}/indicate/show`,{headers:{Authorization:`Bearer ${token}`}})
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
            item.name_indicate.toLowerCase().includes(s)
        )
    })
})

const edit = (item:any)=>{

    form.value = {...item}

}

const del = async(id_indicate:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/indicate/delete/${id_indicate}`,{headers:{Authorization:`Bearer ${token}`}})
        await reset()
        await fetch()
    } catch (error) {
        console.error("Error delete",error);
        
    }
}
</script>

<style scoped>

</style>