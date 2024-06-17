<script lang="ts" setup>
import { ref, watchEffect } from "vue"
import Post from "./components/Post.vue"
import { useRouter } from "vue-router"
import { useMeetStore } from "@/store/modules/meet"
import { removeCurrentMeet, removeMeetToken, setCurrentMeet } from "@/utils/cache/cookies"
import { connectWS } from "@/utils/websocket"

interface MeetDetails {
  name: string
  time?: Date
}

const router = useRouter()
const routeData = router.resolve({ name: "MeetingWindow" })
const showCreateMeetForm = ref<boolean>(false)
const createMeetForm = ref<MeetDetails>({
  name: "New meeting",
  time: new Date()
})
const loading = ref<boolean>(false)
// const meetData = ref<MeetData[]>([])
const meetingWindow = ref(useMeetStore().meetingWindow)

const createNewMeet = () => {
  showCreateMeetForm.value = true
}

const joinMeet = (name?: string) => {
  setCurrentMeet(name || "New meeting")
  showCreateMeetForm.value = false
  loading.value = true
  joinMeetHelper()
}

const joinMeetHelper = async () => {
  try {
    await useMeetStore().getMeetToken()
    if (!meetingWindow.value || meetingWindow.value.closed) {
      meetingWindow.value = window.open(routeData.href, "_blank", "menubar=1")
      meetingWindow.value.opener.addEventListener("beforeunload", () => {
        meetingWindow?.value.close()
        removeMeetToken()
        removeCurrentMeet()
      })
    } else {
      meetingWindow.value.focus()
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
useMeetStore().getRooms()

connectWS()

// sendWS()
</script>

<template>
  <div class="app-container center" v-loading="loading">
    <Post class="post" v-for="room in useMeetStore().rooms" v-bind="room" @joinMeet="joinMeet(room.name)" />
    <el-card class="create-meet" @click="createNewMeet">
      <el-icon size="25" color="black">
        <VideoCamera />
      </el-icon>
    </el-card>
    <!-- <component :is="isAdmin ? PostList : JitsiMeet" v-bind="currentProperties" /> -->
    <el-dialog v-model="showCreateMeetForm" title="New meeting" width="60%">
      <el-form :model="createMeetForm">
        <el-form-item label="Name" label-width="normal">
          <el-input v-model="createMeetForm.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="joinMeet(createMeetForm.name)"> Create </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.center {
  height: 100%;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
}
.post {
  padding-bottom: 20px;
}

.create-meet {
  --el-card-padding: 20px;
  width: 4rem;
  height: 4rem;
  position: absolute;
  display: flex;
  justify-content: center;
  right: 30px;
  border-radius: 20px;
  cursor: pointer;
  background-color: white;
  &-text {
    display: inline;
    padding: 0 0 0 10px;
  }
  &:hover {
    background-color: #ecf0f1;
  }
}
</style>
