var rate = 100 / 100;
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

canvas.width = 800;
canvas.height = 600;

document.body.appendChild(canvas);

var context = canvas.getContext('2d');
var baddies = [];

Dungeon.Generate();

var defaultChar = new Char('~', '#DCBB88');
var oneChar = new Char('G', ROOM, ROOM_D);
var twoChar = new Char('F', WALL, WALL_D);
var threeChar = new Char('F', WALL_D, WALL_D);

window.addEventListener('click', function (event) {
  var baddie = new Baddie((event.clientX/CHAR_WIDTH) - 1, event.clientY/CHAR_HEIGHT, new Renderer([[new Char('@', '#EB7F98')]]));
  baddies.push(baddie);
});

setTimeout(function update() {

  buffer.clear();

  context.fillStyle = '#28322A';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = FONT;

  baddies.forEach(function(baddie){
    baddie.update();
  });

  for(i=0; i < Math.ceil(canvas.width/CHAR_WIDTH); i++)
  {
    for(j=1; j < Math.ceil(canvas.height/CHAR_HEIGHT) + 1; j++)
    {
      var char = buffer.getItem(i, j);
      if(char !== null)
        char.render(i, j);
      else
      {
        var tile = Dungeon.map[i][j];
        if(tile == 1)
          oneChar.render(i, j);
        else if(tile == 2)
          twoChar.render(i, j);
        else
          threeChar.render(i, j);
      }
    }
  }
  var gravity = [0, 0];

  setTimeout(update, rate);
}, 0);
