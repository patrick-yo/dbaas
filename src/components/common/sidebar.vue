<template>
  <el-aside width="200px">
    <el-menu 
    class="el-menu-vertical-demo"
    style="margin-left: -50px"
    background-color="#383838"
    text-color="#e2e2e2"
    active-text-color="#aa9bff"
    :default-active="$route.path"
    router
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-notebook-2"/>
          <span>数据库</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="createdb">
            <i class="el-icon-plus" />创建</el-menu-item>
          <el-menu-item index="dashboard">
            <i class="el-icon-search" />查看</el-menu-item>
          <el-menu-item index="1-3">
            <i class="el-icon-edit" />修改</el-menu-item>
          <el-menu-item index="1-4">
            <i class="el-icon-delete" />删除</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    // handleSelect(key, keyPath) {
    //   console.log(key, keyPath);
    // }
  }
}
</script>

<style>
.el-aside {
  background-color: #383838;
}
</style>