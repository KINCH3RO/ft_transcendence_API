import { Ball } from '../../types/lobby.interface';

export default class GraviraSpawner {
  private orbs: Orb[] = [];
  private spawnInterval;

  constructor() {
    // this.orbs.push({
    //   x: Math.floor(20),
    //   y: Math.floor(30),
    // });
    // this.orbs.push({
    //   x: Math.floor(20),
    //   y: Math.floor(60),
    // });
    // this.orbs.push({
    //   x: Math.floor(80),
    //   y: Math.floor(30),
    // });
    // this.orbs.push({
    //   x: Math.floor(80),
    //   y: Math.floor(60),
    // });
  }

  spawnNewOrb(x: number, y: number) {
    this.orbs.push({ x, y });
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

  destructor() {
    clearInterval(this.spawnInterval);
  }
}

interface Orb {
  x: number;
  y: number;
}
