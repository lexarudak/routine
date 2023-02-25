import { colorsAndFonts } from '../../../components/colorsAndFonts';
import { client } from '../data/data';

class FlyingThought {
  id: string;

  radius: number;

  x: number;

  y: number;

  dx: number;

  dy: number;

  constructor(id: string, x: number, y: number, dx: number, dy: number, radius: number) {
    this.id = id;
    this.radius = radius;

    this.x = x;
    this.y = y;

    this.dx = dx;
    this.dy = dy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2 * Math.PI);
    [[ctx.fillStyle]] = colorsAndFonts;
    ctx.fill();
    ctx.closePath();
    this.updateThoughtPos();
  }

  drawCircles(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2 * Math.PI);
    [[, ctx.fillStyle]] = colorsAndFonts;
    ctx.fill();
    ctx.closePath();
  }

  updateThoughtPos() {
    if (this.x + this.radius > client.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > client.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  getDistance(a: FlyingThought, b: FlyingThought) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  thoughtCollision(thoughtsArray: FlyingThought[]) {
    for (let i = 0; i < thoughtsArray.length - 1; i += 1) {
      for (let j = i + 1; j < thoughtsArray.length; j += 1) {
        const obj1 = thoughtsArray[i];
        const obj2 = thoughtsArray[j];
        const dist = this.getDistance(obj1, obj2);

        if (dist <= obj1.radius + obj2.radius) {
          const theta1 = obj1.angle();
          const theta2 = obj2.angle();
          const phi = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
          const v1 = obj1.speed();
          const v2 = obj2.speed();

          const dxObj1 =
            v2 * Math.cos(theta2 - phi) * Math.cos(phi) + v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
          const dyObj1 =
            v2 * Math.cos(theta2 - phi) * Math.sin(phi) + v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
          const dxObj2 =
            v1 * Math.cos(theta1 - phi) * Math.cos(phi) + v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
          const dyObj2 =
            v1 * Math.cos(theta1 - phi) * Math.sin(phi) + v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

          obj1.dx = dxObj1;
          obj1.dy = dyObj1;
          obj2.dx = dxObj2;
          obj2.dy = dyObj2;

          this.staticCollision(obj1, obj2);
        }
      }
    }
  }

  staticCollision(ob1: FlyingThought, ob2: FlyingThought, emergency = false) {
    const overlap = ob1.radius + ob2.radius - this.getDistance(ob1, ob2);
    const obj = ob1;

    const theta = Math.atan2(ob2.y - ob1.y, ob2.x - ob1.x);
    obj.x -= overlap * Math.cos(theta);
    obj.y -= overlap * Math.sin(theta);

    if (this.getDistance(ob1, ob2) < ob1.radius + ob2.radius && !emergency) this.staticCollision(ob1, ob2, true);
  }

  speed() {
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }

  angle() {
    return Math.atan2(this.dy, this.dx);
  }
}

export default FlyingThought;
