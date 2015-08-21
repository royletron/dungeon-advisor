global.FONT = '16px Courier';
global.CHAR_WIDTH = 9;
global.CHAR_HEIGHT = 14;
global.ROOM_WIDTH = 20;
global.ROOM_HEIGHT = 10;
global.WALL = '6D7A80';
global.WALL_B = '626E72';
global.BOX = 'FFE9EB';
global.BOX_B = '594B54';

global.GAME = document.createElement('canvas');

global.N = {
  names: ['Tom', 'Thomas', 'Brian', 'Bobby', 'Boromir', 'Budgergy', 'Bobbin', 'Bilbo', 'Bonzo', 'Bongo', 'Calvin', 'Capitan', 'Mr White', 'Jack', 'John', 'Shirley', 'Jonty', 'Monty', 'Cresswell', 'Burgermeister', 'Royletron', 'Timon', 'Aladdin', 'Adolf', 'Tony', 'Antony', 'Finn', 'Jake', 'Peter', 'Pete', 'Pele', 'Persius', 'Ponyo', 'Pogo', 'Serj', 'Sergey', 'Samir', 'Todmorden', 'Kevin'],
  Random: function() {
    return H.GetRandomEntry(this.names);
  }
}

global.E = {
  weapons: [
    {name: 'Shortsword', symbol: '}', damage: 3, range: 3, code: 'ss', color: '00FF00', offsetx: 0.6, top: -0.5, bottom: -0.35},
    {name: 'Longsword', symbol: '|', strike: '/', damage: 4, range: 3, code: 'ls', color: 'A7FBEB', offsetx: 0.7, top: - 0.45, bottom: -0.2},
    {name: 'Small Axe', symbol: '>', damage: 4, range: 1, code: 'sa', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3}
  ],
  heroes: [
    {name: 'Knight', symbol: '$', lvl_range: {t: 50, b: 1}, weapons: ['ls', 'ss'], speed: {t: 1.5, b: 0.7}, color: 'FFE9BA'},
    {name: 'Dwarf', symbol: 'D', lvl_range: {t: 55, b: 1}, weapons: ['sa'], speed: {t: 1.1, b: 0.6}, color: 'FFE9AA'}
  ],
  enemies: {

  },
  GetRandomWeapon: function(choice) {
    var w = [];
    choice.forEach(function (c){
      w.push(this.GetWeapon(c))
    }.bind(this));
    return H.GetRandomEntry(w);
  },
  GetWeapon: function(code) {
    var w;
    this.weapons.forEach(function(c){
      if(c.code == code) w = c;
    });
    return w;
  },
  GetRandomHero: function(lvl) {
    var h = [];
    this.heroes.forEach(function(c){
      if(c.lvl_range.b <= lvl)
        h.push(c)
    })
    return new Hero(UI.spawn_point.x, UI.spawn_point.y, H.GetRandomEntry(h));
  }
}

global.P = {
  randomSolid: function(){ return H.GetRandomEntry(this.SOLID_TILES); },
  SOLID_TILES: [new Char('∵', '84596F', '594B54'), new Char('#', '84596F', '594B54'), new Char('*', '84596F', '594B54')],

  BOX_TB: new Char('┃', BOX, BOX_B),
  BOX_LR: new Char('━', BOX, BOX_B),
  BOX_TR: new Char('┗', BOX, BOX_B),
  BOX_TL: new Char('┛', BOX, BOX_B),
  BOX_BL: new Char('┓', BOX, BOX_B),
  BOX_BR: new Char('┏', BOX, BOX_B),
  BOX_MD: new Char(' ', BOX, BOX_B),

  VOID: new Char(' ', '302222', '302222')
};

global.S = {
  ENTRANCE: {p: '63545E 302222 C3F83C 493B23 998D2D FEF441', d: '═01╦01═01═01═01╦01═01═01═01╦01═01═01═01╦01═01═01═01═01═01╦01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░03◌54░03░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░03░01░01░03◌54░03░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░03░01░01░03◌54░03░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░01░01░01░01░03░01░01░03◌54░03░01░01░01░01║01░01░01░01░01░01░01░01░01░01░01░01░01░01░03░01░01░01░01░01║01░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01 01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01 01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01', w: 20, h:10},
  SEWER: {p: '63545E 302222 9AE2A8 374332 58442C 794425 FEF441', d:'═01═01═01═01═01═01═01═01═01═01═01═01═01┉01═01═01═01═01═01╤01▙01 01 01 01 01 01 01 01◌51 01 01 01 01◜51◝51 01 01 01▜01│01 01 01 01◎16 01 01 01 01▒21 01 01 01 01◟51◞51 01 01◎16 01│01 01 01 01▼51 01 01 01 01▒21 01◉06 01 01▞01 01 01 01▼51 01│01 01 01 01 01 01 01 01 01▒21 01▼51 01 01▚01 01 01 01 01 01│01 01 01▞01 01 01 01 01 01░21 01 01 01 01 01▚01 01▞01 01 01│01 01▞01 01 01 01 01 01 01░21 01 01 01 01 01 01▛01 01 01 01┆01 01 01 01 01 01 01 01 01░21 01 01 01 01 01▞01 01 01 01 01 01 01 01 01 01 01 01 01 01◒21 01 01 01 01 01 01 01 01 01 01 01┄01┅01┄01┉01┅01┉01┄01┉01┄01┉01┅01┈01┄01┉01┅01┉01┄01┉01┉01┈01', w: 20, h:10},
  OUTDOOR: {p: '2CA9AD 25989B ADDADE FFFFFF 9BC560', d: ' 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11╱31╲31 11 11 11 11 11 11 11 11 11 11 11╱31 33 33╲31╱31╲31 11 11 11 11 11 11 11╱31 33 33 33 33 33 33╲31 11 11 11 11 11╱31 33 33 33 33 33 33 33 33 33╲31 11╥41 11', w:14, h:5}
};

global.R = {
  ENTRANCE: {cost: 100, stamp: S.ENTRANCE},
  SEWER: {cost: 70, stamp: S.SEWER}
}


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return H.CoordsToBuffer(evt.clientX - rect.left, evt.clientY - rect.top);
}

GAME.addEventListener('mousemove', function(event) {
  H.MouseCoords = getMousePos(GAME, event);
});

GAME.addEventListener('mouseout', function(event) {
  H.MouseCoords = null;
  H.MouseDown = false;
});

GAME.addEventListener('mousedown', function(event) {
  H.MouseDown = true;
});

GAME.addEventListener('mouseup', function(event) {
  H.MouseDown = false;
});

global.H = {
  MouseCoords: null,
  MouseDown: false,
  CharToNum: function(char) {
    var c = char.charCodeAt(0) - 48;
    if(c > 9) c = c - 7;
    return c;
  },
  Null: function(item) {
    item = null;
  },
  GetRandomEntry: function(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  },
  GetRandom: function (low, high) {
      return~~ (Math.random() * (high - low)) + low;
  },
  EachValueKey: function(obj, cb){
    for(var k in obj)
    {
      if(obj.hasOwnProperty(k))
        cb(k);
    }
  },
  BufferToCoords: function(x, y, whole) {
    if(whole || (whole === undefined))
      return {x: parseInt(x)*CHAR_WIDTH, y: parseInt(y)*CHAR_HEIGHT};
    else
      return {x: x*CHAR_WIDTH, y: y*CHAR_HEIGHT};
  },
  RemoveFromArray: function(arr, item) {
    var _tmp = [];
    arr.forEach(function(a){
      if (a !== item) _tmp.push(a);
    });
    return _tmp;
  },
  CoordsToBuffer: function(x, y) {
    return {x: Math.floor(x/CHAR_WIDTH), y: Math.floor(y/CHAR_HEIGHT)};
  },
  MakeBox: function(width, height, context){
    for(var x=0; x < width; x++)
    {
      for(var y=0; y < height; y++)
      {
        if(y === 0)
          if(x === 0)
            P.BOX_BR.stamp(context, x, y);
          else if(x == (width-1))
            P.BOX_BL.stamp(context, x, y);
          else
            P.BOX_LR.stamp(context, x, y);
        else if(y == (height-1))
          if(x === 0)
            P.BOX_TR.stamp(context, x, y);
          else if(x == (width-1))
            P.BOX_TL.stamp(context, x, y);
          else
            P.BOX_LR.stamp(context, x, y);
        else
          if((x === 0) || (x == (width-1)))
            P.BOX_TB.stamp(context, x, y);
          else
            P.BOX_MD.stamp(context, x, y);
      }
    }
  },
  GenerateStamp: function(spr) {
    var original = new Renderer(spr.w*CHAR_WIDTH, spr.h*CHAR_HEIGHT);
    var reverse = new Renderer(spr.w*CHAR_WIDTH, spr.h*CHAR_HEIGHT);
    this.StampSprite(original.context, 0, 0, spr);
    reverse.context.scale(-1, 1);
    this.StampSprite(reverse.context, -20, 0, spr);
    return {original: original, reverse: reverse};
  },
  GenerateStamps: function() {
    for (var key in S) {
      if (S.hasOwnProperty(key)) {
        var stamp = this.GenerateStamp(S[key]);
        S[key].stamp = stamp.original;
        S[key].reverse = stamp.reverse;
      }
     }
  },
  StampSprite: function(renderer, x, y, spr) {
    var d = spr.d.split('');
    var p = spr.p.split(' ');
    for(var tx=0; tx < spr.w; tx++) {
      for(var ty=0; ty < spr.h; ty++) {
        var l = (ty*spr.w*3) + (tx*3);
        var c = new Char(d[l], p[this.CharToNum(d[l+1])], p[this.CharToNum(d[l+2])]);
        c.stamp(renderer, x + tx, y + ty);
      }
    }
  },
  StampText: function(renderer, x, y, text, color, bg, alpha) {
    text.split("").forEach(function(symbol, index){
      var char = new Char(symbol, color, bg, alpha);
      char.stamp(renderer, x+index, y);
      char = null;
    });
  }
};
