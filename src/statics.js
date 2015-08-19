global.FONT = '16px Courier';
global.CHAR_WIDTH = 9;
global.CHAR_HEIGHT = 14;
global.WALL = '6D7A80';
global.WALL_B = '626E72';
global.BOX = '102E34';
global.BOX_B = '9BC955';

global.GAME = document.createElement('canvas');

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
  ENTRANCE: {p: '63545E 302222 C3F83C', d: '═01╦01═01═01═01╦01═01═01═01╦01═01═01═01╦01═01═01═01═01═01╦01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01 01◌01 01░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░01░01░01 01◌01 01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░01░01░01 01◌01 01░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░01░01░01░01░01░01░01 01◌01 01░01░01░01░01║01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01║01░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01 01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01░01 01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01', w: 20, h:10},
  OUTDOOR: {p: '2CA9AD 25989B ADDADE FFFFFF 9BC560', d: ' 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11╱31╲31 11 11 11 11 11 11 11 11 11 11 11╱31 33 33╲31╱31╲31 11 11 11 11 11 11 11╱31 33 33 33 33 33 33╲31 11 11 11 11 11╱31 33 33 33 33 33 33 33 33 33╲31 11╥41 11', w:14, h:5}
};


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
  GetRandomEntry: function(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  },
  GetRandom: function (low, high) {
      return~~ (Math.random() * (high - low)) + low;
  },
  BufferToCoords: function(x, y) {
    return {x: parseInt(x)*CHAR_WIDTH, y: parseInt(y)*CHAR_HEIGHT};
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
    var renderer = new Renderer(spr.w*CHAR_WIDTH, spr.h*CHAR_HEIGHT);
    this.StampSprite(renderer.context, 0, 0, spr);
    return renderer;
  },
  GenerateStamps: function() {
    for (var key in S) {
      if (S.hasOwnProperty(key)) {
        S[key].stamp = this.GenerateStamp(S[key]);
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
