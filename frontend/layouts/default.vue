<template>
    <v-app>
        <v-app-bar :color="bg(user.role)" flat elevation="5" class="rounded-b">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">NTC EVALUATION SYSTEM</v-toolbar-title>

            <p class="text-center">คุณ : {{ user.fname }} {{ user.lname }} <br> ตำแหน่ง : {{ user.role }}</p>
            <v-btn icon="mdi-logout" variant="text" @click="logout"></v-btn>
        </v-app-bar>

        <v-navigation-drawer app color="#404040" v-model="drawer" width="260" :temporary="isMobile" :permanent="!isMobile">
            <v-list density="comfortable">
                <v-list-item>
                    <v-list-item-title class="font-weight-bold">NTC EVALUATION SYSTEM</v-list-item-title>
                    <div class="mt-3">
                        <v-chip color="white" variant="outlined"><h4>{{ user.role }}</h4></v-chip>
                    </div>
                </v-list-item>
            </v-list>

            <v-divider color="white" opacity="0.5"></v-divider>

            <v-list density="comfortable">
                <v-list-item v-for="item in navitem" :key="item.title" :to="item.to">
                    <v-list-item-title >
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid class="py-2">
                <slot></slot>
            </v-container>
            <v-footer class="font-weight-bold text-caption justify-center">© 2026 NTC EVALUATION SYSTEM</v-footer>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useDisplay } from 'vuetify';
import { api } from '~/API/base';

const drawer = ref(false)
const user = ref<any>({})
const {mdAndDown} = useDisplay()
const isMobile = computed(()=> mdAndDown.value)

const logout = ()=>{
    if(!confirm('ท่านต้องการออกจากระบบหรือไม่'))
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
    
}
const roles = [
    //staff nav
    {title:'หน้าหลัก',to:'/Staff/',role:'ฝ่ายบุคลากร'},
    {title:'จัดการผู้รับการประเมินผล',to:'/Staff/Manage_eva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการกรรมการประเมิน',to:'/Staff/Manage_commit',role:'ฝ่ายบุคลากร'},
    {title:'จัดการหัวข้อการประเมิน',to:'/Staff/Topic',role:'ฝ่ายบุคลากร'},
    {title:'จัดการตัวชี้วัดการประเมิน',to:'/Staff/Indicate',role:'ฝ่ายบุคลากร'},
    {title:'จัดการรอบการประเมิน',to:'/Staff/round',role:'ฝ่ายบุคลากร'},
    {title:'จัดการแบบประเมิน',to:'/Staff/Eva',role:'ฝ่ายบุคลากร'},
    {title:'ผลการประเมินของผู้รับการประเมินผล',to:'/Staff/Score_evaList',role:'ฝ่ายบุคลากร'},
    {title:'ผลการประเมินของกรรมการประเมิน',to:'/Staff/Score_commitList',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของผู้รับการประเมินผล',to:'/Staff/Status_eva',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของกรรมการประเมิน',to:'/Staff/Status_commit',role:'ฝ่ายบุคลากร'},
    {title:'รายงานผล',to:'/Staff/Report',role:'ฝ่ายบุคลากร'},
    {title:'เอกสารหรือคู่มือการประเมิน',to:'/Staff/Document',role:'ฝ่ายบุคลากร'},
    {title:'การสำรองข้อมูล',to:'/Staff/Backup',role:'ฝ่ายบุคลากร'},

    //eva nav

    {title:'หน้าหลัก',to:'/Evaluatee',role:'ผู้รับการประเมินผล'},
    {title:'แก้ไขข้อมูลส่วนตัว',to:'/Evaluatee/edit_eva',role:'ผู้รับการประเมินผล'},
    {title:'แบบประเมินตนเอง',to:'/Evaluatee/selfeva',role:'ผู้รับการประเมินผล'},
    {title:'ตรวจสอบผลการประเมิน',to:'/Evaluatee/check_score',role:'ผู้รับการประเมินผล'},
    {title:'รายงาน',to:'/Evaluatee/report',role:'ผู้รับการประเมินผล'},
    {title:'คู่มือการประเมิน',to:'/Evaluatee/doc',role:'ผู้รับการประเมินผล'},

    //commit nav

    {title:'รายชื่อผู้รับการประเมินผล',to:'/Committee/',role:'กรรมการประเมิน'},
    {title:'ดำเนินการประเมิน',to:'/Committee/show_eva',role:'กรรมการประเมิน'},
    {title:'ตรวจสอบและยืนยันผล',to:'/Committee/check_confirm',role:'กรรมการประเมิน'},
    {title:'คู่มือการประเมิน',to:'/Committee/doc',role:'กรรมการประเมิน'},
]

const navitem = computed(()=> roles.filter((item)=> item.role.includes(user.value.role)))

const fetch = async()=>{
    const token = localStorage.getItem('token')
    if(!token){
        navigateTo('/',{replace:true})
    }
    try {
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('ERROR GET PROFILE',error)
    }
}
onMounted(fetch)

const bg = (role:string) =>{
    if(role === 'ฝ่ายบุคลากร')return '#647687'
    if(role === 'กรรมการประเมิน')return '#007FFF'
    if(role === 'ผู้รับการประเมินผล')return '#7d0c14'
}
</script>

<style scoped>
@media print {
    .v-app-bar,.v-btn.no-p{
        display: none !important;
        margin: 0 !important;
        margin-top: 0 !important;
        padding: 0 !important;
        width: 100% !important;
    }
}
</style>