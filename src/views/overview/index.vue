<template>
  <div class="dashboard-container">
    <div class="register-info-wrap">
      <div class="register-info-block block-shadow">
        <span class="register-info-num">{{
          registrants.total | formatNumber
        }}</span>
        <div class="register-info-title">Total registrants</div>
      </div>
      <div class="register-info-block block-shadow">
        <span class="register-info-num">{{ registrants.today }}</span>
        <div class="register-info-title">Today registrants</div>
      </div>
      <div class="register-info-block block-shadow">
        <span class="register-info-num">{{ registrants.yesterday }}</span>
        <div class="register-info-title">yesterday registrants</div>
      </div>
      <div class="register-info-block block-shadow">
        <span class="register-info-num">{{
          registrants.last_30_days || 0
        }}</span>
        <div class="register-info-title">Last 30 days registrants</div>
      </div>
    </div>
    <div class="token-wrap block-shadow">
      <div class="token-blocks">
        <div class="token-block" v-for="item in data" :key="item.name">
          <div class="token-name">{{ item.name }}</div>
          <div class="arrow" @click="onShowCharts(item.name)">
            {{ item.num }}
            <svg-icon name="arrow" width="20" height="20" />
          </div>
        </div>
      </div>
      <p class="text-center">Total Assets</p>
    </div>

    <div class="charts-dialog" v-show="isShowCharts">
      <el-button
        icon="el-icon-back"
        circle
        size="small"
        class="back-icon"
        @click="isShowCharts = false"
      ></el-button>
      <div class="charts-title-wrap">{{ name }} assets</div>
      <small class="charts-subtitle">The last 30 days data</small>
      <div id="main" style="width: 1300px; height: 700px"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getCoinStatistics, getOverviewAssets, getOverviewRegistrants } from '@/api/overview'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  VisualMapComponent,
  VisualMapComponentOption
} from 'echarts/components'
import { LineChart, LineSeriesOption } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | VisualMapComponentOption
  | LineSeriesOption
  >;

@Component({
  name: 'Overview'
})
export default class extends Vue {
  private data = []
  private registrants = {}
  private name = ''
  private isShowCharts = false
  private thirtyData = []
  private chartDom:any
  private myChart:any
  private dateList:string[] = []
  private inList:string[] = []
  private outList:string[] = []

  mounted() {
    this.init()
  }

  private init(): void {
    this.getAssets()
    this.getRegistrants()
    this.initCharts()
  }

  private getAssets(): void {
    getOverviewAssets()
      .then((res: any) => {
        this.data = res.assets || []
      })
      .catch(() => {
        this.$message({
          type: 'error',
          message: 'Network request failed'
        })
      })
  }

  private getRegistrants(): void {
    getOverviewRegistrants()
      .then((res: any) => {
        this.registrants = res
      })
      .catch(() => {
        this.$message({
          type: 'error',
          message: 'Network request failed'
        })
      })
  }

  private onShowCharts(name:string) {
    this.name = name
    this.isShowCharts = true
    this.getChartsData()
  }

  private getChartsData() {
    this.inList.length = 0
    this.outList.length = 0
    this.dateList.length = 0
    const params = {
      coin_name: this.name
    }
    getCoinStatistics(params)
      .then((res:any) => {
        this.thirtyData = res.in_and_out
        this.dateList = this.thirtyData.map((el:{in:string, out:string, timestamp_str:string}) => {
          this.inList.push(el.in + Math.random()*150)
          this.outList.push(el.out + Math.random()*150)
          return el.timestamp_str
        })
        this.setChartOptions()
      })
  }

  private setChartOptions() {
    const option:EChartsOption = {
      title: [
        {
          left: 'center',
          text: 'Total inflow'
        },
        {
          top: '55%',
          left: 'center',
          text: 'Total outflow'
        }
      ],
      tooltip: {
        trigger: 'axis',
        formatter: '{b} <br/>Quantity:  {c}'
      },
      xAxis: [
        {
          boundaryGap: false,
          data: this.dateList
        },
        {
          boundaryGap: false,
          data: this.dateList,
          gridIndex: 1
        }
      ],
      yAxis: [
        {},
        {
          gridIndex: 1
        }
      ],
      grid: [
        {
          bottom: '60%'
        },
        {
          top: '60%'
        }
      ],
      series: [
        {
          type: 'line',
          itemStyle: {
            color: 'rgba(252, 190, 4, 1)'
          },
          showSymbol: false,
          data: this.inList,
          lineStyle: {
            color: 'rgba(72, 162, 248, 1)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(86, 171, 251, 1)'
              },
              {
                offset: 1,
                color: 'rgba(131, 190, 245, 1)'
              }
            ])
          }
        },
        {
          type: 'line',
          itemStyle: {
            color: 'rgba(252, 190, 4, 1)'
          },
          showSymbol: false,
          data: this.outList,
          lineStyle: {
            color: 'rgba(19, 183, 210, 1)'
          },
          xAxisIndex: 1,
          yAxisIndex: 1,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(40, 192, 217, 1)'
              },
              {
                offset: 1,
                color: 'rgba(127, 225, 241, 1)'
              }
            ])
          }
        }
      ]
    }

    this.myChart.setOption(option)
  }

  private initCharts() {
    this.chartDom = document.getElementById('main')!
    this.myChart = echarts.init(this.chartDom)
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
}
.register-info-wrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  .register-info-block {
    width: 25%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background-color: #fff;
    min-height: 200px;
    .register-info-num {
      font-size: 33px;
      font-weight: 600;
    }
    .register-info-title {
      color: lightslategray;
    }
  }
}
.token-wrap {
  background-color: #fff;
  margin-top: 30px;
  padding: 30px;
  .token-blocks {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    min-height: 200px;
  }
  .token-block {
    width: 45%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.2;
    border-bottom: 2px solid #f1f1f1;
    padding: 4px 0;
    font-size: 14px;
    margin-bottom: 10px;
    .token-name {
      color: lightslategray;
    }
    .arrow {
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
.charts-dialog {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 0;
  top: 20px;
  z-index: 100;
  background: #fff;
  .back-icon {
    position: absolute;
    right: 40px;
    top: 40px;
    z-index: 200;
  }
  .charts-subtitle {
    color: #666
  }
}
#main {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
