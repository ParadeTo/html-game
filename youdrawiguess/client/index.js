/**
 * Created by ayou on 2017/8/4.
 */

var wsGame = {
  isDrawing: false,
  startX: 0,
  startY: 0,
  LINE_SEGMENT: 0,
  CHAT_MESSAGE: 1,
  GAME_LOGIC: 2,
  WAITING_TO_START: 0,
  GAME_START: 1,
  GAME_OVER: 2,
  GAME_RESTART: 3,
  isTurnToDraw: false // 当前是否是我绘画
}

function drawLine(ctx, x1, y1, x2, y2, thickness) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineWidth = thickness
  ctx.strokeStyle = "#444"
  ctx.stroke()
}

$(function () {
  var $canvas = $('#drawingPad')
  var $chatList = $('#chatList')
  var $msg = $('#msg')
  var $sendBtn = $('#sendBtn')
  var $restartBtn = $('#restartBtn')
  var canvas = document.getElementById("drawingPad")
  var ctx = canvas.getContext('2d')

  $canvas.on('mousedown', function (e) {
    wsGame.startX = e.offsetX
    wsGame.startY = e.offsetY
    wsGame.isDrawing = true
  })

  $canvas.on('mousemove', function (e) {
    if (wsGame.isDrawing) {
      var mouseX = e.offsetX
      var mouseY = e.offsetY
      if (!(mouseX === wsGame.startX &&
            mouseY === wsGame.startY)) {
        drawLine(ctx, wsGame.startX, wsGame.startY, mouseX, mouseY, 1)

        var data = {}
        data.dataType = wsGame.LINE_SEGMENT
        data.startX = wsGame.startX
        data.startY = wsGame.startY
        data.endX = mouseX
        data.endY = mouseY
        wsGame.socket.send(JSON.stringify(data))

        wsGame.startX = mouseX
        wsGame.startY = mouseY
      }
    }
  })

  $canvas.on('mouseup', function (e) {
    wsGame.isDrawing = false
  })


  if (window.WebSocket) {
    wsGame.socket = new WebSocket("ws://localhost:8000")

    wsGame.socket.onopen = function (e) {
      console.log('open')
    }

    wsGame.socket.onmessage = function (e) {
      var data = JSON.parse(e.data)
      if (data.dataType === wsGame.CHAT_MESSAGE) {
        $chatList.append("<li>" + data.sender + ": " + data.message + "</li>")
      } else if (data.dataType === wsGame.LINE_SEGMENT) {
        drawLine(ctx, data.startX, data.startY, data.endX, data.endY, 1)
      } else if (data.dataType === wsGame.GAME_LOGIC) {
        if (data.gameState === wsGame.GAME_OVER) {
          wsGame.isTurnToDraw = false
          $chatList.append("<li>" + data.winner +
            " wins! 答案是: " + data.answer + "</li>")
          $restartBtn.show()
        }

        if (data.gameState === wsGame.GAME_START) {
          // 清除
          canvas.width = canvas.width

          $restartBtn.hide()
          $chatList.html('')

          if (data.isPlayerTurn) {
            wsGame.isTurnToDraw = true
            $chatList.append('<li>轮到你画了</li>')
          } else {
            $chatList.append('<li>游戏开始</li>')
          }
        }
      }
    }

    wsGame.socket.onclose = function (e) {
      console.log('close')
    }

    $sendBtn.on('click', function () {
      var data = {
        dataType: wsGame.CHAT_MESSAGE,
        message: $msg.val()
      }
      wsGame.socket.send(JSON.stringify(data))
      $msg.val('')
    })
  }
})