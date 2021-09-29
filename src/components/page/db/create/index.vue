<template>
  <div class="container" align="left">
    <div class="content-title">创建数据库</div>
    <el-row :gutter="20">
      <!-- 基础信息 -->
      <el-col :span="22">
        <el-card>
          <div slot="header">
            <span class="card-title">基础信息</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-form size="mini" label-position="right" label-width="110px" ref="createDbForm" :model="createDbForm">
                <el-col :span="11">
                  <el-form-item label="名称">
                    <el-input v-model="createDbForm.dbName" placeholder="请输入名称" />
                  </el-form-item>
                  <el-form-item label="副本数">
                    <el-input-number v-model="createDbForm.replicaNum" :min="1" :max="10"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="数据库种类">
                    <el-select v-model="createDbForm.dpTypeValue" placeholder="请选择" @change="selectDbType">
                      <el-option v-for="item in createDbForm.dbTypeOpt" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="镜像版本">
                    <template v-if="createDbForm.imageOpt!=''">
                      <el-select v-model="createDbForm.imageVersion" placeholder="请选择">
                        <el-option v-for="item of createDbForm.imageOpt" :key="item" :label="item" :value="item" />
                      </el-select>
                    </template>
                    <template v-else>
                      <el-select v-model="createDbForm.imageVersion" placeholder="请先选择数据库种类" disabled/>
                    </template>
                  </el-form-item>
                  <el-form-item label="集群类型">
                    <el-select v-model="createDbForm.clusterValue" placeholder="请选择">
                      <el-option v-for="item in createDbForm.clusterOpt" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
      <!-- 配置信息 -->
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="22">
        <el-card>
          <div slot="header">
            <span class="card-title">配置信息</span>
          </div>
          <div style="margin-top: -20px">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="存储" name="1">
                <div>存储配置内容</div>
              </el-collapse-item>
              <el-collapse-item title="网络" name="2">
                <el-col :span="11">
                  <el-form size="mini" label-position="right" label-width="110px" ref="createDbForm" :model="createDbForm">
                    <el-form-item label="数据库端口">
                      <el-input v-model="createDbForm.network.port" placeholder="默认5432" />
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-collapse-item>
              <el-collapse-item title="其他" name="3">
                <div>其他配置内容</div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <div class="submitButton">
        <el-button type="primary" @click="onSubmit" size="medium">创建</el-button>
        <el-button size="medium">取消</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import createDbOptions from "./options"
import createYamlTemplate from "./yaml"
export default {
  data() {
    return {
      createDbForm: {
        clusterValue: 'single',
        replicaNum: 1,
        dpTypeValue: '',
        dbName: 'pgsql-test-v',
        imageVersion: '',
        dbTypeOpt: createDbOptions.dbTypeOpt,
        clusterOpt: createDbOptions.clusterOpt,
        imageOpt: '',
        network: {
          port: ''
        },
      },
      activeNames: ['2']
    }
  },
  methods: {
    selectDbType() {
      this.createDbForm.imageOpt = createDbOptions.imageOpt[this.createDbForm.dpTypeValue]
    },
    onSubmit() {
      for (var key in this.createDbForm) {
        if (!this.createDbForm[key]) {
          this.$message.error('请填入必要参数')
          return
        }
      }
      var createYaml = createYamlTemplate
      createYaml.metadata.name = this.createDbForm.dbName
      createYaml.spec.replica = this.createDbForm.replicaNum
      createYaml.spec.version = this.createDbForm.imageVersion
      if (this.createDbForm.network.port) {
        createYaml.spec.service.port = parseInt(this.createDbForm.network.port)
      }
      var url = "k8s/createdb"
      this.$http.post(url, createYaml).then(response => {
        if (response.status == 200) {
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          setTimeout(
            function() {
              window.location ="http://localhost:8080/dashboard"
            }, 1500
          );
        }
      }, error => {
        this.$message.error('参数错误, Status Code: ' + error.response.status);
      })
    },
  }
}
</script>

<style scoped>
.submitButton {
  margin-top: 30px;
  text-align: right;
}
</style>