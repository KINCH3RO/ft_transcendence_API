import { Ball } from '../../types/lobby.interface';

export default class GraviraSpawner {
  private orbs: Orb[] = [];
  private spawnInterval;

  constructor() {
    this.spawnInterval = setInterval(() => {
      const orb: Orb = {
        x: Math.floor(Math.random() * 60 + 20),
        y: Math.floor(Math.random() * 60 + 20),
      };

      this.orbs.push(orb);

      setTimeout(() => {
        this.orbs = this.orbs.filter((o) => o !== orb);
      }, 1000);
    }, 1000);
  }

  pullBallToOrbs(ball: { x: number; y: number }) {
    this.orbs.map((orb) => {
      if (
        Math.pow(Math.abs(orb.x - ball.x), 2) +
          Math.pow(Math.abs(orb.y - ball.y), 2) <
        121
      ) {
        if (orb.y > ball.y) {
          ball.y += 0.5;
        } else if (orb.y < ball.y) {
          ball.y -= 0.5;
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
