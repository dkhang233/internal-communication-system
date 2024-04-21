<script lang="ts" setup>
import { computed, ref } from "vue"
import JitsiMeet from "./components/JitsiMeet.vue"
import { useUserStore } from "@/store/modules/user"

const userStore = useUserStore()
const onIFrameLoad = () => {}
const jitsiOptions = computed(() => {
  return {
    roomName: "some-room-name",
    noSSL: false,
    userInfo: {
      email: "user@email.com",
      displayName: userStore.username ?? ""
    },
    configOverwrite: {
      enableNoisyMicDetection: false,
      securityUi: {
        hideLobbyButton: true
      }
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      SHOW_CHROME_EXTENSION_BANNER: false
    },
    onload: onIFrameLoad
  }
})

const loading = ref(true)

const handleLoaded = function () {
  loading.value = false
}
</script>

<template>
  <JitsiMeet
    v-loading="loading"
    element-loading-text="Loading..."
    domain="call.dkhang233.site"
    :options="jitsiOptions"
    @loaded="handleLoaded"
  ></JitsiMeet>
</template>
