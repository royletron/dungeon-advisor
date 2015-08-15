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
var oneChar = new Char('G', ROOM, ROOM_D);
var twoChar = new Char('F', WALL, WALL_D);
var threeChar = new Char('F', WALL_D, WALL_D);

Dungeon.Generate();

for(i=0; i < Math.ceil(canvas.width/CHAR_WIDTH); i++)
{
  for(j=1; j < Math.ceil(canvas.height/CHAR_HEIGHT) + 1; j++)
  {
    var tile = Dungeon.map[i][j];
    if(tile == 1)
      oneChar.render(i, j, mapContext);
    else if(tile == 2)
      twoChar.render(i, j, mapContext);
    else
      threeChar.render(i, j, mapContext);
  }
}

window.addEventListener('click', function (event) {
  var baddie = new Baddie((event.clientX/CHAR_WIDTH) - 1, (event.clientY/CHAR_HEIGHT) - 1, new Renderer([[new Char('@', '#EB7F98')]]));
  baddies.push(baddie);
});

context.fillStyle = '#28322A';
context.fillRect(0, 0, canvas.width, canvas.height);

setTimeout(function update() {

  buffer.clear();
  context.font = FONT;

  context.drawImage(map, 0, 0, 800, 600);

  baddies.forEach(function(baddie){
    baddie.update();
  });

  for(i=0; i < Math.ceil(canvas.width/CHAR_WIDTH); i++)
  {
    for(j=1; j < Math.ceil(canvas.height/CHAR_HEIGHT) + 1; j++)
    {
      var char = buffer.getItem(i, j);
      if(char !== null)
        char.render(i, j, context);
    }
  }
  var gravity = [0, 0];

  setTimeout(update, rate);
}, 0);
