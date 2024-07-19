<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user"
import Admin from "./components/Admin.vue"
import Editor from "./components/Editor.vue"
import { connectWS } from "@/utils/websocket"
import { useFullscreenLoading } from "@/hooks/useFullscreenLoading"

const userStore = useUserStore()
const isAdmin = userStore.roles.includes("admin")

// Init websocket
connectWS()
</script>

<template>
  <component :is="isAdmin ? Admin : Editor" />
</template>
