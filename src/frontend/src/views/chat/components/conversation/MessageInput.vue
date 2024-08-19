<script lang="ts" setup>
import { computed, onMounted, ref, StyleValue } from "vue"
import { useChatStore, MessageData } from "@/store/modules/chat"
import EmojiPicker from "vue3-emoji-picker"
import MessageStatus from "@/constants/message-status"
import MessageType from "@/constants/message-type"
import dayjs from "dayjs"
import { UploadFile, UploadRawFile, UploadRequestOptions } from "element-plus"
import { uploadFileApi, uploadImageApi } from "@/api/file"

const msgInput = ref(null)
const input = ref<string>("")
const showOptions = ref<boolean>(false)
const showEmoji = ref<boolean>(false)

// Chèn emoji vào tin nhắn
const onSelectEmoji = (emoji: any) => {
  input.value += emoji.i
}

// Gửi tin nhắn
const sendMsg = () => {
  if (input && input.value !== "") {
    let message: MessageData = {
      id: -1,
      type: MessageType.TEXT,
      content: input.value,
      sendedAt: dayjs(),
      incoming: false,
      status: MessageStatus.SENDING
    }
    useChatStore().sendMessage(message)
    input.value = ""
  }
}

// Nếu người dùng ấn enter khi nhập tin nhắn => gửi tin nhắn
const handlePressEnter = (e: any) => {
  if (e?.keyCode === 13) {
    sendMsg()
    setTimeout(() => (input.value = ""), 1)
  }
}

const handleShowEmoji = () => {
  if (!showOptions.value) {
    showOptions.value = true
    showEmoji.value = true
  } else if (showOptions.value && showEmoji.value) {
    showOptions.value = false
    showEmoji.value = false
  } else {
    showEmoji.value = true
  }
}

const handleShowSendMore = () => {
  if (!showOptions.value) {
    showOptions.value = true
    showEmoji.value = false
  } else if (showOptions.value && !showEmoji.value) {
    showOptions.value = false
    showEmoji.value = true
  } else {
    showEmoji.value = false
  }
}

const url = ref<string>("")

const handleBeforeUploadImage = (rawFile: UploadRawFile) => {
  handleShowSendMore()
  url.value = URL.createObjectURL(rawFile)
  let msg: MessageData = {
    id: 0,
    type: MessageType.IMAGE,
    content: JSON.stringify({
      originUrl: url.value, // Url dẫn tới ảnh gốc
      thumbnailUrl: url.value
    }),
    sendedAt: dayjs(),
    incoming: false,
    status: MessageStatus.SENDING
  }
  useChatStore().addMessage(useChatStore().currentChatUser, msg)
  useChatStore().updateUploadProgress(rawFile.name, 0)
}

const handleSendImage = (options: UploadRequestOptions) => {
  return uploadImageApi(options.file, url.value)
}

const handleSendImageSuccess = (res: any, file: UploadFile) => {
  let msg: MessageData = useChatStore().conversations.get(useChatStore().currentChatUser)!.pop() || {
    id: -2,
    type: MessageType.IMAGE,
    content: JSON.stringify({
      originUrl: "", // Url dẫn tới ảnh gốc
      thumbnailUrl: ""
    }),
    sendedAt: dayjs(),
    incoming: false,
    status: MessageStatus.FAILED
  }
  msg.content = JSON.stringify(res.data)
  useChatStore().sendMessage(msg)
}

const handleBeforeUploadFile = (rawFile: UploadRawFile) => {
  handleShowSendMore()
  url.value = URL.createObjectURL(rawFile)
  let msg: MessageData = {
    id: 0,
    type: MessageType.FILE,
    content: url.value,
    sendedAt: dayjs(),
    incoming: false,
    status: MessageStatus.SENDING
  }
  useChatStore().addMessage(useChatStore().currentChatUser, msg)
  useChatStore().updateUploadProgress(rawFile.name, 0)
}

const handleSendFile = (options: UploadRequestOptions) => {
  return uploadFileApi(options.file)
}

const handleSendFileSuccess = (res: any, file: UploadFile) => {
  let msg: MessageData = useChatStore().conversations.get(useChatStore().currentChatUser)!.pop() || {
    id: -2,
    type: MessageType.FILE,
    content: "",
    sendedAt: dayjs(),
    incoming: false,
    status: MessageStatus.FAILED
  }
  msg.content = res.data
  useChatStore().sendMessage(msg)
}

const showSendMore = computed(() => {
  return showOptions.value && !showEmoji.value
})
</script>

<template>
  <div class="msg-input-container">
    <EmojiPicker class="emoji" v-show="showOptions && showEmoji" :native="true" @select="onSelectEmoji" />
    <el-card class="send-more" v-show="showSendMore">
      <div class="body">
        <el-upload class="item" :http-request="handleSendImage" :before-upload="handleBeforeUploadImage"
          :on-success="handleSendImageSuccess" :show-file-list="false">
          <Picture class="icon" />
          <span class="title">Attack image</span>
        </el-upload>
        <el-upload class="item" :http-request="handleSendFile" :before-upload="handleBeforeUploadFile"
          :on-success="handleSendFileSuccess" :show-file-list="false">
          <Files class="icon" />
          <span class="title">Attack file</span>
        </el-upload>
      </div>
    </el-card>
    <div class="input">
      <el-input ref="msgInput" class="main" v-model="input" type="textarea" :autosize="{ minRows: 1, maxRows: 6 }"
        resize="none" placeholder="Please Input" @keydown="handlePressEnter" />
      <div class="suffix">
        <div class="emoji-btn" @click="handleShowEmoji">
          <SvgIcon name="smile-emoji" />
        </div>
        <div class="more-btn" @click="handleShowSendMore">
          <el-icon size="18">
            <MoreFilled />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="send-msg-btn" @click="sendMsg">
      <SvgIcon name="send"></SvgIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.msg-input-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .input {
    display: flex;
    justify-content: end;
    align-items: center;
    flex-wrap: wrap;
    min-width: 80%;
    margin: 5px 8px;
    padding: 0px 4px;
    border: solid 1px;
    border-radius: 8px;
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank));

    &:focus-within {
      box-shadow: 0px 0px 5px 0px var(--el-color-primary);
    }

    @media screen and (max-width: 665px) and (min-width: 450px) {
      width: 25rem;
    }

    @media screen and (max-width: 450px) {
      width: 17rem;
    }

    .main {
      :deep(.el-textarea__inner) {
        box-shadow: none;
      }
    }

    .suffix {
      display: flex;
      align-content: center;
      justify-content: center;

      .more-btn {
        width: 20px;
        margin: 0px 5px;
        cursor: pointer;
        opacity: 0.7;

        &:hover {
          opacity: 1;
        }
      }

      .emoji-btn {
        width: 20px;
        margin: 0px 5px;
        cursor: pointer;
        opacity: 0.7;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .send-msg-btn {
    padding: 10px;
    border-radius: 5px;
    background-color: var(--el-color-primary);
    cursor: pointer;
  }

  .emoji {
    position: absolute;
    right: 13%;
    bottom: 105%;
    z-index: 10;
  }

  .send-more {
    position: absolute;
    right: 8%;
    bottom: 105%;
    z-index: 10;
    width: 250px;
    --el-card-padding: 0px;

    .body {
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .item {
        display: flex;
        align-items: center;
        padding: 15px 20px;

        &:hover {
          cursor: pointer;
          background-color: var(--el-bg-color-overlay);
          color: var(--el-color-primary);
        }

        .icon {
          width: 20px;
          margin: 0px 10px;
        }
      }
    }
  }
}
</style>
