<template>
  <v-chart class="chart" :option="option" :auto-resize="true" />
</template>

<script>
import VChart from "vue-echarts";
import { modelList, edgeList } from "./data/model";

export default {
  components: {
    VChart,
  },
  data() {
    return {
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
            // links: [
            //   {
            //     source: 0, // 可以用数字索引节点
            //     target: 1,
            //     // symbolSize: [5, 20],
            //     // label: {
            //     //   show: true,  // 显示标签
            //     // },
            //     lineStyle: {
            //       // width: 5,
            //       curveness: 0.2, // 线的弯曲程度
            //     },
            //   },
            //   {
            //     source: "X86物理设备",
            //     target: "主机",
            //     label: {
            //       show: true,
            //     },
            //     lineStyle: {
            //       curveness: 0,
            //     },
            //   },
            //   {
            //     source: "主机",
            //     target: "IP地址",
            //   },
            //   {
            //     source: "X86物理设备",
            //     target: "IP地址",
            //   },
            //   {
            //     source: "X86物理设备",
            //     target: "物理数据库",
            //   },
            //   {
            //     source: "主机",
            //     target: "物理数据库",
            //   },
            // ],
            lineStyle: {
              opacity: 0.9,
              width: 1,
              curveness: 0,
              symbolSize: [5, 20],
            },
          },
        ],
      },
    };
  },
  methods: {
    getBasicGraph() {
      console.log(edgeList);
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

      // 初始化坐标矩阵区域(area)，(class+column)和level组成的矩阵
      // var classList = ["infra", "storage", "security", "network", "system", "db", "product"]
      // var levelList = ["app", "service", "os", "virtual", "physical"]
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
          name: model.name,
          // symbol: "rect",
          symbolSize: [50, 42],
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
            areaJson[key].push(model.name);
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
</style>
