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
        this.orbs = this.orbs.filter((o) => o === orb);
      }, 1000);
    }, 1000);
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
