/**
 * Created by ayou on 2017/8/4.
 */

exports.randomStr = function (len) {
  len = len || 6
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var maxPos = $chars.length
  var ret = ''
  for (let i = 0; i < len; i++) {
    ret += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return ret
}

exports.broadcast = function (wss, data, WebSocket) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}