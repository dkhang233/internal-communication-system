<script lang="ts" setup>
import dayjs from "dayjs"

interface Props {
  content: string
  sentAt: Date
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  sentAt: () => new Date()
})
</script>

<template>
  <div class="msg-content">
    <div class="main">{{ content }}</div>
    <div class="time">{{ dayjs(sentAt).format("HH:mm") }}</div>
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
  .time {
    margin-top: 8px;
    font-size: 10px;
  }
}
</style>
