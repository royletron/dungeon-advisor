var FLOOR = '#8B9899';
var WALL = '#6D7A80';
var WALL_D = '#626E72';
var FLOOR_D = '#7D8989';
var CURSOR = '#2D4787';
var CURSOR_D = '#00CCFF';
var FONT = '14px Courier';
var CHAR_WIDTH = 14;
var CHAR_HEIGHT = 13;

var Helpers = {
    GetRandom: function (low, high) {
        return~~ (Math.random() * (high - low)) + low;
    },
    BufferToCoords: function(x, y) {
      return {x: x*CHAR_WIDTH, y: y*CHAR_HEIGHT};
    },
    CoordsToBuffer: function(x, y) {
      return {x: Math.floor(x/CHAR_WIDTH), y: Math.floor(y/CHAR_HEIGHT)};
    },
    MakeBox: function(title, width, height){
      var str = '';
      title = ' '+title+' ';
      var ts = ((width - title.length)/2);
      for(var i=0; i < width; i++){
        console.log(i);
        if(i === 0)
          str += '┏';
        else if(i === (width - 1))
          str = str + '┓';
        else if(i < ts)
          str = str + '━';
        else if(i > (ts + title.length - 1))
          str = str + '━';
        else
          str = str + title[i-ts];
      }
      for(var j = 0; j < height; j++)
      {
        str = str+'\n';
        for(var k = 0; k < width; k++)
        {
          if((k === 0) || (k === (width - 1)) && (j != (height-1)))
            str = str + '┃';
          else if((k === (width - 1)) && (j === (height - 1)))
            str = str + '┛';
          else if((k === 0) && (j === (height-1)))
            str = str + '┗';
          else
            str = str + ' ';
        }
      }
      return str;
    }
};

// '┏━━━━━━ MENU ━━━━━━┓ \n┃                  ┃ \n\n\n\n\n\n\n\n
var Dungeon = {
    map: null,
    map_size: 164,
    rooms: [],
    Generate: function () {
        this.map = [];
        for (var x = 0; x < this.map_size; x++) {
            this.map[x] = [];
            for (var y = 0; y < this.map_size; y++) {
                this.map[x][y] = 0;
            }
        }

        var room_count = Helpers.GetRandom(10, 50);
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
            if (!((room.x + room.w + 1 < check.x) || (room.x - 1 > check.x + check.w) || (room.y + room.h + 1 < check.y) || (room.y - 1 > check.y + check.h))) return true;
        }

        return false;
    }
};
