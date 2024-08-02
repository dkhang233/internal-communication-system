<script lang="ts" setup>
interface Props {
  content: string
}

const props = withDefaults(defineProps<Props>(), {
  content: ""
})
</script>
<template>
  <div class="timeline-container">
    <el-divider class="main">{{ content }}</el-divider>
  </div>
</template>
<style lang="scss">
.timeline-container {
  display: flex;
  justify-content: center;
  width: 100%;

  .main {
    width: 50%;
  }
}
</style>
