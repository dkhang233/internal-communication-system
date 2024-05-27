<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
//Set the language of Element Plus
// import en from "element-plus/es/locale/lang/en"

const { initTheme } = useTheme()

/** Initialize theme */
initTheme()
</script>

<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>

<style lang="scss">
.el-card__header {
  padding: 0px;
}
</style>
