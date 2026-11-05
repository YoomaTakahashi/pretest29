<template>
    <v-container>
        <v-card class="round" elevation="5" rounded>
            <v-sheet elevation="5" rounded class="pa-4 ">
                <h1 class="text-center font-weight bold">DashBoard - Evaluatee</h1>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="4" v-for="b in box" :key="b">
                            <v-card elevation="5" rounded="5" class="round py-2">
                                <div class="pa-1 text-center"><h2>{{ b.title }}</h2></div>
                                <div class="pa-1 text-center"><h1>{{ b.value }}</h1></div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-sheet>
        </v-card>
        <v-card class="mt-3 round" elevation="5" rounded>
            <v-sheet elevation="5" rounded class="pa-4">
                <h1 class="text-center font-weight bold">รอบการประเมินทั้งหมด</h1>
                <v-table class="table">
                    <tr>
                        <th class="border pa-2 bg-grey">ลำดับ</th>
                        <th class="border pa-2 bg-grey">ขื่อ-นามสกุล</th>
                        <th class="border pa-2 bg-grey">รอบการประเมิน</th>
                        <th class="border pa-2 bg-grey">ปีการประเมิน</th>
                    </tr>
                    <tr v-for="(sys,s) in systems" :key="systems.id_sys">
                        <td class="text-center border text-h5">{{ s+1 }}</td>
                        <td class="text-center border text-h5">{{ sys.fname }}-{{ sys.lname }}</td>
                        <td class="text-center border text-h5">{{ sys.round_sys}}</td>
                        <td class="text-center border text-h5">{{ sys.year_sys }}</td>
                    </tr> 
                </v-table>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { eva,api } from '~/API/base';

const box = ref([])
const systems = ref<any>({})

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res  =await axios.get(`${api}/dash/eva`,{headers:{Authorization:`Bearer ${token}`}})
        box.value =res.data.box
    } catch (error) {
        console.error('Error get ',error)
    }
}
const fetchr = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res  =await axios.get(`${eva}/table/`,{headers:{Authorization:`Bearer ${token}`}})
        systems.value =res.data
    } catch (error) {
        console.error('Error get ',error)
    }
}

onMounted(async()=>{
    await Promise.all([fetch(),fetchr()])
})
</script>

<style scoped>
.round{
    border-radius: 20px !important;
}
</style>