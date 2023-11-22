import { Ball, GameData } from '../../types/lobby.interface';

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
    gameData.paddle1.mana += 0.4;
    if (gameData.paddle1.mana > 3) gameData.paddle1.mana = 3;

    gameData.paddle2.mana += 0.4;
    if (gameData.paddle2.mana > 3) gameData.paddle2.mana = 3;
  }

  enhanceBall(ball: Ball, data: GameData) {}
}
