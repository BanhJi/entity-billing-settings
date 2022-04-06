'use strict'

const AWS = require('aws-sdk')
const code = require('../config/code.js')
const message = require('../config/message.js')
const json = require('../config/response.js')
const config  = require('../config/config.js')
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: config.region})

module.exports.get = async (event, context) => {
  const table = process.env.setting_table
  const instituteId = event.pathParameters.institute_id
  const params = {
    TableName: table,
    IndexName: 'GSI1',
    KeyConditionExpression: 'sk = :sk AND begins_with(pk, :pk)',
    ExpressionAttributeValues: {
      ':sk': instituteId,
      ':pk': 'ctl-'
    },
  }
  try {
    const data = await dynamoDb.query(params).promise()
    const results = data.Items.map(item => {
      return {
        id:             item.pk,
        name:           item.name,
        code:           item.code,
      }
    })
    return {
      statusCode: code.httpStatus.OK,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // to allow cross origin access
      },
      body: json.responseBody(code.httpStatus.OK, results, message.msg.FetchSuccessed, '', 1)
    }
  } catch (error) {
    console.log(2, error)
    return {
      statusCode: code.httpStatus.Created,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // to allow cross origin access
      },
      body: json.responseBody(code.httpStatus.BadRequest, [], message.msg.FetchFailed, error, 0)
    }
  }
}
