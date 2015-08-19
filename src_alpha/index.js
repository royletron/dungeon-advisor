var rate = 1000 / 60;
var start = Date.now();


var buffer = {
  data: {},
  addItem: function(x, y, item) {
    if(this.data[x] === undefined)
      this.data[x] = {};
    this.data[x][y] = item;
  },
  getItem: function(x, y) {
    if(this.data[x] === undefined)
      return null;
    if(this.data[x][y] === undefined)
      return null;
    return this.data[x][y];
  },
  clear: function() {
    this.data = {};
  }
};

var canvas = document.createElement('canvas');
var map = document.createElement('canvas');

canvas.width = map.width = 1024;
canvas.height = map.height = 600;

document.body.appendChild(canvas);

var context = canvas.getContext('2d');
var mapContext = map.getContext('2d');
var baddies = [];

var defaultChar = new Char('~', '#DCBB88');
var floorChar = new Char('∵', FLOOR, FLOOR_D);
var wallChar = new Char('⊡', WALL, WALL_D);
var tbChar = new Char('┃', WALL, WALL_D);
var lrChar = new Char('━', WALL, WALL_D);
var trChar = new Char('┗', WALL, WALL_D);
var tlChar = new Char('┛', WALL, WALL_D);
var blChar = new Char('┓', WALL, WALL_D);
var brChar = new Char('┏', WALL, WALL_D);

var voidChar = new Char('F', WALL_D, WALL_D);

var cursorChar = new Char('⨁', CURSOR, CURSOR_D, 0.2);

var MENU = new Menu();

Dungeon.Generate();

for(i=0; i < Math.ceil(canvas.width/CHAR_WIDTH); i++)
{
  for(j=0; j < Math.ceil(canvas.height/CHAR_HEIGHT) + 1; j++)
  {
    var tile = Dungeon.map[i][j];
    if(tile == 1)
      floorChar.render(i, j, mapContext);
    else if(tile == 2)
    {
      var t = Dungeon.map[i][j-1] == 2 || false, b = Dungeon.map[i][j+1] == 2 || false, l = false, r = false;
      if(Dungeon.map[i-1] !== undefined)
        l = Dungeon.map[i-1][j] == 2;
      if(Dungeon.map[i+1] !== undefined)
        r = Dungeon.map[i+1][j] == 2;

      if((t || b) && !r && !l)
        tbChar.render(i, j, mapContext);

      if(!t && !b && (r || l))
        lrChar.render(i, j, mapContext);

      if(t && r)
        trChar.render(i, j, mapContext);
      if(t && l)
        tlChar.render(i, j, mapContext);
      if(b && l)
        blChar.render(i, j, mapContext);
      if(b && r)
        brChar.render(i, j, mapContext);
      if(l && r)
        lrChar.render(i, j, mapContext);
      if(t && b)
        tbChar.render(i, j, mapContext);
    }
    else
      voidChar.render(i, j, mapContext);
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor((evt.clientX - rect.left) / CHAR_WIDTH),
    y: Math.floor((evt.clientY - rect.top) / CHAR_HEIGHT)
  };
}

canvas.addEventListener('click', function (event) {
  var mousePos = getMousePos(canvas, event);
  var baddie = new Baddie(mousePos.x, mousePos.y, new Renderer([[new Char('@', '#EB7F98', '#0DF3F3')]]));
  baddies.push(baddie);
});

var movePos;

canvas.addEventListener('mousemove', function(event) {
  movePos = getMousePos(canvas, event);
});

canvas.addEventListener('mouseout', function(event) {
  movePos = null;
});



var last_stamp = 0;
function update(timestamp) {
  context.fillStyle = '#2CA9AD';
  context.fillRect(0, 0, canvas.width, canvas.height);
  if(stats)
    stats.begin();

  var dt = (timestamp - last_stamp)/1000;
  last_stamp = timestamp;

  buffer.clear();
  context.font = FONT;

  context.drawImage(map, 0, 0);

  baddies.forEach(function(baddie){
    baddie.update(dt, context);
  });

  MENU.render(context);

  for(i=0; i < Math.ceil(canvas.width/CHAR_WIDTH); i++)
  {
    for(j=0; j < Math.ceil(canvas.height/CHAR_HEIGHT); j++)
    {
      var char = buffer.getItem(i, j);
      if(char !== null)
        char.render(i, j, context);
    }
  }

  if(movePos)
    cursorChar.render(movePos.x, movePos.y, context);

  if(stats)
    stats.end();

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
