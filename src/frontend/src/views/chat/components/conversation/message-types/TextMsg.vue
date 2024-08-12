<script lang="ts" setup>
import dayjs, { Dayjs } from "dayjs"

interface Props {
  content: string
  sentAt: Dayjs
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  sentAt: () => dayjs()
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
    word-wrap: break-word;
    background-color: var(--el-bg-color-page);
  }
}

.out-msg {
  .msg-content {
    background-color: var(--el-color-primary);
    color: white !important;
    word-wrap: break-word;
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
