import { Injectable } from '@nestjs/common';
import {
  Ball,
  GameData,
  Paddle,
} from 'src/res/web-socket/types/lobby.interface';

@Injectable()
export class GameService {
  constructor() {
    this.xballSpeed = 0.5;
    this.yballSpeed = 1.5;
    this.ballRaduis = 2;
    this.paddleSpeed = 2;
    this.paddleHeight = 20;
    this.paddleWidth = 1;
  }

  private ballRaduis: number;
  private xballSpeed: number;
  private yballSpeed: number;
  private paddleSpeed: number;
  private paddleHeight: number;
  private paddleWidth: number;

  updateGame(gameData: GameData) {
    const paddle1 = this.updatePaddle(gameData.paddle1);
    const paddle2 = this.updatePaddle(gameData.paddle2);
    const ball = this.updateBall(
      gameData.ball,
      gameData.paddle1,
      gameData.paddle2,
      gameData,
    );
    return { ball, paddle1, paddle2 };
  }

  updateBall(
    ball: Ball,
    leftPaddle: Paddle,
    rightPaddle: Paddle,
    gameData: GameData,
  ) {
    if (ball.x + this.ballRaduis > 100 || ball.x - this.ballRaduis < 0) {
      this.updateScore(gameData, ball.x > 50);
      ball.x = 50;
      ball.y = 50;
    }
    if (ball.y + this.ballRaduis > 100 || ball.y - this.ballRaduis < 0)
      ball.yDirection *= -1;
    this.checkLeftPaddle(ball, leftPaddle);
    this.checkRightPaddle(ball, rightPaddle);
    ball.x += this.xballSpeed * ball.xDirection;
    ball.y += this.yballSpeed * ball.yDirection;
    return { x: ball.x, y: ball.y };
  }

  checkLeftPaddle(ball: Ball, paddle: Paddle) {
    if (ball.x - this.ballRaduis < paddle.x + this.paddleWidth) {
      if (ball.y >= paddle.y && ball.y <= paddle.y + this.paddleHeight) {
        ball.xDirection *= -1;
        ball.x = paddle.x + this.ballRaduis + this.paddleWidth;
      }
    }
  }

  checkRightPaddle(ball: Ball, paddle: Paddle) {
    if (ball.x + this.ballRaduis > paddle.x) {
      if (ball.y >= paddle.y && ball.y <= paddle.y + this.paddleHeight) {
        ball.xDirection *= -1;
        ball.x = paddle.x - this.ballRaduis;
      }
    }
  }

  updatePaddle(paddle: Paddle) {
    if (
      paddle.isDown &&
      paddle.y + this.paddleHeight + this.paddleSpeed <= 100
    ) {
      paddle.y += this.paddleSpeed;
    }
    if (paddle.isUP && paddle.y - this.paddleSpeed >= 0) {
      paddle.y -= this.paddleSpeed;
    }
    return { x: paddle.x, y: paddle.y };
  }

  updateScore(gameData: GameData, player1: boolean) {
    gameData.score[player1 ? 0 : 1]++;
    gameData.scoreUpdated = true;
  }
}
