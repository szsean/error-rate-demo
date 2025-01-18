/* eslint-disable no-unused-vars */
<template>
  <div class="error-rate-analysis">
    <div class="data-container">
      <div class="data-title">误差率原始数据：</div>
      <div class="data-content">{{ formattedData }}</div>
    </div>

    <div ref="distributionChart" style="width: 800px; height: 400px;"></div>
    <div ref="pieChart" style="width: 800px; height: 400px;"></div>

    <table class="stats-table">
      <thead>
        <tr>
          <th>误差范围</th>
          <th>样本数量</th>
          <th>占比</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stat in stats" :key="stat.range">
          <td>{{ stat.range }}</td>
          <td>{{ stat.count }}</td>
          <td>{{ stat.percentage }}%</td>
        </tr>
      </tbody>
    </table>

    <div class="conclusion" v-html="conclusion"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ErrorRateAnalysis',
  
  props: {
    errorRates: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  data() {
    return {
      ERROR_RANGES: [
        { max: 0.05, label: '≤5%' },
        { max: 0.10, label: '5%~10%' },
        { max: 0.20, label: '10%~20%' },
        { max: Infinity, label: '>20%' }
      ],
      stats: [],
      conclusion: '',
      distributionChart: null,
      pieChart: null
    }
  },

  computed: {
    formattedData() {
      return this.errorRates.map(value => value.toFixed(4)).join(', ')
    }
  },

  methods: {
    analyzeErrorRates() {
      const stats = this.ERROR_RANGES.map(range => ({
        range: range.label,
        count: 0,
        percentage: 0
      }))

      this.errorRates.forEach(value => {
        const absValue = Math.abs(value)
        for (let i = 0; i < this.ERROR_RANGES.length; i++) {
          if (absValue <= this.ERROR_RANGES[i].max) {
            stats[i].count++
            break
          }
        }
      })

      stats.forEach(stat => {
        stat.percentage = Number((stat.count / this.errorRates.length * 100).toFixed(2))
      })

      this.stats = stats
    },

    drawDistributionChart() {
      const data = this.errorRates
      const mean = data.reduce((a, b) => a + b, 0) / data.length
      const stdDev = Math.sqrt(
        data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length
      )

      const points = 100
      const curveData = []
      const min = Math.min(...data)
      const max = Math.max(...data)
      const range = max - min

      for (let i = 0; i < points; i++) {
        const x = min - range * 0.2 + (range * 1.4 * i) / (points - 1)
        const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
                 Math.exp(-Math.pow(x - mean, 2) / (2 * stdDev * stdDev))
        curveData.push([x, y])
      }

      const option = {
        title: {
          text: '误差率分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross'
          },
          formatter: function(params) {
            if (Array.isArray(params)) params = params[0]
            if (params.seriesName === '误差率') {
              return `误差率：${params.data[0].toFixed(4)}`
            } else if (params.seriesName === '正态分布') {
              return `正态分布：(${params.data[0].toFixed(4)}, ${params.data[1].toFixed(4)})`
            }
          }
        },
        xAxis: {
          type: 'value',
          name: '误差率'
        },
        yAxis: {
          type: 'value',
          name: '概率密度'
        },
        series: [
          {
            name: '误差率',
            type: 'scatter',
            data: data.map(value => [value, 0]),
            symbolSize: 8,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffsetY: 5
              },
              scale: 2.5
            }
          },
          {
            name: '正态分布',
            type: 'line',
            smooth: true,
            data: curveData,
            showSymbol: false,
            tooltip: {
              trigger: 'axis'
            }
          }
        ]
      }

      this.distributionChart.setOption(option)
    },

    drawPieChart() {
      const option = {
        title: {
          text: '误差率区间分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          name: '误差率分布',
          type: 'pie',
          radius: '50%',
          data: [
            {
              value: this.stats[0].count,
              name: this.stats[0].range,
              itemStyle: { color: '#2E7D32' }
            },
            {
              value: this.stats[1].count,
              name: this.stats[1].range,
              itemStyle: { color: '#81C784' }
            },
            {
              value: this.stats[2].count,
              name: this.stats[2].range,
              itemStyle: { color: '#FFA726' }
            },
            {
              value: this.stats[3].count,
              name: this.stats[3].range,
              itemStyle: { color: '#D32F2F' }
            }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }

      this.pieChart.setOption(option)
    },

    generateConclusion() {
      const within20Percent = Number(this.stats.slice(0, 3)
        .reduce((sum, stat) => sum + parseFloat(stat.percentage), 0)).toFixed(2)
      const within10Percent = Number(this.stats.slice(0, 2)
        .reduce((sum, stat) => sum + parseFloat(stat.percentage), 0)).toFixed(2)
      const within5Percent = Number(this.stats[0].percentage).toFixed(2)
      const sampleSize = this.errorRates.length

      const mean = this.errorRates.reduce((a, b) => a + b, 0) / sampleSize
      const stdDev = Math.sqrt(
        this.errorRates.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sampleSize
      )

      let conclusion = `分析结论：<br>`
      
      // 样本量评估
      conclusion += `样本量评估：<br>`
      if (sampleSize < 10) {
        conclusion += `⚠️ 当前样本量（${sampleSize}个）过少，评估结果可能缺乏代表性，建议增加样本数量至少30个以上。<br><br>`
      } else if (sampleSize < 30) {
        conclusion += `⚠️ 当前样本量（${sampleSize}个）偏少，评估结果仅供参考，建议增加样本数量以提高可信度。<br><br>`
      } else if (sampleSize < 100) {
        conclusion += `✅ 当前样本量（${sampleSize}个）基本充足，评估结果具有一定参考价值。<br><br>`
      } else {
        conclusion += `✅ 当前样本量（${sampleSize}个）充足，评估结果具有较高可信度。<br><br>`
      }

      conclusion += `误差分布：<br>`
      conclusion += `- ${within5Percent}% 的预测误差在5%以内<br>`
      conclusion += `- ${within10Percent}% 的预测误差在10%以内<br>`
      conclusion += `- ${within20Percent}% 的预测误差在20%以内<br><br>`

      conclusion += `预测倾向性分析：<br>`
      conclusion += `- 平均误差：${mean.toFixed(4)}<br>`
      conclusion += `- 误差标准差：${stdDev.toFixed(4)}<br>`

      // 分析预测倾向
      if (Math.abs(mean) < 0.01) {
        conclusion += `- 预测值分布较为均衡，无明显的高估或低估倾向<br>`
      } else if (mean > 0) {
        conclusion += `- 预测算法整体呈现高估倾向（平均高估 ${(mean * 100).toFixed(2)}%）<br>`
      } else {
        conclusion += `- 预测算法整体呈现低估倾向（平均低估 ${(Math.abs(mean) * 100).toFixed(2)}%）<br>`
      }

      // 添加总体评价
      conclusion += `<br>总体评价：<br>`
      let confidencePrefix = ''
      if (sampleSize < 30) {
        confidencePrefix = '基于有限样本分析，'
      }
      
      if (within20Percent >= 90) {
        conclusion += confidencePrefix + '✅ 该算法的预测准确度很高，表现优秀。'
        if (Math.abs(mean) >= 0.05) {
          conclusion += `但存在${mean > 0 ? '高估' : '低估'}倾向，建议适当${mean > 0 ? '降低' : '提高'}预测值。`
        }
        if (stdDev >= 0.10) {
          conclusion += '预测结果的稳定性有待提高。'
        }
      } else if (within20Percent >= 80) {
        conclusion += confidencePrefix + '⚠️ 该算法的预测准确度一般，建议进行优化。'
        if (Math.abs(mean) >= 0.05) {
          conclusion += `需要重点修正${mean > 0 ? '高估' : '低估'}倾向（平均${mean > 0 ? '高估' : '低估'} ${(Math.abs(mean) * 100).toFixed(2)}%）。`
        }
        if (stdDev >= 0.15) {
          conclusion += '同时需要提高预测的稳定性。'
        } else if (stdDev >= 0.10) {
          conclusion += '建议适当改进预测的稳定性。'
        }
      } else {
        conclusion += confidencePrefix + '❌ 该算法的预测准确度较低，需要重点改进。'
        if (Math.abs(mean) >= 0.10) {
          conclusion += `存在明显的${mean > 0 ? '高估' : '低估'}倾向（平均${mean > 0 ? '高估' : '低估'} ${(Math.abs(mean) * 100).toFixed(2)}%）。`
        }
        if (stdDev >= 0.20) {
          conclusion += '预测结果极不稳定，波动范围过大。'
        } else if (stdDev >= 0.15) {
          conclusion += '预测结果稳定性较差。'
        }
      }

      // 样本量不足时的补充建议
      if (sampleSize < 30) {
        conclusion += '<br><br>📊 建议：在进行算法优化之前，建议先增加测试样本量，以获得更可靠的评估结果。'
      }

      this.conclusion = conclusion
    },

    initCharts() {
      this.distributionChart = echarts.init(this.$refs.distributionChart)
      this.pieChart = echarts.init(this.$refs.pieChart)
    },

    updateAnalysis() {
      this.analyzeErrorRates()
      this.drawDistributionChart()
      this.drawPieChart()
      this.generateConclusion()
    },

    handleResize() {
      this.distributionChart?.resize()
      this.pieChart?.resize()
    }
  },

  mounted() {
    this.initCharts()
    this.updateAnalysis()
    window.addEventListener('resize', this.handleResize)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.distributionChart?.dispose()
    this.pieChart?.dispose()
  },

  watch: {
    errorRates: {
      handler() {
        this.updateAnalysis()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.error-rate-analysis {
  margin: 20px;
  font-family: Arial, sans-serif;
}

.data-container {
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.data-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.data-content {
  max-height: 150px;
  overflow-y: auto;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.stats-table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
}

.stats-table th,
.stats-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.stats-table th {
  background-color: #f4f4f4;
}

.conclusion {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #28a745;
}
</style> 