'use strict'


const getFormFields = require('../../../lib/get-form-fields')
const c3 = require('c3')
const moment = require('moment')

const updateParticipantGraph = function (event) {
  event.preventDefault()
  loadParticipantsGraph()
}

const loadParticipantsGraph = function () {
  const graphSubject = $("input[name='graphSubject']:checked").val()
  $('#graphTitle').text(graphSubject)
  let filename = ''
  if (graphSubject === 'Donations') {
    $('#lblProjected').text('Projected total $')
    $('#lblActual').text('Current total $')

    $('#projectedTotal').val(2207000)

    filename = 'raised' + $('#locationName').val() + '.json'
  } else {
    $('#lblProjected').text('Projected total participants')
    $('#lblActual').text('Current total')

    $('#projectedTotal').val(14026)

    filename = $('#locationName').val() + '.json'
  }
  const eventDate = moment($('#eventDate').val())
  const projectedTotal = $('#projectedTotal').val()
  const actualTotal = $('#actualTotal').val()
  const dateStart = moment($('#dateStart').val())
  const dateEnd = moment($('#dateEnd').val())

  const interval = $('#interval').val()
  const data = require('../../json/' + filename)
  // const data = require('../../json/Atlanta.json')

  // Set up arrays for chart
  const proj = ['Projected']
  const y2018 = ['2018']
  const y2017 = ['2017']
  const y2016 = ['2016']
  const y2015 = ['2015']
  const dates = ['x1']
  const actual = ['Actual', actualTotal]

  let today = moment().format('M/D/YYYY')
  console.log('today', today)
  // today = moment(today, 'MM-DD-YYYY')
  let daysAway = eventDate.diff(dateStart, 'days')

  if (interval === 'day') {
    while (dateEnd > dateStart || dateStart.format('D') === dateEnd.format('D')) {
      daysAway = eventDate.diff(dateStart, 'days')
      dates.push(moment(dateStart))
      dateStart.add(1, 'day')
      proj.push(((data[daysAway].avg.perc / 100) * projectedTotal).toFixed(0))
      y2018.push(((data[daysAway][2018].perc / 100) * projectedTotal).toFixed(0))
      y2017.push(((data[daysAway][2017].perc / 100) * projectedTotal).toFixed(0))
      y2016.push(((data[daysAway][2016].perc / 100) * projectedTotal).toFixed(0))
      y2015.push(((data[daysAway][2015].perc / 100) * projectedTotal).toFixed(0))
    }
  } else if (interval === 'week') {
    while (dateEnd > dateStart || dateStart.format('W') === dateEnd.format('W')) {
      daysAway = eventDate.diff(dateStart, 'days')
      dates.push(moment(dateStart))
      dateStart.add(1, 'week')
      proj.push(((data[daysAway].avg.perc / 100) * projectedTotal).toFixed(0))
      y2018.push(((data[daysAway][2018].perc / 100) * projectedTotal).toFixed(0))
      y2017.push(((data[daysAway][2017].perc / 100) * projectedTotal).toFixed(0))
      y2016.push(((data[daysAway][2016].perc / 100) * projectedTotal).toFixed(0))
      y2015.push(((data[daysAway][2015].perc / 100) * projectedTotal).toFixed(0))
    }
  } else {
    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      daysAway = eventDate.diff(dateStart, 'days')
      // console.log('perc', data[daysAway].avg.perc)
      dates.push(moment(dateStart))
      dateStart.add(1, 'month')
      proj.push(((data[daysAway].avg.perc / 100) * projectedTotal).toFixed(0))
      y2018.push(((data[daysAway][2018].perc / 100) * projectedTotal).toFixed(0))
      y2017.push(((data[daysAway][2017].perc / 100) * projectedTotal).toFixed(0))
      y2016.push(((data[daysAway][2016].perc / 100) * projectedTotal).toFixed(0))
      y2015.push(((data[daysAway][2015].perc / 100) * projectedTotal).toFixed(0))
    }
  }
  // console.log('proj', proj)
  // console.log('days away', daysAway)
  // for (let i = showDays; i > -1; i - interval) {
  //   proj.push(((data[i].avg.perc / 100) * projectedTotal).toFixed(0))
  //   // console.log(i, data[i])
  //   dates.push(moment(eventDate).subtract(i, 'days'))
  // }

  // $('#showstuff').text(daysToShow)

  const chart = c3.generate({
    bindto: '#chart',
    data: {
      xs: {
        '2015': 'x1',
        '2016': 'x1',
        '2017': 'x1',
        '2018': 'x1',
        'Projected': 'x1',
        'Actual': 'x2'
      },
      xFormat: '%m/%d',
      columns: [
        dates,
        y2015,
        y2016,
        y2017,
        y2018,
        proj,
        ['x2', moment(today)],
        actual
      ],
      colors: {
        Projected: '#4285c9',
        Actual: '#EC2C36',
        2018: '#cbcbcb',
        2017: '#dcdcdc',
        2016: '#dddddd',
        2015: '#efefef'
      }
    },
    axis: {
      x: {
        type: 'timeseries'
      }
    },
    point: {
      r: function (d) {
        return d.id === 'Actual' ? 6 : 2.5
      }
    },
    grid: {
      y: {
        lines: [{front: false, value: actualTotal, class: 'gridtoday', text: actualTotal + ' registered so far'}]
      }
    }

  })

  // chart()
}

const addHandlers = () => {
  $('#data-input').on('submit', updateParticipantGraph)
  $('#locationName').on('change', loadParticipantsGraph)
  $('#interval').on('change', loadParticipantsGraph)
  $('#graphSubjectToggle').on('change', loadParticipantsGraph)
}

module.exports = {
  addHandlers,
  loadParticipantsGraph
}
