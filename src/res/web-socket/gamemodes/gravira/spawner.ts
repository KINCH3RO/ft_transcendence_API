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
          ball.xDirection -= 0.1;
          ball.yDirection += 0.1;
          // ball.y += 1;
        } else if (orb.y < ball.y) {
          ball.xDirection += 0.1;
          ball.yDirection -= 0.1;
          // ball.y -= 1;
        }
      }
    });
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
