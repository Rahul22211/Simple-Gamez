let lander, pad, running = true, autopilotOn = true;

function setup(){
  createCanvas(900, 600);
  const ui = select('#ui'); 
  ui.html('<b>Lunar Lander — Autopilot</b><br>Press A to toggle autopilot<br>Press R to reset');
  resetGame();
}

function resetGame(){
  lander = { x: width*0.2, y: 80, vx: 1.6, vy: 0, ax: 0, ay: 0, fuel: 120, alive: true, won: false };
  pad = { x: width*0.65, w: 140, y: height-40 };
  running = true;
}

function keyPressed(){
  if (key === 'A') autopilotOn = !autopilotOn;
  if (key === 'R') resetGame();
  if (key === 'S') saveCanvas('lunar_lander', 'png');
}

// === Physics ===
function physicsStep(){
  applyGravity();
  if (!autopilotOn) handleManualControl();
  integrateMotion();
  checkGroundCollision();
}

function applyGravity(){ lander.ay += 0.06; }

function handleManualControl(){
  if (lander.fuel <= 0) return;
  if (keyIsDown(UP_ARROW)) applyThrust(0, -0.18, 0.5);
  if (keyIsDown(LEFT_ARROW)) applyThrust(-0.06, 0, 0.2);
  if (keyIsDown(RIGHT_ARROW)) applyThrust(0.06, 0, 0.2);
}

function applyThrust(ax, ay, fuelCost){
  lander.ax += ax; lander.ay += ay; lander.fuel -= fuelCost;
}

function integrateMotion(){
  lander.vx += lander.ax; lander.vy += lander.ay;
  lander.x  += lander.vx; lander.y  += lander.vy;
  lander.ax = 0; lander.ay = 0;
}

function checkGroundCollision(){
  if (lander.y < height-20) return;
  lander.y = height-20;

  const vx = abs(lander.vx), vy = abs(lander.vy);
  const onPad = lander.x > pad.x && lander.x < pad.x+pad.w;

  if (vx < 1.2 && vy < 1.8 && onPad) lander.won = true;
  else lander.alive = false;

  running = false;
}

// === Autopilot ===
function autopilot(state){
  let thrust = { up:false, left:false, right:false };
  if (state.fuel <= 0) return thrust;

  applyHorizontalControl(state, thrust);
  applyVerticalControl(state, thrust);
  return thrust;
}

function applyHorizontalControl(state, thrust){
  const dx = state.padCenterX - state.x;
  const vx = state.vx;
  if (abs(dx) > 50) correctCourseTowardPad(dx, thrust);
  else dampHorizontalVelocity(vx, thrust);
}

function correctCourseTowardPad(dx, thrust){
  if (dx > 0) thrust.right = true;
  if (dx < 0) thrust.left = true;
}

function dampHorizontalVelocity(vx, thrust){
  if (vx > 0.6) thrust.left = true;
  if (vx < -0.6) thrust.right = true;
}

function applyVerticalControl(state, thrust){
  const safeVy = map(state.y, 0, height, 1.0, 2.0);
  if (state.vy > safeVy) thrust.up = true;
}

function applyAutopilot(){
  const st = {
    x: lander.x, y: lander.y, vx: lander.vx, vy: lander.vy,
    fuel: lander.fuel, padCenterX: pad.x + pad.w/2
  };
  const t = autopilot(st);
  if (t.up && lander.fuel>0) applyThrust(0, -0.18, 0.5);
  if (t.left && lander.fuel>0) applyThrust(-0.06, 0, 0.2);
  if (t.right && lander.fuel>0) applyThrust(0.06, 0, 0.2);
}

// === Draw ===
function draw(){
  background(10);
  drawStars();
  drawPad();

  if (running){
    if (autopilotOn) applyAutopilot();
    physicsStep();
  }

  drawLander();
  drawHUD();
}

function drawStars(){
  stroke(255,120);
  for(let i=0;i<80;i++){ point((i*73)%width, (i*29)%height*0.5); }
}

function drawPad(){
  noStroke(); fill(40,180,80); rect(pad.x, pad.y, pad.w, 6);
}

function drawLander(){
  push();
  translate(lander.x, lander.y);
  fill(240); rectMode(CENTER); rect(0,0,26,18,4);
  fill(200); rect(0,10,18,6,2);
  if (lander.ay < 0){ fill(255,150,0); triangle(-6,9, 0, 22+random(4), 6,9); }
  pop();
}

function drawHUD(){
  fill(255); textSize(14); textAlign(LEFT);
  text(`vx:${nf(lander.vx,1,2)} vy:${nf(lander.vy,1,2)} fuel:${nf(lander.fuel,1,0)} mode:${autopilotOn?'AUTO':'MANUAL'}`, 10, 20);

  if (!running){
    textAlign(CENTER); textSize(28);
    if (lander.won){ fill(120,255,120); text('SOFT LANDING! ✅', width/2, height/2); }
    else { fill(255,120,120); text('CRASH! 💥', width/2, height/2); }
    textSize(16); fill(255); text("Press R to retry • Toggle autopilot with A", width/2, height/2+26);
  }
}
