<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域    -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 100%;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from "axios";
import _ from 'lodash'

export default {
  name: 'Reports',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // 此时页面上的元素，已经被渲染完毕了
  async mounted() {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

    const {data: res} = await axios.get(`reports/type/1`)
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    const result = _.merge(this.options, res.data)
    myChart.setOption(result);
  },
  created() {


  },
  methods: {}
}
</script>

<style scoped>

</style>
