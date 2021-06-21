<style lang="less">
 @import './analysis.less';
</style>
<template>
<div class="dashboard-analysis-layout-wrap">
<div class="dashboard-analysis-layout-content">

    <div class="analysis-time-range-text">
      数据日期：2021/03/08 - 2021/03-14
    </div>

    <article class="basis-wrap">
      <div class="grid-content accident-content">
        <main>
          <h3 class="accident-title">事故个数</h3>
          <p class="accident-value">365</p>
          <section class="basis-sequential-flex">
            <div>周环比<span style="color: #FF376F;"><i class="el-icon-caret-bottom"></i>12</span></div>
            <div>日环比<i class="el-icon-caret-top"></i><span>12</span></div>
          </section>
        </main>
        <footer class="basis-grid-footer">
          平均事故时长: 5
        </footer>
      </div>
      <div class="grid-content accident-content">

        <section class="basis-column-layout">
          <div>
            <h3 class="accident-title">事故个数</h3>
            <p class="accident-value">365</p>
          </div>
          <div>
            <h3 class="accident-title">事故个数</h3>
            <p class="accident-value">365</p>
          </div>
        </section>

        <section class="chart-box" id="area1">

        </section>
      
        
        <footer class="basis-grid-footer">
          线下P0-P1  BUG数
        </footer>
      </div>
      <div class="grid-content accident-content">

        <section class="basis-column-layout">
          <div>
            <h3 class="accident-title">上线次数</h3>
            <p class="accident-value">365</p>
          </div>
          <div>
            <h3 class="accident-title">回滚次数</h3>
            <p class="accident-value">365</p>
          </div>
        </section>

        <section class="chart-box" id="publicAndRollbackNumber">

        </section>
      
        
        <footer class="basis-grid-footer">
          成功率
        </footer>
      </div>

      <div class="grid-content accident-content">

        <section class="basis-column-layout">
          <div>
            <h3 class="accident-title">报警次数</h3>
            <p class="accident-value">365</p>
          </div>
          <div>
            <h3 class="accident-title">处理次数</h3>
            <p class="accident-value">365</p>
          </div>
        </section>

        <section class="chart-box">
          <el-progress :percentage="30" :color="'#f00'"></el-progress>
        </section>
      
        
        <footer class="basis-grid-footer">
          <section class="basis-sequential-flex">
            <div>周环比<span style="color: #FF376F;"><i class="el-icon-caret-bottom"></i>12</span></div>
            <div>日环比<i class="el-icon-caret-top"></i><span>12</span></div>
          </section>
        </footer>
      </div>

      <div class="grid-content accident-content">

        <section class="basis-column-layout">
          <div>
            <h3 class="accident-title">慢查询核心DB</h3>
            <p class="accident-value">365</p>
          </div>
          <div>
            <h3 class="accident-title">非核心DB</h3>
            <p class="accident-value">365</p>
          </div>
        </section>

        <section class="chart-box" id="slowQueryAndNoCoreDb">

        </section>
      
        
        <footer class="basis-grid-footer">
          <section class="basis-sequential-flex">
            <div>周环比<span style="color: #FF376F;"><i class="el-icon-caret-bottom"></i>12</span></div>
            <div>日环比<i class="el-icon-caret-top"></i><span>12</span></div>
          </section>
        </footer>
      </div>

    </article>


  <el-card class="box-card bug-content" style="margin: 20px 0">

    <el-row type="flex" >
      <el-col :span="12">
        <nav class="pro-tabs-nav-wrap">
          <a href="javascript:;" class="pro-tabs-nav-item">线上</a>
          <a href="javascript:;" class="pro-tabs-nav-item pro-tabs-nav-item-active">线下</a>
        </nav>
      </el-col>
      <el-col :span="12">
       <div class="extra-wrapper">
          <div class="extra-item-content">
            <a class="extra-item is-active">本周</a>
            <a class="extra-item">本月</a>
            <a class="extra-item">本年</a>
          </div>
          <el-date-picker
            style="width: 256px;"
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>

    <main class="columnar-chart-wrap">
      <div class="columnar-chart-box">
        <header class="columnar-chart-title">各部门Bug对比</header>
        <div id="columnarChart"></div>
      </div>
      <div class="columnar-chart-list-box">
        <header class="columnar-chart-title">质量排名</header>
        <article class="columnar-chart-content">
          <div class="columnar-chart-content-item">
            <span>
              <i class="columnar-chart-content-item-number">1</i>
              用户部门
            </span>
            <span>80.5</span>
          </div>
        </article>
      </div>
    </main>

  
  </el-card>


  <el-row :gutter="20">
    <el-col :span="12">
      <div class="chart-column-wrap">
        <header class="chart-column-title">错误日志</header>
        <main class="chart-column-rose-chart-content">
          <div class="chart-column-rose-nav">
           <el-radio-group>
              <el-radio-button label="广州"></el-radio-button>
              <el-radio-button label="深圳"></el-radio-button>
            </el-radio-group>
          </div>
          <div id="roseBugChart" style="padding: 20px"></div>
        </main>
      </div>
    </el-col>
    <el-col :span="12">
       <div class="chart-column-wrap">
        <header class="chart-column-title">控制报警</header>
        <div id="barBugChart" style="padding: 20px"></div>
      </div>
    </el-col>
  </el-row>

  <el-row class="broken-line-chart-row-wrap">
    <header class="broken-line-chart-row-title">故障分布</header>
    <main id="bugLineChart" style="padding: 20px;"></main>
    <footer class="broken-line-chart-row-footer">
      <a href="javascript:;" class="el-icon-arrow-left"></a>
      <main class="ring-progress-wrap">
        <div class="ring-progress-item">
          <header class="ring-progress-title">监控报警</header>
          <main class="ring-progress-chart">
            <div class="ring-progress-chart-info">
              <aside>故障</aside>
              <aside>90</aside>
            </div>
            <div class="ring-progress-chart-node">
              <el-progress :width="80" type="circle" :percentage="55"></el-progress>
            </div>
          </main>
        </div>
      </main>
      <a href="javascript:;" class="el-icon-arrow-right"></a>
    </footer>
  </el-row>
  
  <el-row :gutter="20">
    <el-col :span="12">
      <div>
        <header>错误日志</header>
        <main id="errorLogColumn"></main>
      </div>
    </el-col>
    <el-col :span="12">
       <div>
        <header>控制报警</header>
        <main id="controlReportColumn"></main>
      </div>
    </el-col>
  </el-row>


   <div class="module-comm-wrap bug-average-repair-time__content"></div>
    <header>
      慢查询统计
    </header>
    <div>
      <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
          <el-radio-button label="top">核心DB</el-radio-button>
          <el-radio-button label="left">非核心DB</el-radio-button>
        </el-radio-group>
        <div></div>
    </div>
    <main id="slowQueryColumn">
        

    </main>
  </div>



  <el-row :gutter="20" style="margin: 20px 10px">
    <el-col :span="12">
      <div class="chart-column-wrap">
        <header class="chart-column-title">执行case数/新增bug数</header>
        <main class="chart-column-rose-chart-content">
          <div id="caseBugColumn"  class="chart-column-render-box"></div>
        </main>
      </div>
    </el-col>
    <el-col :span="12">
       <div class="chart-column-wrap">
        <header class="chart-column-title">新增case统计</header>
        <div id="caseColumn" class="chart-column-render-box"></div>
      </div>
    </el-col>
  </el-row>


  <el-row class="chart-column-wrap" style="margin: 0 20px;">
    <header class="chart-column-title">
      BUG平均修复时长
    </header>
    <main id="repairTimeColumn" style="padding: 20px;"></main>
  </el-row>

</div>
  
</template>
<script>

import { Column, Area, Bar, Pie, Line, TinyColumn } from '@antv/g2plot';
import { Chart } from '@antv/g2';

export default {
  data: () => ({
    value: '',
    value1: '',
    tabPosition: '',
    activeName: ''
  }),

  mounted() {
    this.initSmallCard()
    this.renderArea1()
    this.renderBugBar()
    this.rednerBugLineChart()
    this.renderRoseBugChart()
    this.renderBugColumnChart()
    this.renderErrorLogColumn()
    this.renderControlReportColumn()
    this.renderSlowQueryColumn()
    this.renderCaseBugColumn()
    this.renderCaseColumn()
    this.renderRepairTimeColumn()
  },

  methods: {

    initSmallCard() {

      // 报警&处理次数
      a()
      function a() {

      const data = [
  { name: 'London', 月份: 'Jan.', 月均降雨量: 18.9 },
  { name: 'London', 月份: 'Feb.', 月均降雨量: 28.8 },
  { name: 'London', 月份: 'Mar.', 月均降雨量: 39.3 },
  { name: 'London', 月份: 'Apr.', 月均降雨量: 81.4 },
  { name: 'London', 月份: 'May', 月均降雨量: 47 },
  { name: 'London', 月份: 'Jun.', 月均降雨量: 20.3 },
  { name: 'London', 月份: 'Jul.', 月均降雨量: 24 },
  { name: 'London', 月份: 'Aug.', 月均降雨量: 35.6 },
  { name: 'Berlin', 月份: 'Jan.', 月均降雨量: 12.4 },
  { name: 'Berlin', 月份: 'Feb.', 月均降雨量: 23.2 },
  { name: 'Berlin', 月份: 'Mar.', 月均降雨量: 34.5 },
  { name: 'Berlin', 月份: 'Apr.', 月均降雨量: 99.7 },
  { name: 'Berlin', 月份: 'May', 月均降雨量: 52.6 },
  { name: 'Berlin', 月份: 'Jun.', 月均降雨量: 35.5 },
  { name: 'Berlin', 月份: 'Jul.', 月均降雨量: 37.4 },
  { name: 'Berlin', 月份: 'Aug.', 月均降雨量: 42.4 },
];

        const chart = new Chart({
  container: 'publicAndRollbackNumber',
  autoFit: true,
  height: 30,
});

chart.legend(false);
chart.axis(false)
chart.data(data);


chart
  .interval()
  .position('月份*月均降雨量')
  .color('name')
  .adjust([
    {
      type: 'dodge',
      marginRatio: 5,
    },
  ]);

chart.interaction('active-region');

chart.render();

      }

      // 慢查询核心DB&非核心DB
  b()
      function b() {

      const data = [
  { name: 'London', 月份: 'Jan.', 月均降雨量: 18.9 },
  { name: 'London', 月份: 'Feb.', 月均降雨量: 28.8 },
  { name: 'London', 月份: 'Mar.', 月均降雨量: 39.3 },
  { name: 'London', 月份: 'Apr.', 月均降雨量: 81.4 },
  { name: 'London', 月份: 'May', 月均降雨量: 47 },
  { name: 'London', 月份: 'Jun.', 月均降雨量: 20.3 },
  { name: 'London', 月份: 'Jul.', 月均降雨量: 24 },
  { name: 'London', 月份: 'Aug.', 月均降雨量: 35.6 },
  { name: 'Berlin', 月份: 'Jan.', 月均降雨量: 12.4 },
  { name: 'Berlin', 月份: 'Feb.', 月均降雨量: 23.2 },
  { name: 'Berlin', 月份: 'Mar.', 月均降雨量: 34.5 },
  { name: 'Berlin', 月份: 'Apr.', 月均降雨量: 99.7 },
  { name: 'Berlin', 月份: 'May', 月均降雨量: 52.6 },
  { name: 'Berlin', 月份: 'Jun.', 月均降雨量: 35.5 },
  { name: 'Berlin', 月份: 'Jul.', 月均降雨量: 37.4 },
  { name: 'Berlin', 月份: 'Aug.', 月均降雨量: 42.4 },
];

        const chart = new Chart({
  container: 'slowQueryAndNoCoreDb',
  autoFit: true,
  height: 30,
});

chart.legend(false);
chart.axis(false)
chart.data(data);


chart
  .interval()
  .position('月份*月均降雨量')
  .color('name')
  .adjust([
    {
      type: 'dodge',
      marginRatio: 5,
    },
  ]);

chart.interaction('active-region');

chart.render();

      }

    },

    rednerBugLineChart() {
      fetch('https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json')
  .then((res) => res.json())
  .then((data) => {
    const line = new Line('bugLineChart', {
      data,
      xField: 'year',
      yField: 'value',
      seriesField: 'category',
      xAxis: {
        type: 'time',
      },
      yAxis: {
        label: {
          // 数值格式化为千分位
          formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        },
      },
      legend: {
        position: 'top',
      },
    });

    line.render();
  });
    },
    renderRoseBugChart() {

const data = [
  { type: '分类一', value: 27 },
  { type: '分类二', value: 25 },
  { type: '分类三', value: 18 },
  { type: '分类四', value: 15 },
  { type: '分类五', value: 10 },
  { type: '其他', value: 5 },
];

const piePlot = new Pie('roseBugChart', {
  appendPadding: 10,
  data,
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  innerRadius: 0.6,
  label: {
    type: 'inner',
    offset: '-50%',
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 14,
    },
  },
  interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  statistic: {
    title: false,
    content: {
      style: {
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      formatter: () => 'AntV\nG2Plot',
    },
  },
});

piePlot.render();
    },
    renderBugBar() {

      const data = [
  {
    label: 'Mon.',
    type: 'series1',
    value: 2800,
  },
  {
    label: 'Mon.',
    type: 'series2',
    value: 2260,
  },
  {
    label: 'Tues.',
    type: 'series1',
    value: 1800,
  },
  {
    label: 'Tues.',
    type: 'series2',
    value: 1300,
  },
  {
    label: 'Wed.',
    type: 'series1',
    value: 950,
  },
  {
    label: 'Wed.',
    type: 'series2',
    value: 900,
  },
  {
    label: 'Thur.',
    type: 'series1',
    value: 500,
  },
  {
    label: 'Thur.',
    type: 'series2',
    value: 390,
  },
  {
    label: 'Fri.',
    type: 'series1',
    value: 170,
  },
  {
    label: 'Fri.',
    type: 'series2',
    value: 100,
  },
];

const stackedBarPlot = new Bar('barBugChart', {
  data,
  isGroup: true,
  xField: 'value',
  yField: 'label',
  /** 自定义颜色 */
  // color: ['#1383ab', '#c52125'],
  seriesField: 'type',
  marginRatio: 0,
  label: {
    // 可手动配置 label 数据标签位置
    position: 'middle', // 'left', 'middle', 'right'
    // 可配置附加的布局方法
    layout: [
      // 柱形图数据标签位置自动调整
      { type: 'interval-adjust-position' },
      // 数据标签防遮挡
      { type: 'interval-hide-overlap' },
      // 数据标签文颜色自动调整
      { type: 'adjust-color' },
    ],
  },
});

stackedBarPlot.render();

    },

    renderBugColumnChart() {


      const data = [
        {
          type: '家具家电',
          sales: 38,
        },
        {
          type: '粮油副食',
          sales: 52,
        },
        {
          type: '生鲜水果',
          sales: 61,
        },
        {
          type: '美容洗护',
          sales: 145,
        },
        {
          type: '母婴用品',
          sales: 48,
        },
        {
          type: '进口食品',
          sales: 38,
        },
        {
          type: '食品饮料',
          sales: 38,
        },
        {
          type: '家庭清洁',
          sales: 38,
        },
      ];
      new Column('columnarChart', {
        data,
        xField: 'type',
        yField: 'sales',
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle', // 'top', 'bottom', 'middle',
          // 配置样式
          style: {
            fill: '#FFFFFF',
            opacity: 0.6,
          },
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        meta: {
          type: {
            alias: '类别',
          },
          sales: {
            alias: '销售额',
          },
        },
      }).render();


    },
    renderArea1() {
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/fireworks-sales.json')
  .then(res => res.json())
  .then(data => {
    const chart = new Chart({
      container: 'area1',
      autoFit: true,
      height: 30,
    });
  
    chart.data(data);
    chart.scale('Data', {
      range: [0, 1],
      tickCount: 10,
      type: 'timeCat'
    });

    chart.scale('sales', {
      nice: true,
    });

    chart.axis(false);

    chart.tooltip({
      showCrosshairs: true,
    });

    chart.line().position('Data*sales');
    chart.area().position('Data*sales');
    chart.render();
  });
    },

    renderErrorLogColumn() {
       const data = [
          {
            name: 'London',
            月份: 'Jan.',
            月均降雨量: 18.9,
          },
          {
            name: 'London',
            月份: 'Feb.',
            月均降雨量: 28.8,
          },
          {
            name: 'London',
            月份: 'Mar.',
            月均降雨量: 39.3,
          },
          {
            name: 'London',
            月份: 'Apr.',
            月均降雨量: 81.4,
          },
          {
            name: 'London',
            月份: 'May',
            月均降雨量: 47,
          },
          {
            name: 'London',
            月份: 'Jun.',
            月均降雨量: 20.3,
          },
          {
            name: 'London',
            月份: 'Jul.',
            月均降雨量: 24,
          },
          {
            name: 'London',
            月份: 'Aug.',
            月均降雨量: 35.6,
          },
          {
            name: 'Berlin',
            月份: 'Jan.',
            月均降雨量: 12.4,
          },
          {
            name: 'Berlin',
            月份: 'Feb.',
            月均降雨量: 23.2,
          },
          {
            name: 'Berlin',
            月份: 'Mar.',
            月均降雨量: 34.5,
          },
          {
            name: 'Berlin',
            月份: 'Apr.',
            月均降雨量: 99.7,
          },
          {
            name: 'Berlin',
            月份: 'May',
            月均降雨量: 52.6,
          },
          {
            name: 'Berlin',
            月份: 'Jun.',
            月均降雨量: 35.5,
          },
          {
            name: 'Berlin',
            月份: 'Jul.',
            月均降雨量: 37.4,
          },
          {
            name: 'Berlin',
            月份: 'Aug.',
            月均降雨量: 42.4,
          },
        ];

        const stackedColumnPlot = new Column('errorLogColumn', {
          data,
          isGroup: true,
          xField: '月份',
          yField: '月均降雨量',
          seriesField: 'name',
          /** 设置颜色 */
          //color: ['#1ca9e6', '#f88c24'],
          /** 设置间距 */
          // marginRatio: 0.1,
          label: {
            // 可手动配置 label 数据标签位置
            position: 'middle', // 'top', 'middle', 'bottom'
            // 可配置附加的布局方法
            layout: [
              // 柱形图数据标签位置自动调整
              { type: 'interval-adjust-position' },
              // 数据标签防遮挡
              { type: 'interval-hide-overlap' },
              // 数据标签文颜色自动调整
              { type: 'adjust-color' },
            ],
          },
        }).render();
    },
    renderControlReportColumn() {
       const data = [
          {
            name: 'London',
            月份: 'Jan.',
            月均降雨量: 18.9,
          },
          {
            name: 'London',
            月份: 'Feb.',
            月均降雨量: 28.8,
          },
          {
            name: 'London',
            月份: 'Mar.',
            月均降雨量: 39.3,
          },
          {
            name: 'London',
            月份: 'Apr.',
            月均降雨量: 81.4,
          },
          {
            name: 'London',
            月份: 'May',
            月均降雨量: 47,
          },
          {
            name: 'London',
            月份: 'Jun.',
            月均降雨量: 20.3,
          },
          {
            name: 'London',
            月份: 'Jul.',
            月均降雨量: 24,
          },
          {
            name: 'London',
            月份: 'Aug.',
            月均降雨量: 35.6,
          },
          {
            name: 'Berlin',
            月份: 'Jan.',
            月均降雨量: 12.4,
          },
          {
            name: 'Berlin',
            月份: 'Feb.',
            月均降雨量: 23.2,
          },
          {
            name: 'Berlin',
            月份: 'Mar.',
            月均降雨量: 34.5,
          },
          {
            name: 'Berlin',
            月份: 'Apr.',
            月均降雨量: 99.7,
          },
          {
            name: 'Berlin',
            月份: 'May',
            月均降雨量: 52.6,
          },
          {
            name: 'Berlin',
            月份: 'Jun.',
            月均降雨量: 35.5,
          },
          {
            name: 'Berlin',
            月份: 'Jul.',
            月均降雨量: 37.4,
          },
          {
            name: 'Berlin',
            月份: 'Aug.',
            月均降雨量: 42.4,
          },
        ];

        const stackedColumnPlot = new Column('controlReportColumn', {
          data,
          isGroup: true,
          xField: '月份',
          yField: '月均降雨量',
          seriesField: 'name',
          /** 设置颜色 */
          //color: ['#1ca9e6', '#f88c24'],
          /** 设置间距 */
          // marginRatio: 0.1,
          label: {
            // 可手动配置 label 数据标签位置
            position: 'middle', // 'top', 'middle', 'bottom'
            // 可配置附加的布局方法
            layout: [
              // 柱形图数据标签位置自动调整
              { type: 'interval-adjust-position' },
              // 数据标签防遮挡
              { type: 'interval-hide-overlap' },
              // 数据标签文颜色自动调整
              { type: 'adjust-color' },
            ],
          },
        }).render();
    },
    renderSlowQueryColumn() {
       const data = [
          {
            name: 'London',
            月份: 'Jan.',
            月均降雨量: 18.9,
          },
          {
            name: 'London',
            月份: 'Feb.',
            月均降雨量: 28.8,
          },
          {
            name: 'London',
            月份: 'Mar.',
            月均降雨量: 39.3,
          },
          {
            name: 'London',
            月份: 'Apr.',
            月均降雨量: 81.4,
          },
          {
            name: 'London',
            月份: 'May',
            月均降雨量: 47,
          },
          {
            name: 'London',
            月份: 'Jun.',
            月均降雨量: 20.3,
          },
          {
            name: 'London',
            月份: 'Jul.',
            月均降雨量: 24,
          },
          {
            name: 'London',
            月份: 'Aug.',
            月均降雨量: 35.6,
          },
          {
            name: 'Berlin',
            月份: 'Jan.',
            月均降雨量: 12.4,
          },
          {
            name: 'Berlin',
            月份: 'Feb.',
            月均降雨量: 23.2,
          },
          {
            name: 'Berlin',
            月份: 'Mar.',
            月均降雨量: 34.5,
          },
          {
            name: 'Berlin',
            月份: 'Apr.',
            月均降雨量: 99.7,
          },
          {
            name: 'Berlin',
            月份: 'May',
            月均降雨量: 52.6,
          },
          {
            name: 'Berlin',
            月份: 'Jun.',
            月均降雨量: 35.5,
          },
          {
            name: 'Berlin',
            月份: 'Jul.',
            月均降雨量: 37.4,
          },
          {
            name: 'Berlin',
            月份: 'Aug.',
            月均降雨量: 42.4,
          },
        ];

        const stackedColumnPlot = new Column('slowQueryColumn', {
          data,
          isGroup: true,
          xField: '月份',
          yField: '月均降雨量',
          seriesField: 'name',
          /** 设置颜色 */
          //color: ['#1ca9e6', '#f88c24'],
          /** 设置间距 */
          // marginRatio: 0.1,
          label: {
            // 可手动配置 label 数据标签位置
            position: 'middle', // 'top', 'middle', 'bottom'
            // 可配置附加的布局方法
            layout: [
              // 柱形图数据标签位置自动调整
              { type: 'interval-adjust-position' },
              // 数据标签防遮挡
              { type: 'interval-hide-overlap' },
              // 数据标签文颜色自动调整
              { type: 'adjust-color' },
            ],
          },
        }).render();
    },
    renderCaseBugColumn(){

        const data = [
          {
            name: 'London',
            月份: 'Jan.',
            月均降雨量: 18.9,
          },
          {
            name: 'London',
            月份: 'Feb.',
            月均降雨量: 28.8,
          },
          {
            name: 'London',
            月份: 'Mar.',
            月均降雨量: 39.3,
          },
          {
            name: 'London',
            月份: 'Apr.',
            月均降雨量: 81.4,
          },
          {
            name: 'London',
            月份: 'May',
            月均降雨量: 47,
          },
          {
            name: 'London',
            月份: 'Jun.',
            月均降雨量: 20.3,
          },
          {
            name: 'London',
            月份: 'Jul.',
            月均降雨量: 24,
          },
          {
            name: 'London',
            月份: 'Aug.',
            月均降雨量: 35.6,
          },
          {
            name: 'Berlin',
            月份: 'Jan.',
            月均降雨量: 12.4,
          },
          {
            name: 'Berlin',
            月份: 'Feb.',
            月均降雨量: 23.2,
          },
          {
            name: 'Berlin',
            月份: 'Mar.',
            月均降雨量: 34.5,
          },
          {
            name: 'Berlin',
            月份: 'Apr.',
            月均降雨量: 99.7,
          },
          {
            name: 'Berlin',
            月份: 'May',
            月均降雨量: 52.6,
          },
          {
            name: 'Berlin',
            月份: 'Jun.',
            月均降雨量: 35.5,
          },
          {
            name: 'Berlin',
            月份: 'Jul.',
            月均降雨量: 37.4,
          },
          {
            name: 'Berlin',
            月份: 'Aug.',
            月均降雨量: 42.4,
          },
        ];

        const stackedColumnPlot = new Column('caseBugColumn', {
          data,
          isGroup: true,
          xField: '月份',
          yField: '月均降雨量',
          seriesField: 'name',
          /** 设置颜色 */
          //color: ['#1ca9e6', '#f88c24'],
          /** 设置间距 */
          // marginRatio: 0.1,
          label: {
            // 可手动配置 label 数据标签位置
            position: 'middle', // 'top', 'middle', 'bottom'
            // 可配置附加的布局方法
            layout: [
              // 柱形图数据标签位置自动调整
              { type: 'interval-adjust-position' },
              // 数据标签防遮挡
              { type: 'interval-hide-overlap' },
              // 数据标签文颜色自动调整
              { type: 'adjust-color' },
            ],
          },
        }).render();

    },
    renderCaseColumn() {
       const data = [
        {
          type: '家具家电',
          sales: 38,
        },
        {
          type: '粮油副食',
          sales: 52,
        },
        {
          type: '生鲜水果',
          sales: 61,
        },
        {
          type: '美容洗护',
          sales: 145,
        },
        {
          type: '母婴用品',
          sales: 48,
        },
        {
          type: '进口食品',
          sales: 38,
        },
        {
          type: '食品饮料',
          sales: 38,
        },
        {
          type: '家庭清洁',
          sales: 38,
        },
      ];

      new Column('caseColumn', {
        data,
        xField: 'type',
        yField: 'sales',
        label: {
          position: 'middle', // 'top', 'bottom', 'middle',
          style: {
            fill: '#FFFFFF',
            opacity: 0.6,
          },
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        meta: {
          type: {
            alias: '类别',
          },
          sales: {
            alias: '销售额',
          },
        },
      }).render();
    },

    renderRepairTimeColumn() {
      
      const data = [
        {
          type: '家具家电',
          sales: 38,
        },
        {
          type: '粮油副食',
          sales: 52,
        },
        {
          type: '生鲜水果',
          sales: 61,
        },
        {
          type: '美容洗护',
          sales: 145,
        },
        {
          type: '母婴用品',
          sales: 48,
        },
        {
          type: '进口食品',
          sales: 38,
        },
        {
          type: '食品饮料',
          sales: 38,
        },
        {
          type: '家庭清洁',
          sales: 38,
        },
      ];

      new Column('repairTimeColumn', {
        data,
        xField: 'type',
        yField: 'sales',
        label: {
          position: 'middle', // 'top', 'bottom', 'middle',
          style: {
            fill: '#FFFFFF',
            opacity: 0.6,
          },
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        meta: {
          type: {
            alias: '类别',
          },
          sales: {
            alias: '销售额',
          },
        },
      }).render();

    }
  }
}
</script>