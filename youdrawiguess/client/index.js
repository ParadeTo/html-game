/**
 * Created by ayou on 2017/8/4.
 */

var wsGame = {}

$(function () {
  if (window.WebSocket) {
    wsGame.socket = new WebSocket("ws://localhost:8000")

    wsGame.socket.onopen = function (e) {
      console.log('open')
      wsGame.socket.send('ayou')
    }

    wsGame.socket.onmessage = function (e) {
      console.log(e.data)
    }

    wsGame.socket.onclose = function (e) {
      console.log('close')
    }


  }
})