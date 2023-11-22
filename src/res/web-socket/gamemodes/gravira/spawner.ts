import { Ball } from '../../types/lobby.interface';

export default class GraviraSpawner {
  private orbs: Orb[] = [];

  constructor() {}

  spawnNewOrb(x: number, y: number) {
    this.orbs.push({ x, y });
  }

  spawnNewStunOrb(x: number, y: number) {
    const orb = { x, y, collided: false };
    return orb;
  }

  pullBallToOrbs(ball: Ball) {
    const maxBend = 1.3;
    const minBend = 0.7;
    this.orbs.map((orb) => {
      if (
        Math.pow(Math.abs(orb.x - ball.x), 2) +
          Math.pow(Math.abs(orb.y - ball.y), 2) <
        300
      ) {
        if (orb.y > ball.y) {
          ball.yDirection += 0.1;
          ball.yDirection =
            ball.yDirection < 0
              ? this.restrictValue(ball.yDirection, -maxBend, -minBend)
              : this.restrictValue(ball.yDirection, minBend, maxBend);
        } else if (orb.y < ball.y) {
          ball.yDirection -= 0.1;
          ball.yDirection =
            ball.yDirection < 0
              ? this.restrictValue(ball.yDirection, -maxBend, -minBend)
              : this.restrictValue(ball.yDirection, minBend, maxBend);
        }
        if (orb.x > ball.x) {
          ball.xDirection += 0.1;
          ball.xDirection =
            ball.xDirection < 0
              ? this.restrictValue(ball.xDirection, -maxBend, -minBend)
              : this.restrictValue(ball.xDirection, minBend, maxBend);
        } else if (orb.x < ball.x) {
          ball.xDirection -= 0.1;
          ball.xDirection =
            ball.xDirection < 0
              ? this.restrictValue(ball.xDirection, -1.2, -0.8)
              : this.restrictValue(ball.xDirection, 0.8, 1.2);
        }
      }
    });
  }

  restrictValue(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  getOrbs(): Orb[] {
    return this.orbs;
  }
}

interface Orb {
  x: number;
  y: number;
}
