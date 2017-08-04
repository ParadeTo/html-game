/**
 * Created by ayou on 2017/8/3.
 */
var pingpong = {}
pingpong.pressedKeys = []
pingpong.ball = {
  speed: 3,
  x: 200,
  y: 100,
  directionX: 1,
  directionY: 1
}
pingpong.score= {
  scoreA: 0,
  scoreB: 0
}


var KEY = {
  UP: 38,
  DOWN: 40,
  W: 87,
  S: 83
}


$(function () {
  var $right = $('#paddleB')
  var $left = $('#paddleA')
  var $playground = $('#playground')
  var playgroundHeight = parseInt($playground.height())
  var playgroundWidth = parseInt($playground.width())
  var $ball = $('#ball')
  var ballDiameter = parseInt($ball.width())
  var $scoreA = $('#scoreA')
  var $scoreB = $('#scoreB')

  // 每30秒调用一次gameloop
  pingpong.timer = setInterval(gameloop, 30)

  function gameloop() {
    moveBall()
    movePaddles()
  }

  function resetBall() {
    var ball = pingpong.ball
    ball.x = 200
    ball.y = 100
    $ball.css({
      "left": ball.x,
      "top": ball.y
    })
  }

  function moveBall() {
    var ball = pingpong.ball

    // 球拍
    var paddleAX = parseInt($left.css('left')) + parseInt($left.css('width'))
    var paddleAYBottom = parseInt($left.css('top')) + parseInt($left.css('height'))
    var paddleAYTop = parseInt($left.css('top'))
    if (ball.x + ball.speed*ball.directionX < paddleAX) {
      if (ball.y + ballDiameter + ball.speed*ball.directionY <= paddleAYBottom &&
        ball.y + ball.speed*ball.directionY >= paddleAYTop) {
        ball.directionX = 1
      } else {
        pingpong.score.scoreB++
        $scoreB.html(pingpong.score.scoreB)
        resetBall()
      }
    }

    var paddleBX = parseInt($right.css('left'))
    var paddleBYBottom = parseInt($right.css('top')) + parseInt($right.css('height'))
    var paddleBYTop = parseInt($right.css('top'))
    if (ball.x + ballDiameter + ball.speed*ball.directionX >= paddleBX) {
      if (ball.y + ballDiameter + ball.speed*ball.directionY <= paddleBYBottom &&
        ball.y + ball.speed*ball.directionY >= paddleBYTop) {
        console.log(pingpong.ball)
        ball.directionX = -1
      } else {
        pingpong.score.scoreA++
        $scoreA.html(pingpong.score.scoreA)
        resetBall()
      }
    }

    // 边界
    if (ball.y + ballDiameter + ball.speed*ball.directionY > playgroundHeight) {
      ball.directionY = -1
    }
    if (ball.y + ball.speed*ball.directionY < 0) {
      // 玩家A丢分
      ball.directionY = 1
    }
    // if (ball.x + ballDiameter + ball.speed*ball.directionX > playgroundWidth) {
    //   console.log(pingpong.ball)
    //   // 玩家b丢分
    //   resetBall()
    //   ball.directionX = -1
    // }
    // if (ball.x + ball.speed*ball.directionX < 0) {
    //   resetBall()
    //   ball.directionX = 1
    // }

    ball.x += ball.speed * ball.directionX
    ball.y += ball.speed * ball.directionY
    $ball.css({
      "left": ball.x,
      "top": ball.y
    })
  }

  function movePaddles() {
    if (pingpong.pressedKeys[KEY.UP]) {
      var top = parseInt($right.css("top"))
      $right.css('top', top-5)
    }
    if (pingpong.pressedKeys[KEY.DOWN]) {
      var top = parseInt($right.css("top"))
      $right.css('top', top+5)
    }
    if (pingpong.pressedKeys[KEY.W]) {
      var top = parseInt($left.css("top"))
      $left.css('top', top-5)
    }
    if (pingpong.pressedKeys[KEY.S]) {
      var top = parseInt($left.css("top"))
      $left.css('top', top+5)
    }
  }

  // 标记pressedKeys数组里某键的状态是按下还是放开
  $(document).on('keydown', function (e) {
    pingpong.pressedKeys[e.keyCode] = true
  })
  $(document).on('keyup', function (e) {
    pingpong.pressedKeys[e.keyCode] = false
  })
})