<template>
  <div>
    <el-container>
      <!-- <el-col :span="2"> -->
      <el-col :span=2>
        <div v-if="buttonVisible == true">
          <el-button-group style="margin-top: 30px">
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
      <!-- </el-col> -->
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
          <el-button @click="addModelButtonEvent" size="mini" type="warning">添加
          </el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import VChart from "vue-echarts";
import { modelList, edgeList, subModelList } from "./model";

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
      deleteList: [],
      restaurants: subModelList,
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
            type: "graph",
            markLine: {
              data: [],
              symbol: "none",
              symbolSize: 5,
              silent: true,
              lineStyle: {
                width: 0.5,
                opacity: 0.8
              },
            },
            layout: "none", // 'none' 不采用任何布局，使用节点中提供的 x， y 作为节点的位置。可选force和circular
            symbolSize: 50,
            roam: "none", // 鼠标滚轮缩放(sale) 和 拖动平移(move)，true表示都设置
            label: {
              show: true, // 节点标签是否展示
            },
            edgeSymbol: ["circle", "arrow"], // 连线两端的标记类型，[0]起始，[1]终止
            edgeSymbolSize: [5, 10], // 连线两端的标记大小
            // edgeLabel: {
            //   fontSize: 15, // 连线关系标签字体的大小
            // },
            data: [],
            links: [],
            lineStyle: {
              opacity: 0.7,
              width: 0.8,
            },
          },
        ],
      },
    };
  },
  methods: {
    deleteModel() {
      this.deleteList = []
      this.deleteMode = true
      this.buttonVisible = false
      this.option.title.text = "删除模式(点击模型即可删除)"
    },
    deleteSave() {
      this.deleteMode = false
      this.buttonVisible = true
      this.option.title.text = "拓扑示例"
      var deleteMessage = ""
      if (this.deleteList.length) {
        for (const deletedItem of this.deleteList) {
          deleteMessage = deleteMessage + deletedItem + "\n"
        }
        const h = this.$createElement;
        this.$notify({
          title: '已删除' + String(this.deleteList.length) +  '个模型',
          message: h('i', { style: 'color: teal'}, deleteMessage),
          type: 'success'
        });
      }
    },
    vChartClickEvent(e) {
      if (this.deleteMode) {
        for (const modelItem of modelList) {
          if (modelItem.value == e.data.name) {
            this.deleteList.push(modelItem.value)
            var indexItem = modelList.indexOf(modelItem)
            var deletedModel = modelItem
            break
          }
        }
        modelList.splice(indexItem, 1)
        this.restaurants.push(deletedModel)
        this.getBasicGraph()
      }
    },

    addModelButtonEvent() {
      if (this.input && this.selectedItem) {
        if (subModelList.indexOf(this.selectedItem) != -1) {
          for (const index in subModelList) {
            if (subModelList[index] == this.selectedItem) {
              subModelList.splice(index, 1)
              modelList.push(this.selectedItem)
              const h = this.$createElement;
              this.$notify({
                title: "已添加",
                message: h('i', { style: 'color: teal'}, this.selectedItem.value),
                type: 'success'
              });
              this.input = ""
              this.selectedItem = ""
              this.getBasicGraph()
            }
          }
        } 
        else {
          const h = this.$createElement;
          this.$notify({
            title: "错误",
            message: h('i', { style: 'color: teal'}, "未找到模型"),
            type: 'error'
          });
        }
      } 
      else {
        const h = this.$createElement;
        this.$notify({
          title: "提示",
          message: h('i', { style: 'color: teal'}, "请选择模型"),
          type: 'warning'
        });
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log("item---,", item)
      this.selectedItem = item
      this.input = item.value
    },

    getBasicGraph() {
      this.option.series[0].data = []
      this.option.series[0].markLine.data = []
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

      
      var ClassCoord = columnInterval / 2;
      var totalLevelCoord =  -rowInterval / 2;
      // var totalLevelCoord = 0;
      // 纵坐标区域虚线

      // 计算y轴最高点
      for (const levelScaleItem of levelScaleList) {
        totalLevelCoord = totalLevelCoord + (Number(Object.values(levelScaleItem)) * rowInterval)
      }
      // 计算x轴各点
      for (var classScaleItem of classScaleList) {
        ClassCoord = ClassCoord + (Number(Object.values(classScaleItem)) * columnInterval)
        var classDivideLine = [
          {
            name: Object.keys(classScaleItem)[0],
            coord: [ClassCoord, totalLevelCoord],
            label: {
              position: "insideEndTop",
              fontSize: 8,
              color: "grey"
            }

          },
          {
            coord: [ClassCoord, -rowInterval/2]
          },
        ]
        this.option.series[0].markLine.data.push(classDivideLine)
      }
      // this.option.series[0].markLine.data.pop()

      var totalClassCoord = columnInterval / 2;
      var levelCoord = - rowInterval / 2;
      // 计算x轴最远点
      for (var everyClassScaleItem of classScaleList) {
        totalClassCoord = totalClassCoord + (Number(Object.values(everyClassScaleItem)) * columnInterval)
      }
      // 计算y轴各点
      for (var everyLevelScaleItem of levelScaleList) {
        levelCoord = levelCoord + (Number(Object.values(everyLevelScaleItem)) * rowInterval)
        var levelDivideLine = [
          {
            name: Object.keys(everyLevelScaleItem)[0],
            coord: [columnInterval/2, levelCoord],
            lineStyle: {
              color: "#FF3324"
            },
            label: {
              position: "insideStartTop",
              fontSize: 8,
              color: "grey"
            }
          },
          {
            coord: [totalClassCoord, levelCoord]
          },
        ]
        this.option.series[0].markLine.data.push(levelDivideLine)
      }
      // this.option.series[0].markLine.data.pop()

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
      let cmdbModel = [];
      for (const model of modelList) {
        // 模型(model)基础信息
        var json = {
          name: model.value,
          // symbol: "rect",  // (长)方形模块会导致连线错位，待解决
          symbolSize: [40, 35],
          label: {
            fontSize: 8.5,
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
