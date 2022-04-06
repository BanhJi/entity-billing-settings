'use strict'
const AWS = require('aws-sdk')
let options = {}
  options = {
    region: 'local',
    endpoint: 'http://localhost:8000',
    accessKeyId: "z3gfms",
    secretAccessKey: "nliit"
  }
const client = new AWS.DynamoDB.DocumentClient(options)
module.exports = client