import { Ball, GameData, Paddle } from '../../types/lobby.interface';

export default class SpellWeaverEntity {
  private readonly defaultPaddle: { speed: number };

  constructor(ball: Ball, paddle: Paddle) {
    this.defaultPaddle = { speed: paddle.speed };
  }

  updatePaddleResources(gameData: GameData) {
    const paddle = [gameData.paddle1, gameData.paddle2];

    paddle.forEach((paddle) => {
      paddle.mana += 1 / 60;
      if (paddle.mana > 3) paddle.mana = 3;

      paddle.homingStunOrbs.forEach((orb) => {
        const paddleCenter = {
          x: paddle.x + (paddle.x > 50 ? 0.5 : -0.5),
          y: paddle.y + paddle.height / 2,
        };
        const dist = Math.sqrt(
          Math.pow(orb.x - paddleCenter.x, 2) +
            Math.pow(orb.y - paddleCenter.y, 2),
        );
        orb.x +=
          (Math.abs(orb.x - paddleCenter.x) / dist) *
          (orb.x < paddleCenter.x ? 1 : -1);
        orb.y +=
          (Math.abs(orb.y - paddleCenter.y) / dist) *
          (orb.y < paddleCenter.y ? 1 : -1);
        if (
          Math.pow(orb.x - paddleCenter.x, 2) +
            Math.pow(orb.y - paddleCenter.y, 2) <
            16 ||
          Math.abs(orb.x - paddleCenter.x) < 1
        )
          orb.collided = true;
      });

      if (paddle.homingStunOrbs.some((orb) => orb.collided)) {
        paddle.isStunned = true;
        paddle.speed = 0;
        paddle.stunDuration = 60 * 2;
      }

      paddle.homingStunOrbs = paddle.homingStunOrbs.filter(
        (orb) => !orb.collided,
      );
    });

    return gameData.paddle1.homingStunOrbs
      .concat(gameData.paddle2.homingStunOrbs)
      .map((orb) => {
        return { x: orb.x, y: orb.y };
      });
  }

  handleAbilities(gameData: GameData) {
    const paddles = [gameData.paddle1, gameData.paddle2];

    paddles.forEach((paddle, i) => {
      if (paddle.isStunned) {
        paddle.stunDuration -= 1;
        if (paddle.stunDuration === 0) {
          paddle.isStunned = false;
          paddle.speed = this.defaultPaddle.speed;
        }
      } else if (paddle.isCasting) {
        paddle.castDuration -= 1;
        if (paddle.castDuration === 0) {
          paddle.isCasting = false;
          paddle.speed = this.defaultPaddle.speed;
        }
      } else if (paddle.numberPressed && !paddle.isCasting) {
        switch (paddle.numberPressed) {
          case '1':
            this.spawnGravityOrb(paddle, gameData);
            break;
          case '2':
            this.enhancePaddleSpeed(paddle, gameData);
            break;
          case '3':
            this.spawnStunOrb(paddle, paddles[(i + 1) % 2], gameData);
            break;
        }
      }
    });
  }

  spawnGravityOrb(paddle: Paddle, gameData: GameData) {
    const ball = gameData.ball;
    const spawner = gameData.spawner;

    if (paddle.mana < 3) return;

    let x = ball.x + (paddle.x < 50 ? 5 : -5);
    if (paddle.x < 50 && x > 80) x = 80;
    if (paddle.x > 50 && x < 20) x = 20;

    const randY = Math.floor(Math.random() * 10 + 4);
    const y = Math.max(
      Math.min(ball.y + (ball.yDirection > 0 ? randY : -randY), 80),
      20,
    );

    spawner.spawnNewOrb(x, y);
    paddle.mana -= 3;
    gameData.resourcesUpdated = true;
  }

  spawnStunOrb(caster: Paddle, target: Paddle, gameData: GameData) {
    const spawner = gameData.spawner;

    if (caster.mana < 2) return;

    target.homingStunOrbs.push(
      spawner.spawnNewStunOrb(
        caster.x + (caster.x > 50 ? -0.5 : 0.5),
        caster.y + caster.height / 2,
      ),
    );
    caster.isCasting = true;
    caster.castDuration = 60 * 2;
    caster.mana -= 2;
    gameData.resourcesUpdated = true;
  }

  enhancePaddleSpeed(paddle: Paddle, gameData: GameData) {
    if (paddle.mana < 2) return;

    paddle.speed *= 2;
    paddle.isCasting = true;
    paddle.castDuration = 60 * 3;
    paddle.mana -= 2;
    gameData.resourcesUpdated = true;
  }
}
