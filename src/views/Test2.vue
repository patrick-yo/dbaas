<template>
  <v-chart class="chart" :option="option" :auto-resize="true" />
</template>

<script>
import VChart from "vue-echarts";
export default {
  components: {
    VChart,
  },
  data() {
    return {
      option: {
        title: {
          text: "Test2",
        },
        tooltip: {},
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "graph",
            layout: "none",
            coordinateSystem: "cartesian2d",
            symbolSize: 40,
            label: {
              show: true,
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            // data: [898, 618, 915, 3862, 1684, 1203, 1874],
            data: [],
            links: [],
            lineStyle: {
              color: "#2f4554",
            },
          },
        ],
      },
    };
  },
  methods: {
    getData() {
      var axisData = [
        "周一",
        "周二",
        "周三",
        "很长很长的周四",
        "周五",
        "周六",
        "周日",
      ];
      var data = [898, 618, 915, 3862, 1684, 1203, 1874];
      // var data = axisData.map(function (item, i) {
      //   return Math.round(Math.random() * 1000 * (i + 1));
      // });
      var links = data.map(function (item, i) {
        return {
          source: i,
          target: i + 1,
        };
      });
      links.pop();

      this.option.xAxis.data = axisData;
      this.option.series[0].data = data;
      this.option.series[0].links = links;
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
