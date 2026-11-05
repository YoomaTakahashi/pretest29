<template>
    <v-container fluid class="py-10">
        <v-card>
            <v-sheet class="pa-4">
                <h1 class="text-h5 font-weight-bold">ตรวจสอบและยืนยันผล</h1>
            </v-sheet>
            <v-card-text>
                <v-table>
                    <thead>
                        <tr>
                            <th class="border text-center">ลำดับ</th>
                            <th class="border text-center">ชื่อ</th>
                            <th class="border text-center">นามสกุล</th>
                            <th class="border text-center">วันที่ออกแบบประเมิน</th>
                            <th class="border text-center">รอบการประเมิน</th>
                            <th class="border text-center">ผลการประเมิน</th>
                            <th class="border text-center">ยืนยันการประเมิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items, index) in result" :key="items.id_member">
                            <td class="border text-center">{{ index + 1 }}</td>
                            <td class="border text-center">{{ items.fname }}</td>
                            <td class="border text-center">{{ items.lname }}</td>
                            <td class="border text-center">{{ items.day_eva }}</td>
                            <td class="border text-center">รอบการประเมินที่{{ items.round_sys }} ปี {{ year_sys }}</td>
                            <td class="border text-center"><v-btn color="blue" class="text-white" size="smail" @click="check(items.id_eva)">ตรวจสอบ</v-btn></td>
                            <td class="border text-center">
                                <v-btn v-if="items.signature" color="success" class="text-white" size="smail" @click="go(items.id_eva)">ยืนยันผลแล้ว</v-btn>
                                <v-btn v-else color="blue" class="text-white" size="smail" @click="go(items.id_eva)">ตรวจสอบ</v-btn>
                            </td>
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

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/check`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(error){
        console.error("Error Fetching",error)
    }
}


const go = (id_eva:number) => {
    navigateTo({path:`/Committee/Score_commit${id_eva}`})
}
const check = (id_eva:number) => {
    navigateTo({path:`/Committee/Signature${id_eva}`})
}

onMounted(fetch)


</script>

<style scoped></style>