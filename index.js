var rate = 100 / 100;
var start = Date.now();
var font = '16px Courier New';
var charwidth = 10;
var charheight = 12;

var Dungeon = {
    map: null,
    map_size: 64,
    rooms: [],
    Generate: function () {
        this.map = [];
        for (var x = 0; x < this.map_size; x++) {
            this.map[x] = [];
            for (var y = 0; y < this.map_size; y++) {
                this.map[x][y] = 0;
            }
        }

        var room_count = Helpers.GetRandom(10, 20);
        var min_size = 5;
        var max_size = 15;

        for (var i = 0; i < room_count; i++) {
            var room = {};

            room.x = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.y = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.w = Helpers.GetRandom(min_size, max_size);
            room.h = Helpers.GetRandom(min_size, max_size);

            if (this.DoesCollide(room)) {
                i--;
                continue;
            }
            room.w--;
            room.h--;

            this.rooms.push(room);
        }

        this.SquashRooms();

        for (i = 0; i < room_count; i++) {
            var roomA = this.rooms[i];
            var roomB = this.FindClosestRoom(roomA);

            pointA = {
                x: Helpers.GetRandom(roomA.x, roomA.x + roomA.w),
                y: Helpers.GetRandom(roomA.y, roomA.y + roomA.h)
            };
            pointB = {
                x: Helpers.GetRandom(roomB.x, roomB.x + roomB.w),
                y: Helpers.GetRandom(roomB.y, roomB.y + roomB.h)
            };

            while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
                if (pointB.x != pointA.x) {
                    if (pointB.x > pointA.x) pointB.x--;
                    else pointB.x++;
                } else if (pointB.y != pointA.y) {
                    if (pointB.y > pointA.y) pointB.y--;
                    else pointB.y++;
                }

                this.map[pointB.x][pointB.y] = 1;
            }
        }

        for (i = 0; i < room_count; i++) {
            var room = this.rooms[i];
            for (var x = room.x; x < room.x + room.w; x++) {
                for (var y = room.y; y < room.y + room.h; y++) {
                    this.map[x][y] = 1;
                }
            }
        }

        for (var x = 0; x < this.map_size; x++) {
            for (var y = 0; y < this.map_size; y++) {
                if (this.map[x][y] == 1) {
                    for (var xx = x - 1; xx <= x + 1; xx++) {
                        for (var yy = y - 1; yy <= y + 1; yy++) {
                            if (this.map[xx][yy] == 0) this.map[xx][yy] = 2;
                        }
                    }
                }
            }
        }
    },
    FindClosestRoom: function (room) {
        var mid = {
            x: room.x + (room.w / 2),
            y: room.y + (room.h / 2)
        };
        var closest = null;
        var closest_distance = 1000;
        for (var i = 0; i < this.rooms.length; i++) {
            var check = this.rooms[i];
            if (check == room) continue;
            var check_mid = {
                x: check.x + (check.w / 2),
                y: check.y + (check.h / 2)
            };
            var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
            if (distance < closest_distance) {
                closest_distance = distance;
                closest = check;
            }
        }
        return closest;
    },
    SquashRooms: function () {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < this.rooms.length; j++) {
                var room = this.rooms[j];
                while (true) {
                    var old_position = {
                        x: room.x,
                        y: room.y
                    };
                    if (room.x > 1) room.x--;
                    if (room.y > 1) room.y--;
                    if ((room.x == 1) && (room.y == 1)) break;
                    if (this.DoesCollide(room, j)) {
                        room.x = old_position.x;
                        room.y = old_position.y;
                        break;
                    }
                }
            }
        }
    },
    DoesCollide: function (room, ignore) {
        for (var i = 0; i < this.rooms.length; i++) {
            if (i == ignore) continue;
            var check = this.rooms[i];
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
        }

        return false;
    }
}

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
var balls = [];

function Char (symbol, color) {
    this.symbol = symbol;
    this.color = color;
    this.render = function(x, y) {
      context.fillStyle = this.color;
      context.fillText(this.symbol, x * charwidth, y * charheight);
    };
}

function Renderer (chars) {
  this.chars = chars;
  this.update = function(this_x, this_y){
    chars.forEach(function (row, y) {
      row.forEach(function (column, x) {
        if(column !== undefined)
          buffer.addItem(x + this_x, y + this_y, column);
      });
    });
  };
}

function Boat (x, y) {
  this.x = x;
  this.y = y;
  this.renderer = new Renderer([
    [undefined, new Char('@', '#998888'), undefined],
    [new Char('@', '#121212'), new Char('@', '#121212'), new Char('@', '#121212')],
  ]);
  this.update = function() {
    this.renderer.update(Math.floor(this.x), Math.floor(this.y));
  };
}

Dungeon.Generate()

var defaultChar = new Char('~', '#DCBB88');
var oneChar = new Char('██', '#FFFFFF');
var twoChar = new Char('██', '#000000');

balls.push({
  position: [canvas.width / 2, canvas.height / 2],
  velocity: [0, 0],
});

window.addEventListener('click', function (event) {
  balls.push({
    position: [event.clientX, event.clientY],
    velocity: [0, 0],
    radius: 25,
    elasticity: 0.5,
  });
});

var boat = new Boat(10, 10);

setTimeout(function update() {

  buffer.clear();
  boat.x = boat.x + 0.1;
  boat.y = boat.y + 0.01;
  boat.update();

  context.fillStyle = '#28322A';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = font;

  for(i=0; i < Math.ceil(canvas.width/charwidth); i++)
  {
    for(j=1; j < Math.ceil(canvas.height/charheight) + 1; j++)
    {
      var char = buffer.getItem(i, j);
      if(char !== null)
        char.render(i, j);
      else
      {
        var tile = Dungeon.map[i][j];
        if(tile == 1)
          oneChar.render(i, j)
        else
          twoChar.render(i, j);
      }
    }
  }
  var gravity = [0, 0];

  context.fillStyle = '#8A938C';

  var seconds = (Date.now() - start) / 1000;

  context.fillText(seconds.toFixed(3) + 's', 0, 16);

  setTimeout(update, rate);
}, 0);
