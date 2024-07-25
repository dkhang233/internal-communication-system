<script lang="ts" setup>
interface Props {
  time: string
}

const props = withDefaults(defineProps<Props>(), {
  time: "--:--"
})
</script>
<template>
  <el-divider> {{ time }} </el-divider>
</template>
