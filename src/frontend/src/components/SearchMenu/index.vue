<script lang="ts" setup>
import { ref } from "vue"
import SearchModal from "./SearchModal.vue"

/** Control modal visibility */
const modalVisible = ref<boolean>(false)
/** Open the modal */
const handleOpen = () => {
  modalVisible.value = true
}
</script>

<template>
  <div>
    <el-tooltip effect="dark" content="Search Menu" placement="bottom">
      <SvgIcon name="search" @click="handleOpen" />
    </el-tooltip>
    <SearchModal v-model="modalVisible" />
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
