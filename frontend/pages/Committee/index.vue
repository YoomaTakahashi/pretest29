<template>
    <v-container fluid class="py-10">
        <v-card>
            <v-sheet class="pa-4">
                <h1 class="text-h5 font-weight-bold">ดำเนินการประเมิน</h1>
            </v-sheet>
            <v-card-text>
                <v-table>
                    <thead>
                        <tr>
                            <th class="border text-center">ลำดับ</th>
                            <th class="border text-center">ชื่อ</th>
                            <th class="border text-center">นามสกุล</th>
                            <th class="border text-center">วันที่ออกแบบประเมิน</th>
                            <th class="border text-center">คะแนนประเมินตนเอง</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items, index) in result" :key="items.id_member">
                            <td class="border text-center">{{ index + 1 }}</td>
                            <td class="border text-center">{{ items.fname }}</td>
                            <td class="border text-center">{{ items.lname }}</td>
                            <td class="border text-center">{{ formatDate(items.day_eva) }}</td>
                            <td class="border text-center"><v-btn color="blue" class="text-white" size="smail" @click="go(items.id_eva)">ตรวจสอบ</v-btn></td>
                        </tr>
                        <tr>
                            <td class="text-center text-red" v-if="result.length === 0" colspan="12">ไม่พบข้อมูล</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,commit} from '../../API/base'

const token = import.meta.client ? localStorage.getItem('token') : null

const result = ref ([])


const formatDate = (dateStr:string)=>{
    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear())

    return `${day}/${month}/${year}`
}
const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/show_eva`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(error){
        console.error("Error Fetching",error)
    }
}


const go = (id_eva:number) => {
    navigateTo({path:`/Committee/Score_member${id_eva}`})
}

onMounted(fetch)


</script>

<style scoped></style>