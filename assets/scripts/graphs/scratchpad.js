'use strict'

const data = require('../../json/national.json')
const c3 = require('c3')
const moment = require('moment')

const pageLoadEvents = () => {
  console.log('data is', data[370])
}

const proj = ['Projected']
const dates = ['x']

const today = moment(new Date())
// const eventDate = moment(new Date('2/14/2019'))
// const firstDate = moment(eventDate).subtract(370, 'days')
// const daysToShow = today.diff(firstDate, 'days')

for (let i = 365; i > 0; i--) {
  proj.push(data[i].avg.perc)
  console.log(i, data[i])
  dates.push(moment(eventDate).subtract(i, 'days'))
}

// $('#showstuff').text(daysToShow)

const chart = c3.generate({
  bindto: '#chart',
  data: {
    x: 'x',
    xFormat: '%Y%m%d',
    columns: [
      dates,
      // ['sample', 30, 200, 100, 400, 150, 250],
      proj
    ]
  },
  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: '%m/%d' // https://github.com/mbostock/d3/wiki/Time-Formatting#wiki-format
      }
    }
  }
})


module.exports = {
  pageLoadEvents,
  chart
}
