import { Injectable } from '@nestjs/common';
import { GameMode } from 'src/res/web-socket/types/game-mode.interface';
import {
  Ball,
  GameData,
  Paddle,
} from 'src/res/web-socket/types/lobby.interface';

@Injectable()
export class GameService {
  constructor() {
    this.ballRadius = 2;
    this.paddleSpeed = 2;
    this.paddleWidth = 1;
  }

  private ballRadius: number;
  private paddleSpeed: number;
  private paddleWidth: number;

  updateGame(gameData: GameData, mode: GameMode) {
    const paddle1 = this.updatePaddle(gameData.paddle1);
    const paddle2 = this.updatePaddle(gameData.paddle2);
    // const ball = this.updateBall(
    //   gameData.ball,
    //   gameData.paddle1,
    //   gameData.paddle2,
    //   gameData,
    // );

    let orbs = [];

    if (gameData.spawner) orbs = gameData.spawner.getOrbs();

    if (gameData.spellWeaver) {
      gameData.spellWeaver.updatePaddleResources(gameData);
    }

    return {
      ball: { x: gameData.ball.x, y: gameData.ball.y },
      paddle1,
      paddle2,
      orbs,
    };
    // return { ball, paddle1, paddle2, orbs };
  }

  updateBall(
    ball: Ball,
    leftPaddle: Paddle,
    rightPaddle: Paddle,
    gameData: GameData,
  ) {
    if (ball.x + this.ballRadius > 100 || ball.x - this.ballRadius < 0) {
      this.updateScore(gameData, ball.x > 50);
      ball.x = 50;
      ball.y = 50;
    }
    if (ball.y + this.ballRadius > 100 || ball.y - this.ballRadius < 0)
      ball.yDirection *= -1;
    this.checkLeftPaddle(ball, leftPaddle);
    this.checkRightPaddle(ball, rightPaddle);

    if (gameData.spawner) {
      gameData.spawner.pullBallToOrbs(ball);
    }

    if (gameData.spellWeaver) {
      gameData.spellWeaver.enhanceBall(ball, gameData);
    }

    ball.x += ball.xSpeed * ball.xDirection;
    ball.y += ball.ySpeed * ball.yDirection;

    return { x: ball.x, y: ball.y };
  }

  checkLeftPaddle(ball: Ball, paddle: Paddle) {
    if (ball.x - this.ballRadius < paddle.x + this.paddleWidth) {
      if (ball.y >= paddle.y && ball.y <= paddle.y + paddle.height) {
        ball.xDirection *= -1;
        ball.x = paddle.x + this.ballRadius + this.paddleWidth;
      }
    }
  }

  checkRightPaddle(ball: Ball, paddle: Paddle) {
    if (ball.x + this.ballRadius > paddle.x) {
      if (ball.y >= paddle.y && ball.y <= paddle.y + paddle.height) {
        ball.xDirection *= -1;
        ball.x = paddle.x - this.ballRadius;
      }
    }
  }

  updatePaddle(paddle: Paddle) {
    if (paddle.isDown && paddle.y + paddle.height + this.paddleSpeed <= 100) {
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
