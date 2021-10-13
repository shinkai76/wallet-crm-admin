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
        icon="el-icon-close"
        circle
        size="small"
        class="close-icon"
        @click="isShowCharts = false"
      ></el-button>
      <div class="charts-title-wrap">{{ name }}} assets</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getOverviewAssets, getOverviewRegistrants } from '@/api/overview'

@Component({
  name: 'Overview'
})
export default class extends Vue {
  private data: object[] = []
  private registrants: object = {}
  private name = ''
  private isShowCharts = false

  mounted() {
    this.init()
  }

  private init(): void {
    this.getAssets()
    this.getRegistrants()
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

  }

  private initCharts() {

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
  bottom: 20px;
  top: 20px;
  z-index: 100;
  background: #fff;
  border: 1px solid gray;
  box-shadow: 1px 2px 9px 9px gray;
  .close-icon {
    position: absolute;
    right: 40px;
    top: 40px;
    z-index: 200;
  }
}
</style>
