<script lang="ts" setup>
import StyledBadge from "./StyledBadge.vue"
interface Props {
  name: string
  online: boolean
  newestMessage: string
  sendedAt: string
}

const props = withDefaults(defineProps<Props>(), {
  name: "user",
  online: false,
  newestMessage: "",
  sendedAt: "00:00"
})
</script>
<template>
  <div class="contact-container">
    <div class="box">
      <div class="body">
        <styledBadge class="avatar" v-if="online">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
        </styledBadge>
        <el-avatar
          class="avatar"
          v-if="!online"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        >
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>
        <div class="detail">
          <div class="name">{{ name }}</div>
          <div class="message">{{ newestMessage }}</div>
        </div>
      </div>
      <div class="footer">
        <div>{{ sendedAt }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
%layout-shared {
  display: flex;
  align-items: center;
}

.contact-container {
  height: 6rem;
  border-radius: 0.5rem;
  margin: 10px;
  background-color: var(--el-bg-color-overlay);
}

.box {
  @extend %layout-shared;
  height: 100%;
  padding: 16px;
  justify-content: space-between;
}

.body {
  @extend %layout-shared;
}

.avatar {
  margin-right: 15px;
}
.detail {
  height: 100%;
}

.name {
  max-width: 6.5rem;
  font-weight: 800;
  margin-bottom: 7px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.message {
  max-width: 8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
