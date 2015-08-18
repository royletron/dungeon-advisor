var Stats = require('../dev-libs/stats.min.js');

var game = document.createElement('canvas');
var map = document.createElement('canvas');

game.width = map.width = 1024;
game.height = map.height = 600;

document.body.appendChild(game);

var g_ctx = game.getContext('2d');
var m_ctx = map.getContext('2d');

D.Draw(map, m_ctx);

var menu = new Menu();

var last_stamp = 0;


var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

function update(timestamp) {
  g_ctx.clearRect(0, 0, game.width, game.height);
  if(stats)
    stats.begin();

  g_ctx.drawImage(map, 0, 0);

  // P.FLOOR_TILE.stamp(g_ctx, 10, 10);

  menu.stamp(g_ctx, 27, 0);

  var dt = (timestamp - last_stamp)/1000;
  last_stamp = timestamp;

  if(stats)
    stats.end();

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
