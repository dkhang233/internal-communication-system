<script lang="ts" setup>
enum MessageType {
  text = "text",
  image = "image"
}

interface Message {
  sender: string
  time: Date
  contentType: MessageType
  content: string
  link?: string
}

interface Props {
  name: string
  createdAt: string
  time: string
  messages?: Message[]
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => []
})

const emit = defineEmits(["joinMeet"])
const joinMeet = () => {
  emit("joinMeet")
}
</script>
<template>
  <div class="post-container">
    <div class="text-divider">{{ props.createdAt }}</div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ props.name + props.time }}</span>
          <el-button v-if="!props.time" type="primary" @click="joinMeet">Join</el-button>
        </div>
      </template>
      <p v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</p>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.text-divider {
  display: flex;
  align-items: center;
  --text-divider-gap: 1rem; // set a customizable gap between label and lines
  margin-bottom: 10px;
}

.text-divider::before,
.text-divider::after {
  content: "";
  height: 1px;
  background-color: silver;
  flex-grow: 1;
}

.text-divider::before {
  margin-right: var(--text-divider-gap);
}

.text-divider::after {
  margin-left: var(--text-divider-gap);
}

.post-container {
  width: 70%;
}

.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
