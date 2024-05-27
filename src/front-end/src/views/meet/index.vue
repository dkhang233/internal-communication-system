<script lang="ts" setup>
import { onMounted, ref } from "vue"
import Post from "./components/Post.vue"
import { useRouter } from "vue-router"
import { userMeetStore } from "@/store/modules/meet"
import { removeCurrentMeet, setCurrentMeet } from "@/utils/cache/cookies"

interface MeetDetails {
  name: string
  time?: Date
}

const router = useRouter()
const routeData = router.resolve({ name: "JoinMeet" })
const showCreateMeetForm = ref<boolean>(false)
const createMeetForm = ref<MeetDetails>({
  name: "Meeting",
  time: new Date()
})
const loading = ref<boolean>(false)
// const meetData = ref<MeetData[]>([])
const meetingWindow = ref(userMeetStore().meetingWindow)

const createNewMeet = () => {
  showCreateMeetForm.value = true
}

const joinMeet = (name?: string) => {
  setCurrentMeet(name || "New meeting")
  if (!meetingWindow.value || meetingWindow.value.closed) {
    meetingWindow.value = window.open(routeData.href, "_blank", "menubar=1")
    meetingWindow.value.opener.addEventListener("beforeunload", () => {
      meetingWindow?.value.close()
      removeCurrentMeet()
    })
  } else {
    meetingWindow.value.focus()
  }
}
userMeetStore().getRooms()
</script>

<template>
  <div class="app-container center">
    <Post
      class="post"
      v-for="{ name, createdAt, destroyedAt } in userMeetStore().rooms"
      :name="name"
      :createdAt="new Date(createdAt)"
      :time="new Date(destroyedAt).getTime() - new Date(createdAt).getTime()"
      @joinMeet="joinMeet(name)"
    />
    <el-card class="create-meet" @click="createNewMeet">
      <el-icon size="25" color="black">
        <VideoCamera />
      </el-icon>
    </el-card>
    <!-- <component :is="isAdmin ? PostList : JitsiMeet" v-bind="currentProperties" /> -->
    <el-dialog v-model="showCreateMeetForm" title="Create meeting" width="500">
      <el-form :model="createMeetForm">
        <el-form-item label="Name" label-width="normal">
          <el-input v-model="createMeetForm.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showCreateMeetForm = false">Cancel</el-button>
          <el-button type="primary" @click="joinMeet(createMeetForm.name)"> Join now </el-button>
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
