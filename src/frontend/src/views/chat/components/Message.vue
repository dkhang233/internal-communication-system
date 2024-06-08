<script lang="ts" setup></script>
<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-avatar class="avatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>
        <div class="info">
          <div class="name">Khang</div>
          <div class="status">Online</div>
        </div>
      </div>
    </template>
    <div class="content">
      <p v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</p>
    </div>
    <template #footer>Footer content</template>
  </el-card>
</template>
<style lang="scss" scoped>
.card-header {
  display: flex;
  align-items: center;
}
.avatar {
  margin: 0px 15px;
}

.name {
  font-weight: 800;
  padding-bottom: 5px;
}

.content {
  width: 100%;
  height: 100%;
  // background-color: #f0f4fa;
  padding: 0px !important;
}

.el-card__body {
  padding: 0px;
}
</style>
