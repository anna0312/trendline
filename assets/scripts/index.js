'use strict'
const participants = require('./graphs/participants')
// const donations = require('./graphs/donations')

$(() => {
  // your JS code goes here
  participants.loadParticipantsGraph()
  participants.addHandlers()
})
