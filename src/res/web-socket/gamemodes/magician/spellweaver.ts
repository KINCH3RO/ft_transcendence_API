import { Ball, GameData, Paddle } from '../../types/lobby.interface';

export default class SpellWeaverEntity {
  private readonly defaultPaddle: Paddle;

  constructor(ball: Ball, paddle: Paddle) {
    // Might need to only keep speed...
    this.defaultPaddle = {
      height: paddle.height,
      isCasting: paddle.isCasting,
      isStunned: paddle.isStunned,
      isDown: paddle.isDown,
      isUP: paddle.isUP,
      mana: paddle.mana,
      numberPressed: paddle.numberPressed,
      x: paddle.x,
      y: paddle.y,
      castDuration: paddle.castDuration,
      stunDuration: paddle.stunDuration,
      speed: paddle.speed,
      homingStunOrbs: paddle.homingStunOrbs,
    };
  }

  updatePaddleResources(gameData: GameData) {
    //Paddle 1
    const paddle1 = gameData.paddle1;

    paddle1.mana += 1 / 60;
    if (paddle1.mana > 3) paddle1.mana = 3;

    paddle1.homingStunOrbs.forEach((orb) => {
      orb.x += orb.x < paddle1.x ? 1 : -1;
      orb.y += orb.y < paddle1.y ? 1 : -1;
      if (Math.pow(orb.x - paddle1.x, 2) + Math.pow(orb.y - paddle1.y, 2) < 16)
        orb.collided = true;
    });

    if (paddle1.homingStunOrbs.some((orb) => orb.collided)) {
      paddle1.isStunned = true;
      paddle1.speed = 0;
      paddle1.stunDuration = 60 * 2;
    }

    paddle1.homingStunOrbs = paddle1.homingStunOrbs.filter(
      (orb) => !orb.collided,
    );

    //Paddle 2
    const paddle2 = gameData.paddle2;

    paddle2.mana += 1 / 60;
    if (paddle2.mana > 3) paddle2.mana = 3;

    paddle2.homingStunOrbs.forEach((orb) => {
      orb.x += orb.x < paddle2.x ? 1 : -1;
      orb.y += orb.y < paddle2.y ? 1 : -1;
      if (Math.pow(orb.x - paddle2.x, 2) + Math.pow(orb.y - paddle2.y, 2) < 16)
        orb.collided = true;
    });

    if (paddle2.homingStunOrbs.some((orb) => orb.collided)) {
      paddle2.isStunned = true;
      paddle2.speed = 0;
      paddle2.stunDuration = 60 * 2;
    }

    paddle2.homingStunOrbs = paddle2.homingStunOrbs.filter(
      (orb) => !orb.collided,
    );

    return gameData.paddle1.homingStunOrbs
      .concat(gameData.paddle2.homingStunOrbs)
      .map((orb) => {
        return { x: orb.x, y: orb.y };
      });
  }

  handleAbilities(gameData: GameData) {
    if (gameData.paddle1.isStunned) {
      gameData.paddle1.stunDuration -= 1;
      if (gameData.paddle1.stunDuration === 0) {
        gameData.paddle1.isStunned = false;
        gameData.paddle1.speed = this.defaultPaddle.speed;
      }
    } else if (gameData.paddle1.isCasting) {
      gameData.paddle1.castDuration -= 1;
      if (gameData.paddle1.castDuration === 0) {
        gameData.paddle1.isCasting = false;
        gameData.paddle1.speed = this.defaultPaddle.speed;
      }
    } else if (gameData.paddle1.numberPressed && !gameData.paddle1.isCasting) {
      switch (gameData.paddle1.numberPressed) {
        case '1':
          this.spawnGravityOrb(gameData.paddle1, gameData);
          break;
        case '2':
          this.enhancePaddleSpeed(gameData.paddle1, gameData);
          break;
        case '3':
          this.spawnStunOrb(gameData.paddle1, gameData.paddle2, gameData);
          break;
      }
    }
    // Paddle2
    if (gameData.paddle2.isStunned) {
      gameData.paddle2.stunDuration -= 1;
      if (gameData.paddle2.stunDuration === 0) {
        gameData.paddle2.isStunned = false;
        gameData.paddle2.speed = this.defaultPaddle.speed;
      }
    } else if (gameData.paddle2.isCasting) {
      gameData.paddle2.castDuration -= 1;
      if (gameData.paddle2.castDuration === 0) {
        gameData.paddle2.isCasting = false;
        gameData.paddle2.speed = this.defaultPaddle.speed;
      }
    } else if (gameData.paddle2.numberPressed && !gameData.paddle2.isCasting) {
      switch (gameData.paddle2.numberPressed) {
        case '1':
          this.spawnGravityOrb(gameData.paddle2, gameData);
          break;
        case '2':
          this.enhancePaddleSpeed(gameData.paddle2, gameData);
          break;
        case '3':
          this.spawnStunOrb(gameData.paddle2, gameData.paddle1, gameData);
          break;
      }
    }
  }

  spawnGravityOrb(paddle: Paddle, gameData: GameData) {
    const ball = gameData.ball;
    const spawner = gameData.spawner;

    if (paddle.mana < 3) return;

    let x = ball.x + (paddle.x < 50 ? 5 : -5);
    if (paddle.x < 50 && x > 80) x = 80;
    if (paddle.x > 50 && x < 20) x = 20;

    const randY = Math.floor(Math.random() * 10 + 4);
    const y = ball.y + (ball.yDirection > 0 ? randY : -randY);

    spawner.spawnNewOrb(x, y);
    paddle.mana -= 3;
    gameData.resourcesUpdated = true;
  }

  spawnStunOrb(caster: Paddle, target: Paddle, gameData: GameData) {
    const spawner = gameData.spawner;

    if (caster.mana < 2) return;

    target.homingStunOrbs.push(spawner.spawnNewStunOrb(caster.x, caster.y));
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
