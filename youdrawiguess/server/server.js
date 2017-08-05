/**
 * Created by ayou on 2017/8/4.
 */
var WebSocket = require('ws')
var Tools = require('./tools')
var Clients = {}
var n = 0

var LINE_SEGMENT = 0,
    CHAT_MESSAGE = 1,
    GAME_LOGIC = 2,
    WAITING_TO_START = 0,
    GAME_START = 1,
    GAME_OVER = 2,
    GAME_RESTART = 3,
    playerTurn = '' // 当前绘制的玩家名

var wordsList = ['苹果', '猪', '戒指', '杯子']

const wss = new WebSocket.Server({ port: 8000})

wss.on('connection', function (ws) {
  n++
  var name
  do {
    name = Tools.randomStr(6)
  } while (Clients[name])
  ws.name = name
  Clients[name] = ws

  var welcomeMsg = "欢迎 " + name + " 加入。当前人数: " + n
  var data = {
    dataType: CHAT_MESSAGE,
    sender: "Server",
    message: welcomeMsg
  }
  Tools.broadcast(wss, JSON.stringify(data))

  ws.on('message', function incoming(msg) {
    var data = JSON.parse(msg)
    if (data.dataType === CHAT_MESSAGE) {
      data.sender = ws.name
    }
    Tools.broadcast(wss, JSON.stringify(data))
  });
})