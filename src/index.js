var Stats = require('../dev-libs/stats.min.js');

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

H.GenerateStamps();

// D.Draw(map, m_ctx);

UI.init(m_ctx);

var menu = new Menu(' OBJECTS ');

global.CALLBACKS = [];

global.PUSH_CALLBACK = function(cb) {
  CALLBACKS.push(cb);
};

global.POP_CALLBACK = function(cb) {
  CALLBACKS = H.RemoveFromArray(CALLBACKS, cb);
};

var last_stamp = 0;

var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

function update(timestamp) {
  if(stats)
    stats.begin();

  if(ACTIVE) {
    g_ctx.fillStyle = '#25989B';
    g_ctx.fillRect(0, 0, GAME.width, GAME.height);
    var dt = (timestamp - last_stamp)/1000;
    last_stamp = timestamp;

    dt = dt * TIME;
    CALLBACKS.forEach(function(cb){
      cb(dt);
    });

    Physics.update(dt);
    UI.update(dt);

    UI.draw();
    //g_ctx.drawImage(map, 0, 0);
    // P.FLOOR_TILE.stamp(g_ctx, 10, 10);

    // menu.stamp(g_ctx, 27, 0);
  }

  if(stats)
    stats.end();

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
