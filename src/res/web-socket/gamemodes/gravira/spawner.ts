import { Ball } from '../../types/lobby.interface';

export default class GraviraSpawner {
  private orbs: Orb[] = [];
  private spawnInterval;

  constructor() {
    for (let i = 0; i < 4; i++) {
      this.orbs.push({
        x: Math.floor(Math.random() * 60 + 20),
        y: Math.floor(Math.random() * 60 + 20),
      });
    }
  }

  pullBallToOrbs(ball: Ball) {
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
              ? this.restrictValue(ball.yDirection, -1.2, -0.8)
              : this.restrictValue(ball.yDirection, 0.8, 1.2);
        } else if (orb.y < ball.y) {
          ball.yDirection -= 0.1;
          ball.yDirection =
            ball.yDirection < 0
              ? this.restrictValue(ball.yDirection, -1.2, -0.8)
              : this.restrictValue(ball.yDirection, 0.8, 1.2);
        }
        if (orb.x > ball.x) {
          ball.xDirection += 0.1;
          ball.xDirection =
            ball.xDirection < 0
              ? this.restrictValue(ball.xDirection, -1.2, -0.8)
              : this.restrictValue(ball.xDirection, 0.8, 1.2);
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

  destructor() {
    clearInterval(this.spawnInterval);
  }
}

interface Orb {
  x: number;
  y: number;
}
