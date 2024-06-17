<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from "vue"
import { removeCurrentMeet, removeMeetToken } from "@/utils/cache/cookies"

const window: any = ref(null)

interface Props {
  domain: string
  options: any
}

const props = withDefaults(defineProps<Props>(), {
  domain: "meet.jit.si",
  options: {}
})

const jitsiApi = ref<any>()
const meetContainer = ref(null)
const loadScript = (src: any, cb: any) => {
  const scriptEl = document.createElement("script")
  scriptEl.src = src
  scriptEl.async = true
  document.querySelector("head")?.appendChild(scriptEl)
  scriptEl.addEventListener("load", cb)
}

const embedJitsiWidget = () => {
  const options = {
    ...props.options,
    parentNode: meetContainer.value
  }
  jitsiApi.value = new window.JitsiMeetExternalAPI(props.domain, options)
}

const executeCommand = (command: string, ...value: any) => {
  jitsiApi.value.executeCommand(command, ...value)
}

const addEventListener = (event: any, fn: any) => {
  jitsiApi.value.addListener(event, fn)
}

const removeJitsiWidget = () => {
  if (jitsiApi) jitsiApi.value.dispose()
}

onMounted(() => {
  loadScript(`https://${props.domain}/external_api.js`, () => {
    if (!window.JitsiMeetExternalAPI) throw new Error("Jitsi Meet External API not loaded")
    embedJitsiWidget()
    jitsiApi.value.addEventListener("readyToClose", function () {
      removeMeetToken()
      removeCurrentMeet()
      window.close()
    })
    window.addEventListener("beforeunload", function () {
      removeMeetToken()
      removeCurrentMeet()
    })
  })
})

onBeforeUnmount(() => {
  removeJitsiWidget()
})
</script>

<template>
  <div ref="meetContainer" style="height: 100%; width: 100%"></div>
</template>
