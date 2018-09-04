'use strict'


const getFormFields = require('../../../lib/get-form-fields')
const c3 = require('c3')
const moment = require('moment')

const updateParticipantGraph = function (event) {
  event.preventDefault()
  loadParticipantsGraph()
}

let projectedTotal

const loadParticipantsGraph = function () {
  const graphSubject = $("input[name='graphSubject']:checked").val()
  $('#graphTitle').text(graphSubject)
  let filename = ''
  let todayText = ''
  if (graphSubject === 'Donations') {
    $('#lblProjected').text('Projected total $')
    $('#lblActual').text('Current total $')
    filename = 'raised' + $('#locationName').val() + '.json'
    projectedTotal = $('#projectedDonTotal').val()
    todayText = ' raised so far'
    $('#projectedDonTotal').show()
    $('#projectedRegTotal').hide()
  } else {
    $('#lblProjected').text('Projected total participants')
    $('#lblActual').text('Current total')
    filename = $('#locationName').val() + '.json'
    projectedTotal = $('#projectedRegTotal').val()
    todayText = ' registered so far'
    $('#projectedRegTotal').show()
    $('#projectedDonTotal').hide()
  }

  // set today as the default starting day if none is specified
  if ($('#dateStart').val() === '') {
    $('#dateStart').val(moment().format('M/D/YYYY'))
  }

  const location = $('#locationName').val()
  const eventDate = moment($('#eventDate').val())
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
  let mDateFormat = ''
  if (interval === 'day') {
    mDateFormat = 'D'
  } else if (interval === 'week') {
    mDateFormat = 'W'
  } else {
    mDateFormat = 'M'
  }

  let objRef = ''
  let objRefEnd = ''
  let daysAway = eventDate.diff(dateStart, 'days')
  let oldValue = ''

  while (dateEnd > dateStart || dateStart.format(mDateFormat) === dateEnd.format(mDateFormat)) {

    dates.push(moment(dateStart))

    daysAway = eventDate.diff(dateStart, 'days')
    if (daysAway < -1) {
      daysAway = -1
    }
    if (location === 'National') {
      objRef = moment(dateStart).format('M/D/YYYY')
    } else {
      objRef = daysAway
    }
    //  console.log('objRef', objRef)

    if (data[objRef]) {
      oldValue = objRef
      proj.push(((data[objRef].avg.perc / 100) * projectedTotal).toFixed(0))
      y2018.push((data[objRef][2018].cumu).toFixed(0))
      y2017.push((data[objRef][2017].cumu).toFixed(0))
      y2016.push((data[objRef][2016].cumu).toFixed(0))
      y2015.push((data[objRef][2015].cumu).toFixed(0))
    } else {
    //  console.log('oldValue should be', oldValue)
      proj.push(((data[oldValue].avg.perc / 100) * projectedTotal).toFixed(0))
      y2018.push((data[oldValue][2018].cumu).toFixed(0))
      y2017.push((data[oldValue][2017].cumu).toFixed(0))
      y2016.push((data[oldValue][2016].cumu).toFixed(0))
      y2015.push((data[oldValue][2015].cumu).toFixed(0))
    }

    dateStart.add(1, interval)

  }

if (moment(oldValue) < moment(dateEnd)) {

    let endDay = eventDate.diff(dateEnd, 'days')
    if (location === 'National') {
      objRefEnd = moment(dateEnd).format('M/D/YYYY')
    } else {
      objRefEnd = endDay
    }
    dates.push(moment(dateEnd))
    if (data[objRefEnd]) {
    proj.push(((data[objRefEnd].avg.perc / 100) * projectedTotal).toFixed(0))
    y2018.push((data[objRefEnd][2018].cumu).toFixed(0))
    y2017.push((data[objRefEnd][2017].cumu).toFixed(0))
    y2016.push((data[objRefEnd][2016].cumu).toFixed(0))
    y2015.push((data[objRefEnd][2015].cumu).toFixed(0))
    }
}

// *************
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
        lines: [{front: false, value: actualTotal, class: 'gridtoday', text: actualTotal + todayText}]
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
