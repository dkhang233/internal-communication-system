<script lang="ts" setup>
import { MessageType } from "@/api/chat/types/message"

interface Props {
  type: MessageType
  sendedAt: string
  incoming: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: MessageType.TEXT,
  sendedAt: "00:00",
  incoming: false
})
</script>
<template>
  <div :class="incoming ? 'msg-container in-msg' : 'msg-container out-msg'">
    <div class="msg">
      <span :class="incoming ? 'header header-in' : 'header header-out'">{{ sendedAt }}</span>
      <div :class="incoming ? 'body body-in' : 'body body-out'">
        <SvgIcon class="status" name="sending-status" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.msg-container {
  display: flex;
  flex-direction: row;
  margin: 5px;
}

.in-msg {
  justify-content: flex-start;
}

.out-msg {
  justify-content: flex-end;
}

.msg {
  display: flex;
  flex-direction: column;
  .header {
    margin: 0 30px;
    &-in {
      align-self: self-start;
    }
    &-out {
      align-self: self-end;
    }
  }
  .body {
    display: flex;
    align-items: center;
    &-out {
      flex-direction: row-reverse;
    }
    .status {
      margin: 0px 5px;
    }
  }
}
</style>
