import { Injectable } from '@nestjs/common';
import {
  AchievementUnlock,
  Ball,
  GameData,
  Paddle,
} from 'src/res/web-socket/types/lobby.interface';

@Injectable()
export class GameService {
  constructor() {
    this.ballRadius = 2;
    this.paddleWidth = 1;
  }

  private ballRadius: number;
  private paddleWidth: number;

  updateGame(gameData: GameData) {
    const paddle1 = this.updatePaddle(gameData.paddle1);
    const paddle2 = this.updatePaddle(gameData.paddle2);
    // const ball = this.updateBall(
    //   gameData.ball,
    //   gameData.paddle1,
    //   gameData.paddle2,
    //   gameData,
    // );

    let orbs = [];
    let stunOrbs = [];

    if (gameData.spellWeaver) {
      stunOrbs = gameData.spellWeaver.updatePaddleResources(gameData);
      gameData.spellWeaver.handleAbilities(gameData);
    }

    if (gameData.spawner) orbs = gameData.spawner.getOrbs();

    return {
      ball: gameData.ball,
      paddle1,
      paddle2,
      orbs,
      stunOrbs,
    };
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
    this.checkLeftPaddle(ball, leftPaddle, gameData.achievements[0]);
    this.checkRightPaddle(ball, rightPaddle, gameData.achievements[1]);

    if (gameData.spawner) {
      gameData.spawner.pullBallToOrbs(ball);
    }

    ball.x += ball.xSpeed * ball.xDirection;
    ball.y += ball.ySpeed * ball.yDirection;

    return { x: ball.x, y: ball.y };
  }

  checkLeftPaddle(ball: Ball, paddle: Paddle, achievements: AchievementUnlock) {
    if (ball.x - this.ballRadius < paddle.x + this.paddleWidth) {
      if (ball.y >= paddle.y && ball.y <= paddle.y + paddle.height) {
        ball.xDirection *= -1;
        ball.x = paddle.x + this.ballRadius + this.paddleWidth;
        if (paddle.isStunned) achievements.stunnedSavior = true;
        achievements.deleteGame = false;
      }
    }
  }

  checkRightPaddle(
    ball: Ball,
    paddle: Paddle,
    achievements: AchievementUnlock,
  ) {
    if (ball.x + this.ballRadius > paddle.x) {
      if (ball.y >= paddle.y && ball.y <= paddle.y + paddle.height) {
        ball.xDirection *= -1;
        ball.x = paddle.x - this.ballRadius;
        if (paddle.isStunned) achievements.stunnedSavior = true;
        achievements.deleteGame = false;
      }
    }
  }

  updatePaddle(paddle: Paddle) {
    if (paddle.isDown && paddle.y + paddle.height + paddle.speed <= 100) {
      paddle.y += paddle.speed;
    }
    if (paddle.isUP && paddle.y - paddle.speed >= 0) {
      paddle.y -= paddle.speed;
    }
    return { x: paddle.x, y: paddle.y };
  }

  updateScore(gameData: GameData, player1: boolean) {
    if (gameData.paddle1.speed == 4 && !player1)
      gameData.achievements[0].speedySlipup = true;

    if (gameData.paddle2.speed == 4 && player1)
      gameData.achievements[1].speedySlipup = true;

    gameData.score[player1 ? 0 : 1]++;
    gameData.scoreUpdated = true;
  }
}
