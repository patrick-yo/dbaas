<template>
  <div class="container" align="left">
    <div class="content-title">数据库列表</div>
      <el-table 
        :data="tableDataSts" 
        highlight-current-row 
        size="mini" 
        stripe 
        style="width: 100%"
        :header-cell-style="{'background-color': '#55557b', 'color': '#ffffff'}">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form class="demo-table-expand">
              <el-form-item v-for="(item, index) of podJson[scope.row.dbName]" :key="index">
                <el-col 
                  :span="5" 
                  style="margin-top:-10px; margin-bottom:-27px; text-align:center" 
                  v-for="(podValue, podKey) in item" 
                  :key="podKey">
                  <span style="font-size:12px" >{{ podValue }}</span>
                </el-col>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" width="40" />
        <el-table-column 
        v-for="item in columnInfoSts" 
        :prop="item.prop" :key="item.prop" :label="item.label" :width="item.width" />
        <el-table-column prop="dbStatus" label="状态">
          <template slot-scope="scope">
            <el-button :type="scope.row.statusType" circle size="mini"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="dbAction" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleAction(scope.row)" type="text" size="small">修改</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
import moment from "moment";
import dashboardData from "./const";
export default {
  data() {
    return {
      tableDataSts: [],
      tableDataPods: [],
      columnInfoSts: dashboardData.columnInfoSts,
      columnInfoPods: dashboardData.columnInfoPods,
      rowDataPodList: [],
      podJson: {}
    }
  },
  methods: {
    handleAction(row) {
      console.log(row)
    },
    initSts() {
      var url = 'ws://192.168.242.200:9090/k8s/watch/sts'
      var ws = new WebSocket(url)
      ws.onopen = function(evt) {
        ws.send('WebSocket Statefulsets监控连接成功!')
      }
      ws.onmessage = this.wsOnMessageSts
    },
    initSvc() {
      var url = 'ws://192.168.242.200:9090/k8s/watch/svc'
      var ws = new WebSocket(url)
      ws.onopen = function(evt) {
        ws.send('WebSocket Service监控连接成功!')
      }
      ws.onmessage = this.wsOnMessageSvc
    },
    initPods() {
      var url = 'ws://192.168.242.200:9090/k8s/watch/pods'
      var ws = new WebSocket(url)
      ws.onopen = function(evt) {
        ws.send('WebSocket Pod监控连接成功!')
      }
      ws.onmessage = this.wsOnMessagePods
    },
    // TODO: wsOnMessageSvc()有问题，和svc和sts先后顺序问题
    wsOnMessageSvc(evt) {
      var obj = JSON.parse(evt.data)
      var object = obj.Object
      var selector = object.spec.selector
      var dbPort = object.spec.ports[0].nodePort
      for (var key in selector) {
        var labelKey = key
        var labelValue = selector[key]
      }
      setTimeout(
        function() {
          for (var index in this.tableDataSts) {
            var stsLabel = this.tableDataSts[index].dbLabel
            if ((Object.keys(stsLabel))[0] == labelKey && stsLabel[(Object.keys(stsLabel))[0]] == labelValue) {
              this.tableDataSts[index].dbPort = dbPort
              console.log("hello")
            }
          }
        }, 800
      );
    },

    wsOnMessagePods(evt) {
      var obj = JSON.parse(evt.data)
      var object = obj.Object
      var podName = object.metadata.name
      var stsName = object.metadata.ownerReferences[0].name
      var nodeName = object.spec.nodeName
      var startTime = ""
      var podRow = {}
      object.status.startTime ? startTime = moment(new Date(object.status.startTime)).format('YYYY-MM-DD HH:mm:ss') : startTime = ""

      podRow.podName = podName
      podRow.podNode = nodeName
      podRow.podCreateTime = startTime

      // 状态
      if (object.status.phase == "Running") {
        for (var conditions of object.status.conditions) {
          if (conditions.status == "False") {
            for (var state in object.status.containerStatuses[0].state) {
              var reason = object.status.containerStatuses[0].state[state].reason
              if (!reason) {
                reason = "unknown"
              }
              podRow.podStatus = state + " (" + reason + ")"
            }
            break;
          } else {
            podRow.podStatus = "Running"
          }
        } 
      } else if (object.status.phase == "Pending") {
        if (Object.prototype.hasOwnProperty.call(object.status, "containerStatuses")) {
          podRow.podStatus = object.status.containerStatuses[0].state.waiting.reason
        } else {
          podRow.podStatus = "Pending"
        }
      } else {
        podRow.podStatus = "unknown"
      }
      switch (obj.Type) {
        case "ADDED": 
          if (!this.podJson[stsName]) {
            this.podJson[stsName] = []
            this.podJson[stsName].push(podRow)
          } else {
            this.podJson[stsName].push(podRow)
          }
          break;
        case "MODIFIED":
          for (var indexMod in this.podJson[stsName]) {
            if (podName == this.podJson[stsName][indexMod]["podName"]) {
              this.podJson[stsName].splice(indexMod, 1)
              this.podJson[stsName].push(podRow)
            }
          }
          break;
        case "DELETED":
          for (var indexDel in this.podJson[stsName]) {
            if (podName == this.podJson[stsName][indexDel]["podName"]) {
              this.podJson[stsName].splice(indexDel, 1)
            }
          }
          break;
      }
    },
    wsOnMessageSts(evt) {
      var obj = JSON.parse(evt.data)
      var object = obj.Object
      var rowData = {}
      rowData.dbType = object.metadata.labels.app
      rowData.dbName = object.metadata.name
      rowData.dbVersion = object.spec.template.spec.containers[0].image.split(":")[1]
      // 副本数(Pods)
      var dbReplcRdy = object.status.readyReplicas
      if (!dbReplcRdy) { dbReplcRdy = 0 }
      var dbReplcTtl = object.spec.replicas
      dbReplcRdy == dbReplcTtl ? rowData.statusType = "success" : rowData.statusType = "warning"
      if (dbReplcRdy == 0) { rowData.statusType = "danger" }
      var dbReplicas = String(dbReplcRdy) + " / " + String(dbReplcTtl)
      rowData.dbReplicas = dbReplicas
      // 创建时间
      var dbCrtTimeOri = object.metadata.creationTimestamp
      var dbCreateTime = moment(new Date(dbCrtTimeOri)).format('YYYY-MM-DD HH:mm:ss')
      rowData.dbCreateTime = dbCreateTime

      rowData.dbLabel = object.spec.selector.matchLabels


      switch (obj.Type) {
        case "ADDED":
          this.tableDataSts.push(rowData);
          break;
        case "DELETED":
          for (var indexDel in this.tableDataSts) {
            if (this.tableDataSts[indexDel].dbName == rowData.dbName) {
              this.tableDataSts.splice(indexDel, 1)
            }
          }
          break;
        case "MODIFIED":
          for (var indexMod in this.tableDataSts) {
            if (this.tableDataSts[indexMod].dbName == rowData.dbName) {
              dbReplcRdy = object.status.readyReplicas
              dbReplcRdy ? dbReplcRdy : dbReplcRdy = 0
              dbReplicas = String(dbReplcRdy) + " / " + String(dbReplcTtl)
              this.tableDataSts[indexMod].dbReplicas = dbReplicas
              this.tableDataSts[indexMod].statusType = rowData.statusType
            }
          }
          break;
      }
      // console.log("this.tableDataSts: ", this.tableDataSts)
    },
  },
  created() {
    this.initSts();
    this.initPods();
    this.initSvc()
  },
  destroyed() {
  }
}
</script>