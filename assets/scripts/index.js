'use strict'
const participants = require('./graphs/participants')
// const donations = require('./graphs/donations')

$(() => {
  // your JS code goes here
  participants.addHandlers()
  participants.loadParticipantsGraph()
//  donations.addHandlers()
//  donations.loadDonationsGraph()

// set some default variables on pageLoadEvents
  // const graphSubject = $("input[name='graphSubject']:checked").val()
  // if (graphSubject === 'Donations') {
  //   if ($('#projectedTotal').val() === '0') {
  //     $('#projectedTotal').val(2207000)
  //   }
  // } else {
  //   if ($('#projectedTotal').val() === '0') {
  //     $('#projectedTotal').val(14026)
  //   }
  // }
  // if ($('#dateStart').val() === '') {
  //   $('#dateStart').val(moment().format('M/D/YYYY'))
  // }

})
