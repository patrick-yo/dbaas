<template>
  <div>
    <el-dialog
      title="标签管理"
      :close-on-click-modal="closeOnClickModal"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["dialogVisible"],
  data() {
    return {
      closeOnClickModal: false

    }
  },
  methods: {
    handleClose() {
      this.$emit("dialogNotVisible", false)
    },
  }
}
</script>