<script lang="ts" setup>
import { ref, watchEffect, onMounted } from "vue"

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

interface Clock {
  hours: number
  minutes: number
  seconds: number
}

interface Props {
  id: string
  name: string
  createdAt: Date
  destroyedAt: Date
  messages?: Message[]
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => []
})

const emit = defineEmits(["joinMeet"])
const joinMeet = () => {
  emit("joinMeet")
}

const isOpen = ref<boolean>(false)
const caculateTime = (miliseconds: number): Clock => {
  let result: Clock = { hours: 0, minutes: 0, seconds: 0 }
  if (miliseconds < 0) {
    return caculateTime(new Date().getTime() - props.createdAt.getTime())
  }
  const long = ref<number>(0)
  long.value = miliseconds / 1000

  if (long.value >= 3600) {
    result.hours = Math.floor(long.value / 3600)
    long.value = long.value - result.hours * 3600
  }

  if (long.value >= 60) {
    result.minutes = Math.floor(long.value / 60)
    long.value = long.value - result.minutes * 60
  }

  if (long.value > 0) {
    result.seconds = Math.ceil(long.value)
  }
  return result
}

const clock = ref<Clock>()

const endedIn = ref<string>("")
const timer = ref<string>("00:00:00")
const intervalID = ref<NodeJS.Timeout>()

const handleTimer = function () {
  if (clock.value) {
    clock.value.seconds++
    if (clock.value.seconds > 59) {
      clock.value.minutes++
      clock.value.seconds = 0
    }
    if (clock.value.minutes > 59) {
      clock.value.hours++
      clock.value.minutes = 0
    }
    timer.value =
      clock.value.hours.toString().padStart(2, "0") +
      ":" +
      clock.value.minutes.toString().padStart(2, "0") +
      ":" +
      clock.value.seconds.toString().padStart(2, "0")
  }
}

const handleEndedIn = function () {
  if (clock.value) {
    endedIn.value = endedIn.value.concat(" (ended in: ")
    endedIn.value = endedIn.value.concat(clock.value.hours ? clock.value.hours + "h" : "")
    endedIn.value = endedIn.value.concat(clock.value.minutes ? clock.value.minutes + "m" : "")
    endedIn.value = endedIn.value.concat(clock.value.seconds ? clock.value.seconds + "s)" : ")")
  }
}

const setup = function () {
  intervalID && clearInterval(intervalID.value)
  if (isOpen.value) {
    intervalID.value = setInterval(handleTimer, 1000)
  } else {
    endedIn.value = ""
    handleEndedIn()
  }
}

const postContainer = ref(null)

watchEffect(() => {
  try {
    const created = new Date(props.createdAt) <= new Date() ? new Date(props.createdAt) : new Date()
    const destroyed = new Date(props.destroyedAt) <= new Date() ? new Date(props.destroyedAt) : new Date()
    const miliseconds = destroyed.getTime() - created.getTime()
    miliseconds >= 0 ? (isOpen.value = false) : (isOpen.value = true)
    clock.value = caculateTime(miliseconds)
    setup()
  } catch (e) {
    console.log(e)
  }
})
</script>
<template>
  <div ref="postContainer" class="post-container">
    <div class="text-divider">{{ props.createdAt.toLocaleString() }}</div>
    <el-card>
      <template #header>
        <div :class="`card-header ${isOpen && 'open'}`">
          <span>{{ props.name + endedIn }}</span>
          <el-button v-if="isOpen" type="primary" size="large" @click="joinMeet">Join</el-button>
        </div>
        <div v-if="isOpen" class="timer">
          <el-icon color="red" size="30">
            <Timer />
          </el-icon>
          <span>{{ timer }}</span>
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
  // display: flex;
  // flex-direction: column;
}

.card-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px 10px;
}

.open {
  height: 7rem;
  span {
    font-size: 28px;
    font-weight: 500;
  }
}

.timer {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
    font-size: 19px;
    font-weight: 500;
  }
}
</style>
