var b = document.body;
var c = document.getElementsByTagName('canvas')[0];
var a = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;

var e = [];  // trails
var h = [];  // heart path
var v = 32;  // num trails, num particles per trail & num nodes in heart path
var M = Math;
var R = M.random;
var C = M.cos;
var Y = 6.3; // close to 44/7 or Math.PI * 2 - 6.3 seems is close enough.

for (var i = 0; i < Y; i += .2) { // Calculate heart nodes
  h.push([
    c.width / 2 + 180 * M.pow(M.sin(i), 3),
    c.height / 2 + 10 * (-(15 * C(i) - 5 * C(2 * i) - 2 * C(3 * i) - C(4 * i)))
  ]);
}

for (i = 0; i < v; i++) {
  var x = R() * c.width;
  var y = R() * c.height;
  var H = i / v * 80 + 280;
  var S = R() * 40 + 60;
  var B = R() * 60 + 20;

  var f = []; // create new trail

  var k = 0;
  while (k < v) { 
    f[k++] = { // create new particle
      x: x, // position 
      y: y,
      X: 0, // velocity
      Y: 0,
      R: (1 - k / v) + 1, // radius
      S: R() + 1, // acceleration 
      q: ~~(R() * v), // target node on heart path
      D: i % 2 * 2 - 1, // direction around heart path
      F: R() * .2 + .7, // friction
      f: "hsla(" + ~~H + "," + ~~S + "%," + ~~B + "%,.1)" // color
    };
  }

  e[i++] = f; // dots are a 2d array of trails x particles
}

function render(particle) {
  a.fillStyle = particle.f;
  a.beginPath();
  a.arc(particle.x, particle.y, particle.R, 0, Y, 1);
  a.closePath();
  a.fill();
}

function loop() {
  a.fillStyle = "rgba(0,0,0,.2)"; // clear screen
  a.fillRect(0, 0, c.width, c.height);

  var i = v;
  while (i--) {
    var f = e[i]; // get worm
    var u = f[0]; // get 1st particle of worm
    var q = h[u.q]; // get current node on heart path
    var D = u.x - q[0]; // calc distance
    var E = u.y - q[1];
    var G = M.sqrt((D * D) + (E * E));

    if (G < 10) { // has trail reached target node?
      if (R() > .95) { // randomly send a trail elsewhere
        u.q = ~~(R() * v);
      } else {
        if (R() > .99) u.D *= -1; // randomly change direction
        u.q += u.D;
        u.q %= v;
        if (u.q < 0) u.q += v;
      }
    }

    u.X += -D / G * u.S; // calculate velocity
    u.Y += -E / G * u.S;

    u.x += u.X; // apply velocity
    u.y += u.Y;

    render(u); // draw the first particle

    u.X *= u.F; // apply friction
    u.Y *= u.F;

    var k = 0;
    while (k < v - 1) { // loop through remaining dots
      var T = f[k]; // this particle
      var N = f[++k]; // next particle

      N.x -= (N.x - T.x) * .7; // use Zeno's paradox to create trail
      N.y -= (N.y - T.y) * .7;

      render(N);
    }
  }
} // eo loop()

(function doit() {
  requestAnimationFrame(doit);
  loop();
})();

// Message Interaction
const showMessageButton = document.getElementById("showMessageButton");
const messageTextElement = document.getElementById("messageText");

showMessageButton.addEventListener("click", () => {
  messageTextElement.innerText = "¡Mi Solecito Hermoshaaa! 💖";
});
