<template>
  <div class="homeWrap">
    <el-container direction="vertical">
      <v-head></v-head>
      <el-container>
        <v-sidebar></v-sidebar>
        <div class="content-box">
          <div class="content">
            <transition name="move" mode="out-in">
            <!-- <transition name="el-zoom-in-center"> -->
              <router-view></router-view>
            </transition>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import vHead from "./header.vue";
import vSidebar from "./sidebar.vue";
export default {
  data() {
    return {
    }
  },
  components: {
    vHead,
    vSidebar,
  },
  methods: {
    goHomePage(){
      var page_now  = window.location.host
      window.open('http://' + page_now,'_self')
    }
  }
}
</script>

<style>
.el-container {
  height: 100%;
}
.homeWrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>