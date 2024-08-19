<script lang="ts" setup>
import { useChatStore } from "@/store/modules/chat"
import dayjs, { Dayjs } from "dayjs"
import { ref, watchEffect } from "vue"

interface Props {
    content: string
    sentAt: Dayjs
}

const props = withDefaults(defineProps<Props>(), {
    content: "",
    sentAt: () => dayjs()
})

const isUploading = ref<boolean>(false)
const progress = ref<number>(0)

watchEffect(() => {
    if (useChatStore().uploadProgress.get(props.content)) {
        progress.value = useChatStore().uploadProgress.get(props.content) || 0
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
            <a :class="isUploading ? 'file upload' : 'file'" :href="content">
                <span class="name"> {{ content.substring(content.lastIndexOf('/') + 38) }}</span>
                <el-icon :size="50">
                    <Document />
                </el-icon>
            </a>
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

        .file {
            width: 230px;
            height: 100px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 10px;
            background-color: var(--el-bg-color-page);

            .name {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            &:hover {
                opacity: 0.7;
            }
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
</style>
