<template>
  <div>
    <el-container>
      <el-col :span="2">
        <div v-if="buttonVisible == true">
          <el-button-group style="margin-top: 40px">
              <el-button 
              @click="drawer = true" 
              size="small" 
              type="primary" 
              icon="el-icon-plus"
              />
              <el-button 
              @click="deleteModel" 
              size="small" 
              type="info" 
              icon="el-icon-delete"
              />
          </el-button-group>
        </div>
        <div v-else>
          <el-button-group style="margin-top: 40px">
            <el-button
            @click="deleteSave"
            size="small" 
            type="primary"
            icon="el-icon-check">保存</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col>
        <v-chart class="chart" :option="option" :auto-resize="true" @click="vChartClickEvent" />
      </el-col>
    </el-container>
    <el-drawer
      title="添加模型"
      size="20%"
      :visible.sync="drawer"
      direction="ltr">
      <el-row :gutter="0">
        <el-col :span="15">
          <el-autocomplete 
          style="margin-left: 20px"
          :fetch-suggestions="querySearch" 
          v-model="input" 
          placeholder="请输入内容" 
          size="mini" 
          @select="handleSelect"
          clearable />
        </el-col>
        <el-col :span="9">
          <el-button @click="addModel" size="mini" type="warning">添加
          </el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import VChart from "vue-echarts";
import { modelList, edgeList, otherModelList } from "./model";

export default {
  components: {
    VChart,
  },
  data() {
    return {
      buttonVisible: true,
      input: "",
      drawer: false,
      deleteMode: false,
      restaurants: otherModelList,
      selectedItem: {},
      option: {
        title: {
          text: "拓扑示例",
        },
        tooltip: {},
        animationDurationUpdate: 1500, // 好像没啥效果
        animationEasingUpdate: "quinticInOut", // 好像没啥效果
        series: [
          {
            markLine: {
              data: [
                // [
                //   {x: "15%", y: "100%"},
                //   {x: "15%", y: "0%"}
                // ],
                // [
                //   {x: "30%", y: "100%"},
                //   {x: "30%", y: "0%"}
                // ],
              ],
            },
            type: "graph", // 坐标图
            layout: "none", // 'none' 不采用任何布局，使用节点中提供的 x， y 作为节点的位置。可选force和circular
            symbolSize: 50,
            roam: true, // 鼠标滚轮缩放(sale) 和 拖动平移(move)，true表示都设置
            label: {
              show: true, // 节点标签是否展示
            },
            edgeSymbol: ["circle", "arrow"], // 连线两端的标记类型，[0]起始，[1]终止
            edgeSymbolSize: [5, 10], // 连线两端的标记大小
            edgeLabel: {
              fontSize: 15, // 连线关系标签字体的大小
            },
            data: [],
            links: [],
            lineStyle: {
              opacity: 0.9,
              width: 1,
            },
          },
        ],
      },
    };
  },
  methods: {
    deleteModel() {
      this.deleteMode = true
      this.buttonVisible = false
      this.option.title.text = "删除模式(点击模型即可删除)"
    },
    deleteSave() {
      this.deleteMode = false
      this.buttonVisible = true
      this.option.title.text = "拓扑示例"

      const h = this.$createElement;
      this.$notify({
        title: '提示',
        message: h('i', { style: 'color: teal'}, '已保存'),
        type: 'success'
      });
    },

    vChartClickEvent(e) {
      if (this.deleteMode) {
        for (const modelItem of modelList) {
          if (modelItem.value == e.data.name) {
            var indexItem = modelList.indexOf(modelItem)
            var deletedModel = modelItem
            break
          }
        }
        modelList.splice(indexItem, 1)
        console.log("deletedModel---,", deletedModel)
        this.restaurants.push(deletedModel)
        this.getBasicGraph()
      }
    },

    addModel() {
      modelList.push(this.selectedItem)
      const h = this.$createElement;
      this.$notify({
        title: '提示',
        message: h('i', { style: 'color: teal'}, '添加成功'),
        type: 'success'
      });
      this.getBasicGraph()
    },

    querySearch(queryString, cb) {
      console.log("queryString---,", queryString)
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // console.log("restaurants---,", restaurants)
      // console.log("results---,", results)
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.selectedItem = item
      console.log("this.selectedItem------,", this.selectedItem);
    },

    getBasicGraph() {
      this.option.series[0].data = []
      // console.log(edgeList);
      let columnInterval = 350,
        rowInterval = 200; // x, y坐标的interval

      // 阶层(level) 与 种类(class) 定义
      var levelJson = { app: 0 },
        classJson = { infra: 0 };
      // 种类(class)划分(横坐标比例) (直接定义为json无序，所以定义为数组对象)
      var classScaleList = [
        { infra: 1 },
        { storage: 1 },
        { security: 1 },
        { network: 2 },
        { system: 4 },
        { db: 1 },
        { product: 1 },
      ];
      for (var i = 1; i <= 6; i++) {
        classJson[Object.keys(classScaleList[i])] =
          classJson[Object.keys(classScaleList[i - 1])] +
          Object.values(classScaleList[i - 1]) * columnInterval;
      }
      // 阶层(level)划分(纵坐标比例)
      var levelScaleList = [
        { app: 1 },
        { service: 3 },
        { os: 1 },
        { virtual: 3 },
        { physical: 2 },
      ];
      for (var j = 1; j <= 4; j++) {
        levelJson[Object.keys(levelScaleList[j])] =
          levelJson[Object.keys(levelScaleList[j - 1])] +
          Object.values(levelScaleList[j]) * rowInterval;
      }
      // console.log("classJson---,", classJson)
      // console.log("levelJson----,", levelJson)

      // 以[(class+column) x level]初始化矩阵区域(area)
      var areaJson = {};
      for (const levelItem of levelScaleList) {
        for (const classItem of classScaleList) {
          var columnCount = Object.values(classItem);
          for (var k = 1; k <= columnCount; k++) {
            areaJson[
              Object.keys(levelItem) + "_" + Object.keys(classItem) + "_" + k
            ] = [];
          }
        }
      }
      // console.log("areaJson-------,", areaJson)
      let cmdbModel = [];
      for (const model of modelList) {
        // 模型(model)基础信息
        var json = {
          name: model.value,
          // symbol: "rect",  // (长)方形模块会导致连线错位，待解决
          symbolSize: [45, 38],
          label: {
            fontSize: 9,
          },
        };
        if (!model.column) {
          model["column"] = 1;
        }

        var modelAreaName =
          model.level + "_" + model.class + "_" + model.column;
        for (const key in areaJson) {
          if (modelAreaName == key) {
            areaJson[key].push(model.value);
            var areaLength = areaJson[key].length; // 判断坐标区域内有无别的model
          }
        }
        for (const levelKey in levelJson) {
          if (model["level"] == levelKey) {
            json["y"] = levelJson[levelKey] - (areaLength - 1) * rowInterval;
          }
        }
        for (const classKey in classJson) {
          if (model["class"] == classKey) {
            json["x"] = classJson[classKey] + model["column"] * columnInterval;
          }
        }
        cmdbModel.push(json);
      }
      this.option.series[0].data = cmdbModel;

      // 关系线
      this.option.series[0].links = []
      for (const edgeJson of edgeList) {
        edgeJson["symbolSize"] = [1, 5];
        this.option.series[0].links.push(edgeJson);
      }
    },
  },
  created() {
    this.getBasicGraph();
  },
};
</script>

<style scoped>
.chart {
  height: 100vh;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  /* text-align: center; */
  line-height: 200px;
}
</style>
