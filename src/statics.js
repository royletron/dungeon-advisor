global.FONT = '16px Courier New';
global.STATUS_FONT = '13px Courier New';
global.HEADING_FONT = '30px Courier New';
global.CHAR_WIDTH = 9;
global.CHAR_HEIGHT = 14;
global.ROOM_WIDTH = 20;
global.ROOM_HEIGHT = 9;
global.WALL = '6D7A80';
global.WALL_B = '626E72';
global.BOX = 'FFE9EB';
global.BOX_B = '594B54';
global.RIGHT = 'r';
global.LEFT = 'l';


global.H = {
  MouseCoords: null,
  MouseDown: false,
  MouseUp: false,
  MouseClick: false,
  _clicked: false,
  WriteText: function(text, x, y, ctx, font, color, align) {
    ctx.font = font;
    ctx.fillStyle = '#'+color;
    ctx.textAlign = align || 'left';
    ctx.fillText(text, x, y);
  },
  DrawRect: function(x, y, width, height, ctx, fill) {
    ctx.fillStyle = '#'+fill;
    ctx.fillRect(x, y, width, height);
  },
  CharToNum: function(char) {
    var c = char.charCodeAt(0) - 48;
    if(c > 9) c = c - 7;
    return c;
  },
  DoMath: function(m, x, c) {
    var x = parseInt(x)/MAX_LVL;
    return Math.floor(parseInt(c) + (parseInt(m)*((x * (2-x))) * 20));
  },
  WeightedRandom: function(list, weight) {
    var total_weight = weight.reduce(function (prev, cur, i, arr) {
      return prev + cur;
    });

    var random_num = this.GetRandom(0, total_weight);
    var weight_sum = 0;

    for (var i = 0; i < list.length; i++) {
      weight_sum += weight[i];
      weight_sum = +weight_sum.toFixed(2);

      if (random_num <= weight_sum) {
          return list[i];
      }
    }
  },
  NumToText: function(txt) {
    if(txt > 3000)
      txt = Math.floor(txt/1000) +'k'+((txt%1000)!== 0 ? '+' : '');
    return txt;
  },
  HitTestPoint: function(objA, objB) {
    if((objA === null) || (objB === null))
      return false;
    if((objA.x >= objB.x) && (objA.x <= (objB.x + objB.width)) && (objA.y >= objB.y) && (objA.y < (objB.y + objB.height)))
      return true;
    else
      return false;
  },
  Null: function(item) {
    item = null;
  },
  Contains: function(a, b) {
    return a.split(b).length > 1;
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
  FlipCanvas: function(canvas) {
    var tmp = TMP_BUFFER(canvas.width, canvas.height);
    var tctx = tmp.getContext('2d');
    tctx.scale(-1, 1);
    tctx.drawImage(canvas, -canvas.width, 0);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tmp, 0, 0);
  },
  BufferToCoords: function(x, y, whole) {
    if(whole || (whole === undefined))
      return {x: parseInt(x)*CHAR_WIDTH, y: parseInt(y)*CHAR_HEIGHT};
    else
      return {x: x*CHAR_WIDTH, y: y*CHAR_HEIGHT};
  },
  Moultonize: function(x, from, to) {
    var b = Math.pow(10, (Math.log10(to/from))/100);
    return from * Math.pow(b, x);
  },
  RemoveFromArray: function(arr, item, val) {
    if(arr === undefined) return arr;
    var i = arr.indexOf(item);
    if(i === -1)
    {
      arr.forEach(function(a, idx){
        if(val)
          if(a[val] === item[val])
            i = idx;
        else
          if(a === item)
            i = idx;
      });
    }
    if(i !== -1)
      var r = arr.splice(i, 1);
    return r;
  },
  CoordsToBuffer: function(x, y) {
    return {x: Math.floor(x/CHAR_WIDTH), y: Math.floor(y/CHAR_HEIGHT)};
  },
  GenerateStamp: function(spr) {
    var o = new Renderer(spr.w*CHAR_WIDTH, spr.h*CHAR_HEIGHT);
    var r = new Renderer(spr.w*CHAR_WIDTH, spr.h*CHAR_HEIGHT);
    this.StampSprite(o.context, 0, 0, spr);
    r.context.scale(-1, 1);
    this.StampSprite(r.context, -20, 0, spr);
    return {original: o, reverse: r};
  },
  GenerateStamps: function() {
    for (var key in S) {
      if (S.hasOwnProperty(key)) {
        var stamp = this.GenerateStamp(S[key]);
        S[key].stamp = stamp.original;
        S[key].reverse = stamp.reverse;
        if(R.hasOwnProperty(key)) {
          if(R[key].actions !== undefined)
            R[key].actions.forEach(function(r, i){
              r.val = r.charge.b + ((r.charge.t - r.charge.b) /2);
            });
        }
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
  }
};

global.MAX_LVL = 60;

var buffer = document.createElement('canvas');

global.TMP_BUFFER = function(width, height) {
  buffer.width = width; buffer.height = height;
  buffer.getContext('2d').clearRect(0, 0, buffer.width, buffer.height);
  buffer.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
  return buffer;
};

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
  HEALTH: new Char('+', '00ff00'),
  DRINK: new Char('¡', 'B85456'),
  DRINK2: new Char('#', 'F1D67D'),

  FLOOR: new Char('┈', '63545E', '302222'),
  OFF_FLOOR: new Char('┈', '3b3539', '302222'),
  GOLD: new Char('●', 'FFE545'),

  VOID: new Char(' ', '302222', '302222')
};

global.S = {
  HOSPITAL: {p: '63545E 302222 998D2D FEF441 493B23 383636 D20000 B4D645 F8F7F1 392929', d: '═01╤04═04═04═04╤04═01╤04═04═04═04╤04═01╤04═04═04═04╤04═01╗01 01╧34═32═32═32╧34 01╧34═32═32═32╧34 01╧34═32═32═32╧34 01║01◼91 01◼04 04◼04 01◼91 01◼04 04◼04 01◼91 01◼04 04◼04 01◼91║01 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01║01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91║01 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01 01 01⩴85⟿65 01○01 01⩴85⟿75 01○01 01⩴85⟿75 01○01 01⩴85⟿65 01○01 01▗01▄01▟01|01 01▗01▄01▟01|01 01▗01▄01▟01|01 01▗01▄01▟01|01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01', w: 20, h: 9},
  ENTRANCE: {p: '63545E 302222 C3F83C 493B23 998D2D FEF441', d: '═01╦01═01═01═01╦01═01═01═01╦01═01═01═01╦01═01═01═01═01═01╦01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░03◌54░03░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░03░01░01░03◌54░03░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░03░01░01░03◌54░03░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░01░01░01░01░03░01░01░03◌54░03░01░01░01░01║01░01░01░01░01░01░01░01░01░01░01░01░01░01░03░01░01░01░01░01 01░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01 01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01', w: 20, h:9},
  CHURCH: {p: '63545E 302222 62533E F9DC90 FFF64F 5D5C70 C79C00', d: '═01═01═01═01═01═01╦01═01═01═01═01═01╦01═01═01═01═01═01═01╦01 01 01 01 01 01 01╹01 01 01 01 01 01╹01 01 01 01 01 01 01║01 01┌32─32─32┐32 01 01 01 01╻41 01 01 01 01┌32─32─32┐32 01║01 01│32#52)52│32 01 01 01━41╋41━41 01 01 01│32(52%52│32 01║01 01└32─32─32┘32 01 01 01 01┃41 01 01 01 01└32─32─32┘32 01║01 01 01 01 01 01 01 01 01 01╹41 01 01 01 01 01 01 01 01 01║01 01◯61 01●61 01◯61 01 01 01●61 01 01 01◯61 01●61 01◯61 01 01 01╹31 01╹31 01╹31 01┏32━32┻32━32┓32 01╹31 01╹31 01╹31 01 01┈31┈31┈31┈31┈31┈31┈31┻31╍31╍31╍31┻31┈31┈31┈31┈31┈31┈31┈31┈31', w: 20, h: 9},
  SEWER: {p: '63545E 302222 9AE2A8 374332 58442C 794425 FEF441', d:'═01═01═01═01═01═01═01═01═01═01═01═01═01┉01═01═01═01═01═01╤01▙01 01 01 01 01 01 01 01◌51 01 01 01 01◜51◝51 01 01 01▜01│01 01 01 01◎16 01 01 01 01▒21 01 01 01 01◟51◞51 01 01◎16 01│01 01 01 01▼51 01 01 01 01▒21 01◉06 01 01▗01 01 01 01▼51 01│01 01 01▞01 01 01 01 01 01░21 01 01 01 01 01▚01 01▞01 01 01┆01 01▞01 01 01 01 01 01 01░21 01 01 01 01 01 01▛01 01 01 01 01 01 01 01 01 01 01 01 01░21 01 01 01 01 01▞01 01 01 01 01 01 01 01 01 01 01 01 01 01◒21 01 01 01 01 01 01 01 01 01 01 01┄01┅01┄01┉01┅01┉01┄01┉01┄01┉01┅01┈01┄01┉01┅01┉01┄01┉01┉01┈01', w: 20, h:9},
  INN: {p: '63545E 302222 604B38 DCC091 C79C00 493B23 E3DA4B E13B3B 34DBB2 6D2A24 987C57 88553B', d: '═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01╗01 01 01 32T32Ħ32Ę32 32 32Đ32Ů32Ň32Ğ32Ē32ī32Ň32Ŋ32 32 01 01║01 01╔01═01═01═01═01╗01 01 01 05 01 01 01 01 01 01 01 05 01║01 01║01 01 01◎01 01║01 01 05●45 05 01 01 01 01 01 05●45 05║01 01║01 01 01◎01 01║01 01 01╹45 01 01 01 01 01 01 01╹45 01║01 01╚01═01═01═01═01╝01 01 01 01 01 01 01 01○01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01◮61◊71◬81{01⥉01}01 01 01☎71 01 01┬A1─A1─A1┬A1 01┌A1┤A1 01┌A9┴A9┴A9┴A9─A9─A9─A9─A9─A9┐A9 01┈01┴A1┈01┈01┴A1┈01┴A1┴A1┈01┴A9┈A9┈A9┈A9┈A9┈A9┈A9┈A9┈A9┴A9┈01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01', w: 20, h: 9},
  OUTDOOR: {p: '2CA9AD 25989B ADDADE FFFFFF 9BC560', d: ' 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11╱31╲31 11 11 11 11 11 11 11 11 11 11 11╱31 33 33╲31╱31╲31 11 11 11 11 11 11 11╱31 33 33 33 33 33 33╲31 11 11 11 11 11╱31 33 33 33 33 33 33 33 33 33╲31 11╥41 11', w:14, h:5},
  ADD_ROOM: {p: '63545E 302222', d: '┌01 01 01 01 01 01┐01 01 01 01│01 01 01 01 01─01─01┼01─01─01 01 01 01 01│01 01 01 01└01 01 01 01 01 01┘01', w: 7, h: 5}
};

global.R = {
  HOSPITAL: {name: 'Hospital', p: P.HEALTH, code: 'h', slots: [4, 9, 14, 19], actions: [{name: 'Nurse', effects: [{attribute: 'health', rate: {t: 10, b: 2}}], charge: {t: 20, b: 10}}], cost: 100, stamp: S.HOSPITAL},
  INN: {name: 'Inn', p: [P.DRINK, P.DRINK2], code: 'i', slots: [3, 9, 14, 16, 18], actions: [{name: 'Drink', effects: [{attribute: 'health', rate: {t: 10, b: 2}}], charge: {t: 8, b: 2}}], cost: 100, stamp: S.INN},
  ENTRANCE: {name: 'Entrance', code: 'e', actions: [{name: 'Chat', effects: [{attribute: 'xp', rate: {t: 5, b: 1}}], charge: {t: 10, b: 2}}], cost: 100, stamp: S.ENTRANCE},
  SEWER: {name: 'Sewer', cost: 70, stamp: S.SEWER},
  CHURCH: {name: 'Church', cost: 140, stamp: S.CHURCH},
  random: function(){
    return R[H.GetRandomEntry(this.all())];
  },
  all: function() {
    var sel = [];
    H.EachValueKey(R, function(k){
      if((k != 'random') && (k !='all'))
        sel.push(k);
    });
    return sel;
  }
};


global.N = {
  names: 'Tom Thomas Brian Bobby Boromir Budgergy Bobbin Bilbo Bonzo Bongo Calvin Capitan Mr White Jack John Shirley Jonty Monty Cresswell Burgermeister Royletron Timon Aladdin Adolf Tony Antony Finn Jake Peter Pete Pele Persius Ponyo Pogo Serj Sergey Samir Todmorden Kevin Dante Colin Dennis Jake Solomon',
  Random: function() {
    return H.GetRandomEntry(this.names.split(' '));
  }
};

global.E = {
  weapons: [
    {name: 'Shortsword', symbol: '}', damage: 3, range: 3, code: 'ss', color: '00FF00', offsetx: 0.6, top: -0.5, bottom: -0.35},
    {name: 'Longsword', symbol: '∤', strike: '/', damage: 4, range: 3, code: 'ls', color: 'A7FBEB', offsetx: 0.7, top: - 0.45, bottom: -0.2},
    {name: 'Small Axe', symbol: '>', damage: 4, range: 1, code: 'sa', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Bow', symbol: '⦔', damage: 4, range: 1, code: 'bw', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Crucifix', symbol: '†', damage: 4, range: 1, code: 'cf', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Wand', symbol: '⊸', damage: 4, range: 1, code: 'wd', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Staff', symbol: '∣', damage: 4, range: 1, code: 'st', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Knife', symbol: '†', damage: 4, range: 1, code: 'kn', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Lute', symbol: '∝', damage: 4, range: 1, code: 'lt', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3}
  ],
  heroes: [
    {name: 'Knight', faves: 'hei', turn: {t: 16, b: 5}, hates: 's', money: {t: 200, b: 130}, health: {t: 200, b: 14}, fee: 10, increment: 0.5, symbol: '$', lvl_range: {t: 50, b: 1}, weapons: ['ls', 'ss'], speed: {t: 1.5, b: 0.7}, color: 'FFE9BA'},
    {name: 'Dwarf', fee: '8', increment: '3', symbol: 'D', lvl_range: {t: 55, b: 1}, weapons: ['sa'], speed: {t: 1.1, b: 0.6}, color: 'FFE9AA'},
    {name: 'Priest', fee: '3', increment: '4', symbol: 'δ', lvl_range: {t: 55, b: 1}, weapons: ['cf'], speed: {t: 1.1, b: 0.6}, color: 'FFE9AA'},
    {name: 'Mage', fee: '6', increment: '2', symbol: 'Î', lvl_range: {t: 55, b: 1}, weapons: ['st', 'wd'], speed: {t: 1.1, b: 0.6}, color: 'FFE9AA'},
    {name: 'Rogue', fee: '4', increment: '3', symbol: '∱', lvl_range: {t: 55, b: 1}, weapons: ['kn'], speed: {t: 1.1, b: 0.6}, color: 'FFE9AA'},
    {name: 'Archer', fee: '5', increment: '2', symbol: '∔', lvl_range: {t: 55, b: 1}, weapons: ['bw'], speed: {t: 1.1, b: 0.6}, color: 'FFE9AA'},
    {name: 'Muse', fee: '2', increment: '6', symbol: '♭', lvl_range: {t: 55, b: 1}, weapons: ['lt'], speed: {t: 1.1, b: 0.6}, color: 'FFE9AA'}
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
    return new Hero(UI.spawn_point.x, UI.spawn_point.y, this.heroes[0]); //H.GetRandomEntry(h));
  }
};


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
}

function onDown() {
  H.MouseDown = true;
  H.MouseUp = false;
  if(!H._clicked)
    if(!H.MouseClick)
      H._clicked = H.MouseClick = true;
    else
      H.MouseClick = false;
};

function onUp() {
  H.MouseDown = false;
  H.MouseUp = true;
  H.MouseClick = H._clicked = false;
}

GAME.addEventListener('mousemove', function(event) {
  H.MouseCoords = getMousePos(GAME, event);
});

GAME.addEventListener('mouseout', function(event) {
  H.MouseCoords = null;
  H.MouseDown = false;
});

GAME.addEventListener('touchstart', function(event){
  H.MouseCoords = getMousePos(GAME, event.targetTouches[0]);
  onDown();
});

GAME.addEventListener('touchend', function(event){
  H.MouseCoords = getMousePos(GAME, event.targetTouches[0]);
  onUp();
})

GAME.addEventListener('mousedown', function(event) {
  onDown();
});

GAME.addEventListener('mouseup', function(event) {
  onUp();
});
