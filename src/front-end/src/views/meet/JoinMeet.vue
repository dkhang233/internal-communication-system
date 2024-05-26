<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, watchEffect } from "vue"
import JitsiMeet from "./components/JitsiMeet.vue"
import { useUserStore } from "@/store/modules/user"
import { userMeetStore } from "@/store/modules/meet"
import { getCurrentMeet } from "@/utils/cache/cookies"

const userStore = useUserStore()
const domain = ref("meet.site")
const options = ref({
  roomName: getCurrentMeet() || "New meeting",
  userInfo: {
    displayName: userStore.username || "Username"
  },
  jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiIiwibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbiJ9fSwicm9vbSI6IioiLCJhdWQiOiJzZWN1cmUtbWVldCIsImlzcyI6InNlY3VyZS1tZWV0Iiwic3ViIjoibWVldC5zaXRlIiwiZXhwIjoxNzE2NjMzNTgwMH0.B37TGzGU5Z4JLxdu_YH8-FLCrInWxexBn95KFTTZtoE",
  configOverwrite: {
    enableNoisyMicDetection: false
  },
  interfaceConfigOverwrite: {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_CHROME_EXTENSION_BANNER: false
  }
})

watchEffect(() => console.log(options.value.roomName))
</script>
<template>
  <div class="app-container">
    <JitsiMeet :domain="domain" :options="options" />
  </div>
</template>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
