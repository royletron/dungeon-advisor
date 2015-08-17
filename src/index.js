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

canvas.width = map.width = 800;
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

window.addEventListener('click', function (event) {
  var baddie = new Baddie((event.clientX/CHAR_WIDTH) - 1, (event.clientY/CHAR_HEIGHT) - 1, new Renderer([[new Char('@', '#EB7F98', '#0DF3F3')]]));
  baddies.push(baddie);
});

context.fillStyle = '#28322A';
context.fillRect(0, 0, canvas.width, canvas.height);

var last_stamp = 0;
function update(timestamp) {
  if(stats)
    stats.begin();

  var dt = (timestamp - last_stamp)/1000;
  last_stamp = timestamp;

  buffer.clear();
  context.font = FONT;

  context.drawImage(map, 0, 0, 800, 600);

  baddies.forEach(function(baddie){
    baddie.update(dt);
  });

  for(i=0; i < Math.ceil(canvas.width/CHAR_WIDTH); i++)
  {
    for(j=0; j < Math.ceil(canvas.height/CHAR_HEIGHT) + 1; j++)
    {
      var char = buffer.getItem(i, j);
      if(char !== null)
        char.render(i, j, context);
    }
  }
  window.requestAnimationFrame(update);

  if(stats)
    stats.end();
}

window.requestAnimationFrame(update);
