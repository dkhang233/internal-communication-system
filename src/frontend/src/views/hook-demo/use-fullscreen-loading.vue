<script lang="ts" setup>
import { useFullscreenLoading } from "@/hooks/useFullscreenLoading"
import { getSuccessApi, getErrorApi } from "@/api/hook-demo/use-fullscreen-loading"
import { ElMessage } from "element-plus"

const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`

const options = {
  text: "An error is about to occur...",
  background: "#F56C6C20",
  svg,
  svgViewBox: "-10, -10, 50, 50"
}

const querySuccess = async () => {
  // Notice:
  // 1. getSuccessApi is a function rather than a function call
  // 2. If you need to pass parameters to the getSuccessApi function, please do so in the following brackets (the real getSuccessApi call)
  const res = await useFullscreenLoading(getSuccessApi)([2, 3, 3])
  ElMessage.success(`${res.message}，Pass parameters as ${res.data.list.toString()}`)
}

const queryError = async () => {
  try {
    await useFullscreenLoading(getErrorApi, options)()
  } catch (err: any) {
    ElMessage.error(err.message)
  }
}
</script>

<template>
  <div class="app-container">
    <h4>
      This example is a demonstration: by passing the function to be executed to the hook, the hook automatically turns
      on full-screen loading, and automatically closes loading after the function is executed.
    </h4>
    <el-button type="primary" @click="querySuccess">search successful</el-button>
    <el-button type="danger" @click="queryError">Query failed</el-button>
  </div>
</template>
