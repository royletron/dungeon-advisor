// var Stats = require('../dev-libs/stats.min.js');

var map = document.createElement('canvas');

GAME.width = map.width = 1026;
GAME.height = map.height = 602;

global.TIME = 1;
global.ACTIVE = true;

window.addEventListener('focus', function() {
  ACTIVE = true;
});

window.addEventListener('blur', function() {
  ACTIVE = false;
});


document.body.appendChild(GAME);

global.g_ctx = GAME.getContext('2d');
global.m_ctx = map.getContext('2d');

g_ctx.imageSmoothingEnabled = m_ctx.imageSmoothingEnabled = false;

H.GenerateStamps();

// D.Draw(map, m_ctx);

UI.init(m_ctx);
HELP.init();

global.CALLBACKS = new Array();
var c_id = 0

global.PUSH_CALLBACK = function(cb) {
  c_id ++;
  CALLBACKS.push({f: cb, i: c_id});
  return {f: cb, i: c_id};
};

global.POP_CALLBACK = function(cb) {
  H.RemoveFromArray(CALLBACKS, cb, 'i');
};

var last_stamp = 0;

// var stats = new Stats();
// stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.left = '0px';
// stats.domElement.style.top = '0px';

// document.body.appendChild( stats.domElement );

function update(timestamp) {
  // if(stats)
  //   stats.begin();

  var dt = (timestamp - last_stamp)/1000;
  last_stamp = timestamp;

  if(ACTIVE) {
    g_ctx.fillStyle = '#25989B';
    g_ctx.fillRect(0, 0, GAME.width, GAME.height);

    dt = dt * TIME;

    // Physics.update(dt);
    UI.update(dt);

    UI.draw();

    if(CALLBACKS)
      CALLBACKS.forEach(function(cb){
        cb.f(dt);
      });
    H.MouseClick = false;
  }

  // if(stats)
  //   stats.end();

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
