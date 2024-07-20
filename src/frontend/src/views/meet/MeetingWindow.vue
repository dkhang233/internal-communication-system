<script lang="ts" setup>
import { watchEffect } from "vue"
import Meet from "./components/Meet.vue"
import { useUserStore } from "@/store/modules/user"
import { getCurrentMeet, getMeetToken } from "@/utils/cache/cookies"

const domain: string = import.meta.env.VITE_MEET_DOMAIN
const meetToken: string = getMeetToken() || ""
// const meetToken: string = ""
const options = {
  roomName: getCurrentMeet() || "New meeting",
  userInfo: {
    displayName: useUserStore().username || "Username"
  },
  jwt: meetToken,
  configOverwrite: {
    enableNoisyMicDetection: false
  },
  interfaceConfigOverwrite: {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_CHROME_EXTENSION_BANNER: false
  }
}
watchEffect(() => {
  console.log(getCurrentMeet())
})
</script>
<template>
  <div class="app-container">
    <Meet :domain="domain" :options="options" />
  </div>
</template>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
