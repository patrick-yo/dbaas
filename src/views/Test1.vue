<template>
  <v-chart class="chart" :option="option" />
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
          text: "Topo Demo",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          // orient: "vertical",
          // left: "left",
          data: ["Peter", "Anne", "Sue", "Ken", "Tim"],
        },
        series: [
          {
            name: "Series Name",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { name: "Peter", value: 3211 },
              { name: "Anne", value: 1200 },
              { name: "Sue", value: 741 },
              { name: "Ken", value: 7228 },
              { name: "Tim", value: 900 },
            ],
            emphasis: {
              scaleSize: 15,
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                // shadowColor: "rgba(0, 0, 0, 0.5)"
              },
            },
          },
        ],
      },
    };
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
