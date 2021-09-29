<template>
  <el-header>
    <img src="@/assets/bu5Dbaas.png" alt="" @click='goHomePage' class="img">
  </el-header>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goHomePage(){
      var page_now  = window.location.host
      window.open('http://' + page_now,'_self')
    }
  }
}
</script>

<style scoped>
.el-header {
  text-align: left;
  background-color: #383838;
}
.img {
  margin-top: 7px;
  margin-left: -20px;
  cursor:pointer;
  transform: scale(0.8)
}
</style>