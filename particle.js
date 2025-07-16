class Particle {
  constructor(x, y, w, h, ang, color, tipo,img) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.w = w;
    this.h = h;
    this.ang = ang;
    this.img=img;
    this.tipo = tipo;
    this.subs = [];
    this.groupState = 'idle'; // para rectángulos
    this.generateSubs();
  }
//------------------------------------------------------
   generateSubs() {
        let cosA = cos(this.ang);
        let sinA = sin(this.ang);

      for (let i = 0; i < this.w; i += tam) {
      for (let j = 0; j < this.h; j += tam) {
        let relX = i - this.w / 2;
        let relY = j - this.h / 2;
        let xRot = this.x + relX * cosA - relY * sinA;
        let yRot = this.y + relX * sinA + relY * cosA;

        let u = i / this.w;
        let v = j / this.h;

        let xImg = u * this.img.width;
        let yImg = v * this.img.height;

        let wImg = tam * (this.img.width / this.w);
        let hImg = tam * (this.img.height / this.h);

        let imgPiece = this.img.get(int(xImg), int(yImg), int(wImg), int(hImg));

        this.subs.push({x: xRot, y: yRot,ox: xRot, oy: yRot,velX: 0, velY: 0,imgPiece});
      }
    }

   }
//------------------------------------------------------
   //Explota los cuadrados.
  explode() {
    for (let s of this.subs) {
      let angle = atan2(s.oy - height / 2, s.ox - width / 2);
      s.velX = cos(angle) * random(3, 5);
      s.velY = sin(angle) * random(3, 5);
    }
  }
//------------------------------------------------------
//agrupa los rectangulos en una posicion random x,y.
groupToCenter(x,y) {
  // Definimos un nuevo centro temporal
  this.targetX = x;
  this.targetY = y;

  this.groupState = 'grouping';

  let cosA = cos(this.ang);
  let sinA = sin(this.ang);
  let idx = 0;

  for (let i = 0; i < this.w; i += tam) {
    for (let j = 0; j < this.h; j += tam) {
      let relX = i - this.w / 2;
      let relY = j - this.h / 2;
      let xRot = this.targetX + relX * cosA - relY * sinA;
      let yRot = this.targetY + relX * sinA + relY * cosA;

      let s = this.subs[idx++];
      s.destX = xRot;
      s.destY = yRot;
    }
  }
}
//--------------------VUELVE A SU POSICION ORIGINAL CUADRADOS Y RECTANGULOS--------------------
//cuadrados vuelven a su lugar original

  goBack() {

    for (let s of this.subs) {
      s.velX = (s.ox - s.x) * 0.1;
      s.velY = (s.oy - s.y) * 0.1;
    }
  }
// modifica la nueva ubicacion de los rectangulos una vez que finaliza el sonido
newPosition() {
  this.groupState = 'idle';

  this.x = random(100, width - 100);
  this.y = random(100, height - 100);

  let cosA = cos(this.ang);
  let sinA = sin(this.ang);
  let idx = 0;

  for (let i = 0; i < this.w; i += tam) {
    for (let j = 0; j < this.h; j += tam) {
      let relX = i - this.w / 2;
      let relY = j - this.h / 2;

      let xRot = this.x + relX * cosA - relY * sinA;
      let yRot = this.y + relX * sinA + relY * cosA;

      let s = this.subs[idx++];
      s.ox = xRot;
      s.oy = yRot;
      s.x = xRot;
      s.y = yRot;
    }
  }
}
//------------------------------------------------------
//Actualiza la posicion en caso de tener movimiento.
update() {
  for (let s of this.subs) {
    if (this.tipo === 'rect') {
      if (this.groupState === 'grouping') {
        // Mover hacia el centro agrupado
        s.x += (s.destX - s.x) * 0.01;
        s.y += (s.destY - s.y) * 0.01;
      } else if (this.groupState === 'idle') {
        // Mantener en posición original
        s.x += (s.ox - s.x) * 0.0001;
        s.y += (s.oy - s.y) * 0.0001;
      }
    } else {
      // squares
      s.x += s.velX;
      s.y += s.velY;
    }
  }
}
//------------------------------------------------------
//Dibuje los objetos
  show() {
    push();
    for (let s of this.subs) {
      push();
      translate(s.x, s.y);
      rotate(this.ang);
      imageMode(CENTER);
      if (this.tipo === 'square' && estado === 'sonidoGraveProlongado') {
      colorMode(HSB, 360, 360, 360);
      tint(randomHue, 360, 360); // Usar el matiz random con saturación y brillo fijos
      colorMode(RGB, 255);
    }
      image(s.imgPiece, 0,0, tam + 1, tam + 1);
      pop();
      noTint();
    }
    pop();
  }
}
