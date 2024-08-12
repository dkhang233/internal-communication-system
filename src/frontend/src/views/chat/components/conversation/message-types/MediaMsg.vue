<script lang="ts" setup>
import { ImageUploadResponse } from "@/api/file/types/file"
import { useChatStore } from "@/store/modules/chat"
import dayjs, { Dayjs } from "dayjs"
import { computed, Ref, ref, watch, watchEffect } from "vue"

interface Props {
  content: string
  sentAt: Dayjs
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  sentAt: () => dayjs()
})

const imageInfo: Ref<ImageUploadResponse> = computed((): ImageUploadResponse => {
  return JSON.parse(props.content)
})

const isUploading = ref<boolean>(false)
const progress = ref<number>(0)

watchEffect(() => {
  let fileName = imageInfo.value.thumbnailUrl.substring(imageInfo.value.thumbnailUrl.lastIndexOf("/") + 1)
  console.log(fileName)
  progress.value = useChatStore().uploadProgress.get(fileName) || 100
  console.log(progress.value)
  if (progress.value === 100) isUploading.value = false
  else isUploading.value = true
})
</script>

<template>
  <el-progress v-if="isUploading" class="progress" type="circle" :percentage="progress">
    <template #default="{ percentage }">
      <span class="percentage-value">{{ percentage }}%</span>
    </template>
  </el-progress>
  <div :class="isUploading ? 'msg-content uploading' : 'msg-content '">
    <div class="main">
      <el-image
        :src="imageInfo.thumbnailUrl"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="[imageInfo.originUrl]"
        fit="cover"
        lazy
      >
        <template #placeholder>
          <el-skeleton class="loading" animated>
            <template #template>
              <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
            </template>
          </el-skeleton>
        </template>
        <template #error>
          <div class="error">
            <el-icon :size="50"><RefreshRight /></el-icon>
          </div>
        </template>
        <template #viewer>
          <a download="abc" :href="imageInfo.originUrl">
            <el-icon class="download">
              <Download />
            </el-icon>
          </a>
        </template>
      </el-image>
    </div>
    <div class="time">{{ dayjs(sentAt).format("HH:mm") }}</div>
  </div>
</template>

<style lang="scss" scoped>
.in-msg {
  .msg-content {
    word-wrap: break-word;
  }
}

.out-msg {
  .msg-content {
    word-wrap: break-word;
  }
}

.progress {
  position: absolute;
  top: 150px;
  right: 120px;
  z-index: 2;
}

.uploading {
  opacity: 0.2;
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
  .error {
    width: 15rem;
    height: 15rem;
    background-color: var(--el-text-color-secondary);
    opacity: 0.6;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading {
    width: 15rem;
    height: 15rem;
  }
}

.download {
  position: absolute;
  top: 2.6rem;
  right: 7.5rem;
  background-color: var(--el-text-color-regular);
  border-color: #fff;
  color: #fff;
  height: 44px;
  width: 44px;
  font-size: 25px;
  align-items: center;
  border-radius: 50%;
  box-sizing: border-box;
  cursor: pointer;
  opacity: 0.8;
  z-index: 1;
}

.percentage-value {
  margin-top: 10px;
  font-size: 28px;
}
</style>
