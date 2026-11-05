<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 2 || user.status_eva === 3">
                    <h1 class="font-weight-bold">ผลการประเมินของกรรมการประเมิน</h1>
                    <v-card elevation="5" rounded >
                        <p class="ms-2">คูณ : {{ user.fname }} {{ user.lname }}</p>
                        <p class="ms-2">รอบการประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="font-weight-bold">{{ t+1 }}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="border pa-2 bg-grey">ตัวชี้วัด</th>
                                    <th class="border pa-2 bg-grey">รายละเอียดตัวชี้วัด</th>
                                    <th class="border pa-2 bg-grey">น้ำหนักคะแนน</th>
                                    <th class="border pa-2 bg-grey">คะแนนเต็ม</th>
                                    <th class="border pa-2 bg-grey">ประธาน</th>
                                    <th class="border pa-2 bg-grey">กรรมการ</th>
                                    <th class="border pa-2 bg-grey">เลขา</th>
                                    <th class="border pa-2 bg-grey">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                                    <td class="text-center border text-h5">{{ indicate.name_indicate }}</td>
                                    <td class="text-center border text-h5">{{ indicate.detail_indicate }}</td>
                                    <td class="text-center border text-h5">{{ indicate.point_indicate }}</td>
                                    <td class="text-center border text-h5">{{ indicate.point_indicate*4 }}</td>
                                    <td class="text-center border text-h5">{{ scores[indicate.id_indicate]?. a ?? 'รอประธานประเมิน' }}</td>
                                    <td class="text-center border text-h5">{{ scores[indicate.id_indicate]?. b ?? 'รอกรรมการประเมิน' }}</td>
                                    <td class="text-center border text-h5">{{ scores[indicate.id_indicate]?. c ?? 'รอเลขาประเมิน' }}</td>
                                    <td class="text-center border text-h5">{{ (((scores[indicate.id_indicate]?. a ?? 0)+(scores[indicate.id_indicate]?. b ?? 0)+(scores[indicate.id_indicate]?. c ?? 0))/3).toFixed(2) }}</td>
                                </tr> 
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="mt-3 text-end">
                        <v-card color="green" class="pa-2" type="" >คะแนนรวมสุทธิ : {{ ((user.total_commit)/3).toFixed(2) }} คะแนน</v-card>
                    </div>
                    <div class="mt-4">
                        <v-card class="pa-3" elevation="5" rounded>
                            <v-row>
                                <label for="">ข้อเสนอแนะของกรรมการ</label>
                                <v-row>
                                    <v-col cols="12" v-for="(commit,c) in commits" :key="commit.id_commit" >
                                        {{ c+1 }}.{{ commit.level_commit }} : {{ commit.detail_commit ?? 'รอการประเมิน' }}
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-card>
                    </div>
                </v-form>
                <v-alert variant="tonal" type="warning" color="warning" v-else-if="user.status_eva === 1">ยังไม่ได้ประเมินตนเอง</v-alert>
                <v-alert variant="tonal" type="error" color="error" v-else >ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { eva,api, commit } from '~/API/base';

const user = ref<any>({})
const topics = ref<any>([])
const scores = ref<any>([])
const commits = ref<any>([])



const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('ERROR GET PROFILE',error)
    }
}
const fetchTopic = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    } catch (error) {
        console.error('ERROR GET PROFILE',error)
    }
}
const fetchCommit = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/score_commit/commit`,{headers:{Authorization:`Bearer ${token}`}})
        commits.value = res.data
    } catch (error) {
        console.error('ERROR GET PROFILE',error)
    }
}
const fetctScore = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/score_commit/scores`,{headers:{Authorization:`Bearer ${token}`}})
        scores.value = res.data
    } catch (error) {
        console.error('ERROR GET PROFILE',error)
    }
}



onMounted(async()=>{
    await Promise.all([fetch(),fetchTopic(),fetchCommit(),fetctScore()])
})
</script>

<style scoped>
.round{
    border-radius: 12px !important;
}
</style>