import { Ball, GameData } from '../../types/lobby.interface';

export default class SpellWeaverEntity {
  private arcaneResources = [{ AP: 3 }, { AP: 3 }];
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

  enhanceBall(ball: Ball, data: GameData) {
    if (data.paddle1.isSpace) console.log('He pressed space');
  }
}
