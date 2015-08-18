var game = document.createElement('canvas');
var map = document.createElement('canvas');

game.width = map.width = 1024;
game.height = map.height = 600;

document.body.appendChild(game);

var g_ctx = game.getContext('2d');
var m_ctx = map.getContext('2d');

D.Draw(map, m_ctx);

var last_stamp = 0;
function update(timestamp) {
  g_ctx.clearRect(0, 0, game.width, game.height);
  if(stats)
    stats.begin();

  g_ctx.drawImage(map, 0, 0);

  P.FLOOR_TILE.stamp(g_ctx, 10, 10);

  var dt = (timestamp - last_stamp)/1000;
  last_stamp = timestamp;

  if(stats)
    stats.end();

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
