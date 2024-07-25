<script lang="ts" setup>
interface Props {
  content: string
}

const props = withDefaults(defineProps<Props>(), {
  content: ""
})
</script>

<template>
  <div class="msg-content">
    {{ content }}
  </div>
</template>

<style lang="scss" scoped>
.in-msg {
  .msg-content {
    background-color: var(--el-bg-color-page);
  }
}

.out-msg {
  .msg-content {
    background-color: var(--el-color-primary);
    color: white !important;
  }
}
.msg-content {
  max-width: 25rem;
  @media screen and (max-width: 500px) {
    max-width: 15.5rem;
  }
  padding: 15px;
  border-radius: 10px;
  text-align: start;
}
</style>
