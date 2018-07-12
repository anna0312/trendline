'use strict'
const graphs = require('./graphs/participants')

$(() => {
  // your JS code goes here
  graphs.addHandlers(),
  graphs.loadParticipantsGraph()
})
