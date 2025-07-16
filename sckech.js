/*
Comision: Lisandro 
Eduardo Medrano:93096/6
Alex Palomeque: 93077/3
Luz Pereyra: 92816/1
Jimena Aylén Marazzi: 93043/2
Micaela castañeda: 93566/6
María Elena Molina: 94803/4
*/

let particles = [];
let tam = 27;
let fondo, azul, rojo, amarillo, verde, marron, negro;

let monitoreo=false; // Poner en true si es necesario el monitoreo y sino dejar en false
let mic;
let pitch;
let audioContext;

let randomHue = 0;

// en esta parte hay que configurar la frecuencia y amplitud dependiendo la pc
//aguda numero mas alto de frecuencia grabe mas bajo (40) aprox. 
//aguda 60 - 80.
let FREC_MIN=40;
let FREC_MAX=60;
let AMP_MIN=0.02;
let AMP_MAX=0.07;
let limiteAgudoGrave=0.5; 

let gestorAmp;
let gestorPitch; // Frecuencia.

let haySonido; //Sonido actual.
let antesHabiaSonido; //Estado anterior del sonido

let estado='sinMovimiento';
let nuevaUbicacion=false;
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let marcaT;

function preload() {
  fondo = loadImage('image/Frame2.png'); 
    azul = loadImage('image/azul.png');
  rojo = loadImage('image/rojo.png');
  amarillo = loadImage('image/amarillo.png');
  verde = loadImage('image/verde.png');
  marron = loadImage('image/marron.png');
  negro = loadImage('image/negro.png');
}

function setup() {
createCanvas(720, 1280);
      audioContext = getAudioContext();
      mic = new p5.AudioIn();
      mic.start(startPitch);
  userStartAudio();// por la dudas para forzar inicio de audio en algunos navegadores

  gestorAmp =  new GestorSenial( AMP_MIN, AMP_MAX);
  gestorPitch = new GestorSenial( FREC_MIN, FREC_MAX);

  antesHabiaSonido = false;

  // ==================== FIGURAS ====================
  let square = [
  // cuadrado rojo
    { x:52 , y: random(100, 1000) , w: 66,h: 66,ang : 35 + random(1,5) , img: rojo},
    { x:573 , y: random(100, 1000), w: 40,h: 40,ang : 117 + random(1,5)  , img: rojo},
    { x:random(100,500) , y:506 , w: 64,h: 64,ang : 72 + random(1,5)  , img: rojo},
    { x:random(100, 1000) , y: 783 , w: 85,h: 85,ang : 21 + random(0,5), img: rojo},
  // cuadrado amarillo
    { x:random(100, 1000) , y:130 , w: 33,h: 33,ang : 29 + random(0,5) , img: amarillo},
    { x:74 , y:105 , w: 19,h: 19,ang : 33 + random(0,5), img: amarillo},
  // cuadrado negro
    { x:random(100, 1000) , y:17 , w: 30,h: 30,ang : 35 + random(0,5), img: negro},
  // cuadrado azul
    { x:434 , y:random(100, 1000)  , w: 241,h:241 ,ang : 45 + random(0,5), img: azul},
    { x:640 , y:random(100, 1000)  , w: 45,h:45 ,ang : 45 + random(0,5), img: azul},
    { x:random(100, 1000) , y:599 , w: 45,h:45 ,ang : 45 + random(0,5), img: azul},
  
  ];
  let rectangle = [
  // Verde rectangulo grande
    { x:random(100, 1000), y: 308, w: 91, h:344,ang: 35, color:'#198F51', img: verde},
  // rectangulo Rojo 
    { x:random(100,500) , y:530 , w: 30,h: 611,ang : 35 + random(1,5), img: rojo },
    { x:639 , y:  random(100, 1000) , w: 60,h: 17,ang : 80 + random(1,5) , img: rojo },
    { x:519 , y: random(100, 1000)  , w: 68,h: 160,ang : 13 + random(0,5), img: rojo },
    { x:random(100, 1000) , y: 1214 , w: 27,h: 138,ang : 29 + random(0,5), img: rojo },
  //rectangulo Amarillo 
    { x:107 , y:154 , w: 62,h: 97,ang : 29 + random(0,5) , img: amarillo},
    { x:random(100, 1000) , y:88 , w: 22,h: 113,ang : 35 + random(0,5) ,img: amarillo}, 
    { x:620 , y:162 , w: 184,h: 40,ang : 90 + random(0,5), img: amarillo}, 
    { x:random(100, 1000) , y:243 , w: 17,h: 48,ang : 95 + random(0,5) , img: amarillo}, 
    { x:572 , y:367 , w: 17,h: 196,ang : 95 + random(0,5) , img: amarillo}, 
    { x:random(100, 1000) , y:368, w: 17,h: 196,ang : 95 + random(0,5) , img: amarillo}, 
    { x:random(100, 1000) , y:823, w: 46,h: 148,ang : 95 + random(0,5), img: amarillo},
    { x:208 , y:random(100, 1000) , w: 50,h: 28,ang : 29 + random(0,5), img: amarillo}, 
    { x:random(100, 1000) , y:930, w: 126,h: 27,ang : 65 + random(0,5), img: amarillo}, 
    { x:658 , y:random(100, 1000) , w: 67,h: 21,ang : 65 + random(0,5), img: amarillo}, 
  // rectangulo Negro 
    { x:446 , y:random(100, 1000)  , w: 359,h: 62,ang : 16 + random(0,5), img: negro },   
    { x:293 , y:random(100, 1000)  , w: 22,h: 137,ang : 35  + random(0,5), img: negro },
    { x:random(100, 1000) , y:766 , w: 37,h: 261,ang : 29  + random(0,5), img: negro },
    { x:410 , y:random(100, 1000)  , w: 36,h: 360,ang : 29 + random(0,5), img: negro },
    { x:random(100, 1000) , y:874 , w: 27,h: 167,ang : 29 + random(0,5), img: negro },
    { x:532 , y:random(100, 1000)  , w: 10,h: 113,ang : 112 + random(0,5), img: negro },
    { x:random(100, 1000) , y:1100 , w: 10,h: 174,ang : 112 + random(0,5), img: negro },
    { x:174 , y:random(100, 1000)  , w: 39,h: 55,ang : 29 + random(0,5), img: negro },
  // rectangulo Azul 
    { x:random(100, 1000) , y:618 , w: 109,h:19 ,ang : 45 + random(0,5), img: azul },
    { x:280 , y:random(100, 1000)  , w: 83,h:19 ,ang : 109 + random(0,5), img: azul },
    { x:random(100, 1000) , y:1239 , w: 52,h:19 ,ang : 109 + random(0,5), img: azul },

];
// ==================== FIGURAS ====================

//Particulas agrupadas por tipo para darle las caracteristicas agrupadas. Ej: Color.
for (let s of square) {
  particles.push(new Particle(s.x, s.y, s.w, s.h, radians(s.ang), s.color, 'square',s.img));
}
for (let r of rectangle) {
  particles.push(new Particle(r.x, r.y, r.w, r.h, radians(r.ang), r.color, 'rect',r.img));
}
}

function draw() {

 image(fondo, -50, 0, 6200, 6200);
    let vol=mic.getLevel();
    gestorAmp.actualizar(vol);

    haySonido= gestorAmp.filtrada > 0.1;

let inicioElSonido=haySonido && !antesHabiaSonido;


//------------------------------------------------------

if(inicioElSonido){
  marcaT = millis();
}

if(gestorAmp.filtrada>limiteAgudoGrave){
  let tiempoTranscurrido = millis()-marcaT;
  // estoy haciendo un sonido - configuración del sonido
  if(gestorPitch.filtrada>limiteAgudoGrave){
  estado=tiempoTranscurrido>3?"sonidoAgudoProlongado":"sonidoAgudo";
}else{
    estado=tiempoTranscurrido>3?"sonidoGraveProlongado":"sonidoGrave";
  }
  
}
else{
  estado="sinMovimiento"
}
// termina configuración del sonido.
//------------------------------------------------------
//Dibuja particulas
for (let p of particles) {
  p.update();
  p.show();
}
//------------------------------------------------------
//configuración de estados-.
if (estado=="sonidoAgudo" || estado==="sonidoAgudoProlongado" ){
    let nposx=random(800);
    let nposy=random(800);
    nuevaUbicacion=true;

  for (let p of particles) {
    if (p.tipo === 'rect') {p.groupToCenter(nposx,nposy); }
  }
} else{

  for (let p of particles) {
      if (p.tipo === 'rect' && nuevaUbicacion) {p.newPosition(); }
  }
      nuevaUbicacion=false;
}

if (estado=="sonidoGrave" || estado==="sonidoGraveProlongado" ){
    for (let p of particles) {
        if (p.tipo === 'square') {p.explode(); }
    }
 } else{

  for (let p of particles) {
      if (p.tipo === 'square') {p. goBack(); }
  }

}

if (estado=="sonidoGraveProlongado"){
  let coloresBrillantes = [60, 120, 180, 240, 300];
    randomHue = random(coloresBrillantes);
}
// Fin configuracion estados.
//------------------------------------------------------
//inicio comentario de monitoreo
    if(monitoreo){
      gestorAmp.dibujar(100,100);
      gestorPitch.dibujar(100,300);
    }

  antesHabiaSonido=haySonido;
//fin comentario de monitoreo
}
//------------------------------------------------------
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
 setInterval(() => {
  pitch.getPitch((err, frequency) => {
    if (frequency) {
      let numeroDeNota= freqToMidi(frequency);
      gestorPitch.actualizar(numeroDeNota );
    }
  });
}, 200); //maneja la frecuencia de actualización del pitch
}
