'use strict'

const AWS = require('aws-sdk')
const code = require('../config/code.js')
const message = require('../config/message.js')
const json = require('../config/response.js')
const uuid = require('uuid')
const config  = require('../config/config.js')
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: config.region})

module.exports.index = async (event) => {
  const timestamp = new Date().toJSON()
  const data = JSON.parse(event.body)
  const table = process.env.setting_table
  const instituteId = event.pathParameters.institute_id
  let head = 'sub-' // payroll bank
  console.log(data)
  if (data.id === undefined || data.id === '') {
    head = 'sub-' + uuid.v1()
  } else {
    head = data.id
  }
  const pk = head
  const params = {
    TableName: table,
      Item: {
        pk:         pk,
        sk:         instituteId,
        name:       data.name || "",
        code:       data.code || "",
        type:       data.type || "",
        parentId:   data.parentId || "",
        parentCode: data.parentCode || "",
        parentName: data.parentName || "",
        gsisk:      'location#'+data.parentCode,
        createdAt:  timestamp,
        updatedAt:  timestamp
      }
  };
  //  todo: write to the database
  try {
    await dynamoDb
      .put( params)
      .promise()
    // response back
    const response = {
      id:         pk,
      name:       data.name || "",
      code:       data.code || "",
      tyep:       data.tyep || "",
      parentId:   data.parentId || "",
      parentCode: data.parentCode || "",
      parentName: data.parentName || "",
    }

    return {
      statusCode: code.httpStatus.Created,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // to allow cross origin access
      },
      body: json.responseBody(code.httpStatus.Created, response, message.msg.ItemCreatedSuccessed, '', 1)
    }
  } catch (err) {
    return {
      statusCode: code.httpStatus.BadRequest,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // to allow cross origin access
      },
      body: json.responseBody(code.httpStatus.BadRequest, [], message.msg.ItemCreatedFailed, err, 0)
    }
  }
}
