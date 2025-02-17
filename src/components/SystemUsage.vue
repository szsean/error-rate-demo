<template>
  <div class="system-usage">
    <div ref="usageChart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'SystemUsage',
  props: {
    cpuData: {
      type: Array,
      required: true
    },
    memoryData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.chart && this.$refs.usageChart) {
        this.initChart();
      }
      window.addEventListener('resize', this.handleResize);
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.chart?.dispose();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.usageChart);
      this.updateChart();
    },
    updateChart() {
      const today = new Date();
      const earliestDate = new Date(today);
      earliestDate.setDate(today.getDate() - 60);

      const allDates = [];
      const currentDate = new Date(earliestDate);
      while (currentDate <= today) {
        allDates.push(currentDate.toLocaleDateString());
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const cpuDataMap = new Map();
      const memoryDataMap = new Map();

      allDates.forEach(date => {
        cpuDataMap.set(date, null);
        memoryDataMap.set(date, null);
      });

      this.cpuData.forEach((value, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (this.cpuData.length - 1 - index));
        cpuDataMap.set(date.toLocaleDateString(), value);
      });

      this.memoryData.forEach((value, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (this.memoryData.length - 1 - index));
        memoryDataMap.set(date.toLocaleDateString(), value);
      });

      const cpuDataArray = allDates.map(date => cpuDataMap.get(date));
      const memoryDataArray = allDates.map(date => memoryDataMap.get(date));

      const option = {
        title: {
          text: '系统资源使用趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(params) {
            const date = params[0].axisValue;
            let result = `日期：${date}<br/>`;
            let cpuValue = '-';
            let memoryValue = '-';

            params.forEach(param => {
              if (param.seriesName === 'CPU使用率') {
                cpuValue = param.value !== null ? param.value + '%' : '-';
              } else if (param.seriesName === '内存使用率') {
                memoryValue = param.value !== null ? param.value + '%' : '-';
              }
            });

            result += `CPU使用率：${cpuValue}%<br/>`;
            result += `内存使用率：${memoryValue}`;
            return result;
          }
        },
        legend: {
          data: ['CPU使用率', '内存使用率'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: allDates
        },
        yAxis: {
          type: 'value',
          name: '使用率 (%)',
          min: 0,
          max: 100
        },
        series: [
          {
            name: 'CPU使用率',
            type: 'line',
            data: cpuDataArray,
            smooth: true,
            symbol: 'circle',
            symbolSize: (value) => value === null ? 0 : 6,
            lineStyle: {
              width: 3,
              color: '#409EFF'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64,158,255,0.3)' },
                { offset: 1, color: 'rgba(64,158,255,0.1)' }
              ])
            },
            connectNulls: true
          },
          {
            name: '内存使用率',
            type: 'line',
            data: memoryDataArray,
            smooth: true,
            symbol: 'circle',
            symbolSize: (value) => value === null ? 0 : 6,
            lineStyle: {
              width: 3,
              color: '#67C23A'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(103,194,58,0.3)' },
                { offset: 1, color: 'rgba(103,194,58,0.1)' }
              ])
            },
            connectNulls: true
          }
        ]
      };

      this.chart.setOption(option);
    },
    handleResize() {
      this.chart?.resize();
    }
  },
  watch: {
    cpuData: {
      handler() {
        this.updateChart();
      },
      deep: true
    },
    memoryData: {
      handler() {
        this.updateChart();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.system-usage {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 500px;
}
</style>
