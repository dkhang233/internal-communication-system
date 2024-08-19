<script lang="ts" setup>
import { ImageUploadResponse } from "@/api/file/types/file"
import { useChatStore } from "@/store/modules/chat"
import { RefSymbol } from "@vue/reactivity"
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
  if (useChatStore().uploadProgress.get(imageInfo.value.originUrl)) {
    progress.value = useChatStore().uploadProgress.get(imageInfo.value.originUrl) || 0
    // console.log(progress)
    if (progress.value === 100) isUploading.value = false
    else isUploading.value = true
  } else {
    isUploading.value = false
  }
})
</script>

<template>
  <div class="msg-content">
    <div class="main">
      <el-progress v-if="isUploading" class="progress" type="circle" :percentage="progress" :width="50"
        :show-text="false" />
      <el-image :class="isUploading ? 'image uploading' : 'image'" :src="imageInfo.thumbnailUrl" :zoom-rate="1.2"
        :max-scale="7" :min-scale="0.2" :preview-src-list="[imageInfo.originUrl]" fit="cover" lazy>
        <template #placeholder>
          <el-skeleton animated>
            <template #template>
              <div class="loading">
                <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
              </div>
            </template>
          </el-skeleton>
        </template>
        <template #error>
          <div class="error">
            <el-icon :size="50">
              <RefreshRight />
            </el-icon>
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
.uploading {
  opacity: 0.5;
}

.msg-content {
  justify-content: center;
  align-content: center;

  max-width: 25rem;

  @media screen and (max-width: 500px) {
    max-width: 15.5rem;
  }


  padding: 15px;
  border-radius: 10px;
  text-align: start;

  .main {
    position: relative;
    display: flex;
    justify-content: end;

    .image {
      width: 80%;
      min-width: 200px;
      min-height: 150px;
      border-radius: 8px;
    }

    .error {
      padding: 50px 100px;
      background-color: var(--el-text-color-secondary);
      opacity: 0.6;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loading {
      width: 200px;
      height: 150px;
    }

    .progress {
      position: absolute;
      top: 50%;
      left: 62.5%;
      transform: translate(-50%, -50%);
      z-index: 5;
    }
  }

  .time {
    margin-top: 8px;
    font-size: 10px;
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
</style>
