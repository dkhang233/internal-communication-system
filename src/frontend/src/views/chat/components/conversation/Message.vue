<script lang="ts" setup>
import MessageType from "@/constants/message-type"
import { computed } from "vue"

interface Props {
  type: string
  incoming: boolean
  status: string
  lastMessage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: MessageType.TEXT,
  incoming: false
})

const showSuccessStatus = computed(() => {
  console.log(props.type + " " + props.status + "  " + props.lastMessage)
  if (!props.incoming && props.lastMessage && props.status === "SUCCESS") return true
  else return false
})
const showReadStatus = computed(() => {
  if (!props.incoming && props.lastMessage && props.status === "READ") return true
  else return false
})
</script>
<template>
  <div :class="incoming ? 'msg-container in-msg' : 'msg-container out-msg'">
    <div class="msg">
      <div :class="incoming ? 'body body-in' : 'body body-out'">
        <SvgIcon v-if="!incoming && props.status === 'SENDING'" class="status" name="sending-status" />
        <SvgIcon v-if="!incoming && props.status === 'FAILED'" class="status" name="failed-status" />
        <SvgIcon v-if="showSuccessStatus" class="status" name="success-status" />
        <SvgIcon v-if="showReadStatus" class="status" name="read-status" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.msg-container {
  position: relative;
  display: flex;
  flex-direction: row;
  margin: 5px 30px 0px 10px;
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
    &-in {
      margin: 5px;
      align-self: self-start;
    }
    &-out {
      margin: 5px 30px;
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
      position: absolute;
      bottom: 25px;
      right: -25px;
      margin: 0px 5px;
    }
  }
}
</style>
