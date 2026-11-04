<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="font-weight-bold">ตรวจสอบผลการประเมิน</h1>
            </v-col>
            <v-col cols="12">
                <v-card elevation="5" rounded class="round py-5">
                    <center>
                        <nuxt-link to="/Evaluatee/Score_member"><v-btn color="green">ผลการประเมินของผู้รับการประเมินผล</v-btn></nuxt-link>&nbsp;&nbsp;
                        <nuxt-link to="/Evaluatee/Score_member"><v-btn color="info">ผลการประเมินของกรรมการประเมิน</v-btn></nuxt-link>
                    </center>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>
.round{
    border-radius: 12px !important;
}
</style>