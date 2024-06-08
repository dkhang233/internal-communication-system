<script lang="ts" setup>
import { computed, ref, watchEffect } from "vue"
import { ElMessage } from "element-plus"
import screenfull from "screenfull"

interface Props {
  /** Full screen element, default is html */
  element?: string
  /** Open full screen prompt */
  openTips?: string
  /** Close the full screen prompt */
  exitTips?: string
  /** Is it only for the content area? */
  content?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  element: "html",
  openTips: "Full Screen",
  exitTips: "Exit Full Screen",
  content: false
})

//#region full screen
const isFullscreen = ref<boolean>(false)
const fullscreenTips = computed(() => {
  return isFullscreen.value ? props.exitTips : props.openTips
})
const fullscreenSvgName = computed(() => {
  return isFullscreen.value ? "fullscreen-exit" : "fullscreen"
})
const handleFullscreenClick = () => {
  const dom = document.querySelector(props.element) || undefined
  screenfull.isEnabled ? screenfull.toggle(dom) : ElMessage.warning("您的浏览器无法工作")
}
const handleFullscreenChange = () => {
  isFullscreen.value = screenfull.isFullscreen
  // Clear all classes when exiting full screen
  isFullscreen.value || (document.body.className = "")
}
watchEffect((onCleanup) => {
  // Automatically executed when mounting the component
  screenfull.on("change", handleFullscreenChange)
  // Automatically executed when the component is uninstalled
  onCleanup(() => {
    screenfull.isEnabled && screenfull.off("change", handleFullscreenChange)
  })
})
//#endregion

//#region content area
const isContentLarge = ref<boolean>(false)
const contentLargeTips = computed(() => {
  return isContentLarge.value ? "Content area recovery" : "Enlarge the content area"
})
const contentLargeSvgName = computed(() => {
  return isContentLarge.value ? "fullscreen-exit" : "fullscreen"
})
const handleContentLargeClick = () => {
  isContentLarge.value = !isContentLarge.value
  // When the content area is enlarged, hide unnecessary components
  document.body.className = isContentLarge.value ? "content-large" : ""
}
const handleContentFullClick = () => {
  //Cancel content area zoom
  isContentLarge.value && handleContentLargeClick()
  // When the content area is full screen, hide unnecessary components
  document.body.className = "content-full"
  // Open full screen
  handleFullscreenClick()
}
//#endregion
</script>

<template>
  <div>
    <!-- Full Screen -->
    <el-tooltip v-if="!content" effect="dark" :content="fullscreenTips" placement="bottom">
      <SvgIcon :name="fullscreenSvgName" @click="handleFullscreenClick" />
    </el-tooltip>
    <!-- Content area -->
    <el-dropdown v-else :disabled="isFullscreen">
      <SvgIcon :name="contentLargeSvgName" />
      <template #dropdown>
        <el-dropdown-menu>
          <!-- Enlarge the content area -->
          <el-dropdown-item @click="handleContentLargeClick">{{ contentLargeTips }}</el-dropdown-item>
          <!-- Full screen content area -->
          <el-dropdown-item @click="handleContentFullClick">Content area full screen</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.svg-icon {
  font-size: 20px;
  &:focus {
    outline: none;
  }
}
</style>
