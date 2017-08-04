/**
 * Created by ayou on 2017/8/4.
 */
var WebSocket = require('ws')
var Tools = require('./tools')
var Clients = {}
var n = 0

const wss = new WebSocket.Server({ port: 8000})

wss.on('connection', function (ws) {
  n++
  Clients[Tools.randomStr(6)] = ws
  Tools.broadcast(wss, '当前人数: ' + n, WebSocket)

  ws.on('message', function incoming(data) {
    console.log(data)
  });
})