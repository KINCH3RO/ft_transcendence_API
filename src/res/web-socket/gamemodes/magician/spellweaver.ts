import { Ball, GameData, Paddle } from '../../types/lobby.interface';

export default class SpellWeaverEntity {
  private readonly defaultBall: Ball;

  constructor(ball: Ball) {
    this.defaultBall = {
      x: ball.x,
      y: ball.y,
      xDirection: ball.xDirection,
      yDirection: ball.yDirection,
      xSpeed: ball.xSpeed,
      ySpeed: ball.ySpeed,
    };
  }

  updatePaddleResources(gameData: GameData) {
    gameData.paddle1.mana += 1 / 60;
    if (gameData.paddle1.mana > 3) gameData.paddle1.mana = 3;

    gameData.paddle2.mana += 1 / 60;
    if (gameData.paddle2.mana > 3) gameData.paddle2.mana = 3;
  }

  handleAbilities(gameData: GameData) {
    if (gameData.paddle1.numberPressed && !gameData.paddle1.isCasting) {
      switch (gameData.paddle1.numberPressed) {
        case '1':
          this.spawnGravityOrb(gameData.paddle1, gameData);
          break;
      }
    }
    if (gameData.paddle2.numberPressed && !gameData.paddle2.isCasting) {
      switch (gameData.paddle2.numberPressed) {
        case '1':
          this.spawnGravityOrb(gameData.paddle2, gameData);
          break;
      }
    }
  }

  spawnGravityOrb(paddle: Paddle, gameData: GameData) {
    const ball = gameData.ball;
    const spawner = gameData.spawner;

    if (paddle.mana < 3) return;

    let x = ball.x + (paddle.x < 50 ? 20 : -20);
    if (paddle.x < 50 && x > 80) x = 80;
    if (paddle.x > 50 && x < 20) x = 20;

    const randY = Math.floor(Math.random() * 10 + 10);
    const y = ball.y + (ball.y > 50 ? randY : -randY);

    spawner.spawnNewOrb(x, y);
    paddle.mana -= 3;
    gameData.resourcesUpdated = true;
  }

  enhanceBall(ball: Ball, data: GameData) {}
}
