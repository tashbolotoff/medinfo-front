<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12">
      <highcharts :constructor-type="'stockChart'" :options="chartOptions"></highcharts>
    </div>
    <div class="col-span-12 mt-4">
      <highcharts :constructor-type="'chart'" :options="chartOptions2"></highcharts>
    </div>
    <div class="col-span-12 mt-4">
      <highcharts :constructor-type="'chart'" :options="chartOptions3"></highcharts>
    </div>
  </div>

</template>

<script>
import {Chart} from 'highcharts-vue'
import store from '@/store'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import exportingInit from 'highcharts/modules/exporting'
import offlineExporting from 'highcharts/modules/offline-exporting'

exportingInit(Highcharts)
offlineExporting(Highcharts)
stockInit(Highcharts)
export default {
  components: {
    highcharts: Chart
  },
  data() {
    return {
      values: [],
      chartOptions: {
        chart: {
          zoomType: 'x',
          connectNulls: false
        },
        title: {
          text: 'Вывод количества запросов по категориям в день'
        },
        subtitle: {
          text: document.ontouchstart === undefined ? 'Щелкните и перетащите область графика, чтобы увеличить' : 'Зажмите диаграмму, чтобы увеличить'
        },
        legend: {
          enabled: true
        },
        xAxis: {
          type: 'datetime',
          ordinal: false
        },
        yAxis: {
          allowDecimals: false,
          title: {
            text: 'Кол-во случаев'
          }
        },
        lang: {
          months: [
            'Январь', 'Февраль', 'Март', 'Апрель',
            'Май', 'Июнь', 'Июль', 'Август',
            'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
          ],
          shortMonths: [
            'Янв', 'Фев', 'Март', 'Апр',
            'Май', 'Июнь', 'Июль', 'Авг',
            'Сен', 'Окт', 'Нояб', 'Дек'],
          weekdays: [
            'Воскресенье', 'Понедельник', 'Вторник', 'Четверг', 'Пятница', 'Friday', 'Saturday'
          ]
        },
        series: []
      },
      chartOptions2: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Сравнительный дашборд по количеству отправленных пуш уведомлений/кликнутых'
        },
        xAxis: {
          categories: [
            'Беременные женщины',
            'Дети до 18 лет',
            'ЛОВЗ',
            'Лица пожилого возраста'
          ],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Кол-во'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Отправленные',
          data: [263, 190, 106, 129]

        }, {
          name: 'Просмотренные',
          data: [83, 78, 20, 93]

        }]
      },
      chartOptions3: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Круговая диаграмма с процентным соотношением количества людей по категориям',
          align: 'center'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: 'Категория',
          colorByPoint: true,
          data: [{
            name: 'Беременные женщины',
            y: 70.67,
            sliced: true,
            selected: true
          }, {
            name: 'Дети до 18 лет',
            y: 4.86
          }, {
            name: 'ЛОВЗ',
            y: 2.63
          }, {
            name: 'Лица пожилого возраста',
            y: 1.53
          }]
        }]
      }
    }
  },
  mounted() {
    this.chartOptions.series.push({
        type: 'spline',
        name: 'Беременные женщины',
        data: [2, 34, 54, 65, 2, 21, 3, 45, 35, 1]
      },
      {
        type: 'spline',
        name: 'Дети до 18 лет',
        data: [23, 54, 14, 45, 22, 31, 5, 35, 45, 12]
      },
      {
        type: 'spline',
        name: 'ЛОВЗ',
        data: [2, 99, 24, 43, 2, 71, 3, 25, 25, 2]
      },
      {
        type: 'spline',
        name: 'Лица пожилого возраста',
        data: [7, 6, 56, 2, 22, 23, 8, 5, 21, 3]
      })
  }
}
</script>

<style scoped>

</style>
