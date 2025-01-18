<template>
  <div id="app">
    <h1>误差率分析示例</h1>
    <error-rate-analysis :error-rates="errorRates" />
  </div>
</template>

<script>
import ErrorRateAnalysis from './components/ErrorRateAnalysis.vue'

export default {
  name: 'App',
  components: {
    ErrorRateAnalysis
  },
  data() {
    return {
      // errorRates: [-0.4348, -0.3486, -0.3321, -0.2986, -0.1499, 0.1202, 0.1255, 0.1358, 0.0279]
      // errorRates: [-0.4348, -0.3486, -0.3321, -0.2986, -0.1499, 0.1202, 0.1255, 0.1358, 0.0279, 0.0185]
      errorRates: [-0.0483, -0.0356, -0.0278, -0.012, -0.0001, 0.0123, 0.0225, 0.0335, 0.0445, 0.0555, 0.08, 0.1, 0.12, 0.2, 0.21]
      // errorRates: [-0.0483, -0.0356, -0.0278, -0.012, -0.0001, 0.0123, 0.0225, 0.0335, 0.0445, 0.0555, 0.08, 0.1, 0.12, 0.2, 0.21, 7265, 7652.63]

    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 20px;
}
</style>