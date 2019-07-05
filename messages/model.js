const Sequelize = require('sequelize')
const db = require('../db.js')

const Message = db.define(
  'message',
  {
    message: {
      type: Sequelize.STRING
    }
  }, {
    timeStamps: true,
    tableName: 'messages'
  }
)

module.exports = Message