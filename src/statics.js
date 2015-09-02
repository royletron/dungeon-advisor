global.FONT = '16px Courier';
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
  Summarise: function(hero, loop) {
    var score = 0;
    var rooms = 0;
    var empty = 0;
    var review = '';
    if(loop == undefined)
    {
      var r = [];
      UI.floors.forEach(function(floor){
        floor.forEach(function(room){
          if(room != undefined)
            r.push(room);
          else
            empty++;
        })
      })
      if(hero.lvl/10 > UI.floors.length/4)
        hero.experience.push({n: 0.2, r: 'there were not enough floors', t: 12});
      if(empty + ((Math.random()*4) - 2) > 4)
        hero.experience.push({n: 0, r: 'there are lots of empty rooms', t: 11});

      hero.type.faves.split('').forEach(function(f){
        var fave = R.get(f);
        if(!H.InArray(r, fave, 'type'))
          hero.experience.push({n: 0, r: 'they didn\'t have a '+fave.name.toLowerCase(), t: 10});
      })
    }
    var _tmp = [];
    var first = true;
    hero.experience.forEach(function(exp, i){
      score += exp.n;
      if((Math.random() > 0.5) && (!H.InArray(_tmp, exp.t, 't'))) {
        _tmp.push(exp);
        if(!first)
          review += ' and ';
        first = false;
        if(exp.n > 0.3)
          review += H.GetRandomEntry(['I liked', 'It was good', 'I enjoyed']) + ' that '+ exp.r;
        else
          review += H.GetRandomEntry(['I hated', 'It was terrible', 'I didn\'t enjoy']) + ' that '+ exp.r
      }
    })
    if(hero.experience.length == 0){
      return {r: 0, s: 'Terrible'};
    }
    if(review.length == 0)
      review = H.Summarise(hero, true).s;
    return {r: score/hero.experience.length, s: review}
  },
  InArray: function(arr, value, column) {
    for(var i=0; i < arr.length; i++)
    {
      var ent = arr[i];
      if(column)
        if(ent[column] === value)
          return true
      else
        if(ent === value)
          return true
    }
    return false;
  },
  WriteText: function(t, x, y, c, f, l, a) {
    c.font = f;
    c.fillStyle = '#'+l;
    c.textAlign = a || 'left';
    c.fillText(t, x, y);
  },
  DrawRect: function(x, y, w, h, c, f) {
    c.fillStyle = '#'+f;
    c.fillRect(x, y, w, h);
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
  WeightedRandom: function(l, w) {
    var tw = w.reduce(function (prev, cur, i, arr) {
      return prev + cur;
    });

    var rn = this.GetRandom(0, tw);
    var ws = 0;

    for (var i = 0; i < l.length; i++) {
      ws += w[i];
      ws = +ws.toFixed(2);

      if (rn <= ws) {
          return l[i];
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
    if(a === undefined) return false;
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
  FlipCanvas: function(c) {
    var tmp = TMP_BUFFER(c.width, c.height);
    var tctx = tmp.getContext('2d');
    tctx.scale(-1, 1);
    tctx.drawImage(c, -c.width, 0);
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(tmp, 0, 0);
  },
  BufferToCoords: function(x, y, whole) {
    if(whole || (whole === undefined))
      return {x: parseInt(x)*CHAR_WIDTH, y: parseInt(y)*CHAR_HEIGHT};
    else
      return {x: x*CHAR_WIDTH, y: y*CHAR_HEIGHT};
  },
  Moultonize: function(x, from, to) {
    var b = Math.pow(10, (Math.log10(to/from))/10);
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
  StampSprite: function(r, x, y, spr) {
    var d = spr.d.split('');
    var p = spr.p.split(' ');
    for(var tx=0; tx < spr.w; tx++) {
      for(var ty=0; ty < spr.h; ty++) {
        var l = (ty*spr.w*3) + (tx*3);
        var c = new Char(d[l], p[this.CharToNum(d[l+1])], p[this.CharToNum(d[l+2])]);
        c.stamp(r, x + tx, y + ty);
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
  BOX_MD: new Char(' ', BOX, BOX_B),
  HEALTH: new Char('+', '00ff00'),
  DRINK: new Char('¡', 'B85456'),
  X: new Char('X', 'CF3267'),
  DRINK2: new Char('#', 'F1D67D'),
  HOLY: new Char('†', '3CD9BC'),
  FLOOR: new Char('┈', '63545E', '302222'),
  OFF_FLOOR: new Char('┈', '3b3539', '302222'),
  GOLD: new Char('●', 'FFE545'),
  B_STAR: new Char('☆', '490A3D'),
  STAR: new Char('★', 'E97F02'),
  FIGHT: new Char('⤧', 'FF0066'),
  VOID: new Char(' ', '302222', '302222')
};

global.A = {
  a: '63545E ',
  b: '302222 '
}

global.S = {
  BROTHEL: {p: A.a+A.b+'83AF9B C8C8A9 FE4365 F9CDAD', d:'═01═01╦01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01╤01 01 01║51▓41▓41 01 01◆01 01 01 01 01 01 01 01 01 01 01 01╎01 01 01║51▓41▓41 01 01▢01 01 01 01 01┌01╍01╍01┐01 01▤31▤31╎01 01 01╚51═51═51═51═51═51 01 01╔51═51╧51═51═51╧51═51═51═51╡01 01 01 01 01 01 01 01 01 01╔51╝51 01 01 01 01 01 01 01 01╎01 01 01─01─01─01╮01 01 01╔51╝51 01 01 01 01─01─01─01╮01 01 01 01 21░21░21░21╽01 01╔51╝51 01 01 01 01 31▒31▒31▒31╽01 01 01 01 21░21░21░21┃01 01╝51▗41▄41▄41▟41 01 31▒31▒31▒31┃01 01 01┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41', w: 20, h: 9},
  HOSPITAL: {p: A.a+A.b+'998D2D FEF441 493B23 383636 D20000 B4D645 F8F7F1 392929', d: '═01╤04═04═04═04╤04═01╤04═04═04═04╤04═01╤04═04═04═04╤04═01╗01 01╧34═32═32═32╧34 01╧34═32═32═32╧34 01╧34═32═32═32╧34 01║01◼91 01◼04 04◼04 01◼91 01◼04 04◼04 01◼91 01◼04 04◼04 01◼91║01 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01║01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91║01 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01 01 01⩴85⟿65 01○01 01⩴85⟿75 01○01 01⩴85⟿75 01○01 01⩴85⟿65 01○01 01▗01▄01▟01|01 01▗01▄01▟01|01 01▗01▄01▟01|01 01▗01▄01▟01|01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01', w: 20, h: 9},
  ENTRANCE: {p: A.a+A.b+'C3F83C 493B23 998D2D FEF441', d: '═01╦01═01═01═01╦01═01═01═01╦01═01═01═01╦01═01═01═01═01═01╦01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░03◌54░03░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░03░01░01░03◌54░03░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░03░01░01░03◌54░03░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░01░01░01░01░03░01░01░03◌54░03░01░01░01░01║01░01░01░01░01░01░01░01░01░01░01░01░01░01░03░01░01░01░01░01 01░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01 01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01', w: 20, h:9},
  CHURCH: {p: A.a+A.b+'62533E F9DC90 FFF64F 5D5C70 C79C00', d: '═01═01═01═01═01═01╦01═01═01═01═01═01╦01═01═01═01═01═01═01╦01 01 01 01 01 01 01╹01 01 01 01 01 01╹01 01 01 01 01 01 01║01 01┌32─32─32┐32 01 01 01 01╻41 01 01 01 01┌32─32─32┐32 01║01 01│32#52)52│32 01 01 01━41╋41━41 01 01 01│32(52%52│32 01║01 01└32─32─32┘32 01 01 01 01┃41 01 01 01 01└32─32─32┘32 01║01 01 01 01 01 01 01 01 01 01╹41 01 01 01 01 01 01 01 01 01║01 01◯61 01●61 01◯61 01 01 01●61 01 01 01◯61 01●61 01◯61 01 01 01╹31 01╹31 01╹31 01┏32━32┻32━32┓32 01╹31 01╹31 01╹31 01 01┈31┈31┈31┈31┈31┈31┈31┻31╍31╍31╍31┻31┈31┈31┈31┈31┈31┈31┈31┈31', w: 20, h: 9},
  SEWER: {p: A.a+A.b+'9AE2A8 374332 58442C 794425 FEF441', d:'═01═01═01═01═01═01═01═01═01═01═01═01═01┉01═01═01═01═01═01╤01▙01 01 01 01 01 01 01 01◌51 01 01 01 01◜51◝51 01 01 01▜01│01 01 01 01◎16 01 01 01 01▒21 01 01 01 01◟51◞51 01 01◎16 01│01 01 01 01▼51 01 01 01 01▒21 01◉06 01 01▗01 01 01 01▼51 01│01 01 01▞01 01 01 01 01 01░21 01 01 01 01 01▚01 01▞01 01 01┆01 01▞01 01 01 01 01 01 01░21 01 01 01 01 01 01▛01 01 01 01 01 01 01 01 01 01 01 01 01░21 01 01 01 01 01▞01 01 01 01 01 01 01 01 01 01 01 01 01 01◒21 01 01 01 01 01 01 01 01 01 01 01┄01┅01┄01┉01┅01┉01┄01┉01┄01┉01┅01┈01┄01┉01┅01┉01┄01┉01┉01┈01', w: 20, h:9},
  INN: {p: A.a+A.b+'604B38 DCC091 C79C00 493B23 E3DA4B E13B3B 34DBB2 6D2A24 987C57 88553B', d: '═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01╦01 01 01 32T32Ħ32Ę32 32 32Đ32Ů32Ň32Ğ32Ē32ī32Ň32Ŋ32 32 01 01║01 01╔01═01═01═01═01╗01 01 01 05 01 01 01 01 01 01 01 05 01║01 01║01 01 01◎01 01║01 01 05●45 05 01 01 01 01 01 05●45 05║01 01║01 01 01◎01 01║01 01 01╹45 01 01 01 01 01 01 01╹45 01║01 01╚01═01═01═01═01╝01 01 01 01 01 01 01 01○01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01◮61◊71◬81{01⥉01}01 01 01☎71 01 01┬A1─A1─A1┬A1 01┌A1┤A1 01┌A9┴A9┴A9┴A9─A9─A9─A9─A9─A9┐A9 01┈01┴A1┈01┈01┴A1┈01┴A1┴A1┈01┴A9┈A9┈A9┈A9┈A9┈A9┈A9┈A9┈A9┴A9┈01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01', w: 20, h: 9},
  LAIR: {p: A.a+A.b+'A88474 BAB15D 859C84', d: '═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01╦01 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01║01 01●31 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01●31 01║01 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01║01 01●31 01 01 01●31 01 01 01●31 01▙21 01●31 01 01 01●31 01║01 01 01 01●31 01 01 01●31 01▟21█21█21▙21 01 01●31 01 01 01║01 01░31░31░31▒01▒01▒01▟21█21█21█21█21█21▙21▒01▒01▒01░31 01 01░31░31▒01▒01▒01▒01▟21█21█21█21█21█21█21█21█21▙21▒01▒01░31 01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01', w: 20, h: 9},
  OUTDOOR: {p: '2CA9AD 25989B ADDADE FFFFFF 9BC560', d: ' 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11╱31╲31 11 11 11 11 11 11 11 11 11 11 11╱31 33 33╲31╱31╲31 11 11 11 11 11 11 11╱31 33 33 33 33 33 33╲31 11 11 11 11 11╱31 33 33 33 33 33 33 33 33 33╲31 11╥41 11', w:14, h:5},
  ADD_ROOM: {p: A.a+A.b, d: '┌01 01 01 01 01 01┐01 01 01 01│01 01 01 01 01─01─01┼01─01─01 01 01 01 01│01 01 01 01└01 01 01 01 01 01┘01', w: 7, h: 5}
};

global.R = {
  HOSPITAL: {name: 'Hospital', p: P.HEALTH, code: 'h', slots: [4, 9, 14, 19], actions: [{name: 'Nurse', effects: [{attribute: 'health', rate: {t: 10, b: 2}}], charge: {t: 20, b: 10}}], cost: 100, stamp: S.HOSPITAL},
  INN: {name: 'Inn', p: [P.DRINK, P.DRINK2], code: 'i', slots: [3, 9, 14, 16, 18], actions: [{name: 'Drink', effects: [{attribute: 'health', rate: {t: 10, b: 2}}], charge: {t: 8, b: 2}}], cost: 100, stamp: S.INN},
  BROTHEL: {name: 'Brothel', p: P.X, code: 'b', slots: [5, 11], actions: [{name: 'Kiss', effects: [{attribute: 'health', rate: {t: 3, b: 0}}], charge: {t: 11, b: 1}}], cost: 210, stamp: S.BROTHEL},
  ENTRANCE: {name: 'Entrance', code: 'e', actions: [{name: 'Chat', effects: [{attribute: 'xp', rate: {t: 5, b: 1}}], charge: {t: 10, b: 2}}], cost: 100, stamp: S.ENTRANCE},
  SEWER: {name: 'Sewer', code: 's', slots: [3, 7, 12, 17], battle: true, enemies: 'rs', cost: 70, stamp: S.SEWER, p: P.FIGHT},
  CHURCH: {name: 'Church', code: 'c', cost: 140, stamp: S.CHURCH, p: P.HOLY, slots: [5, 10, 15], actions: [{name: 'Pray', effects: [{attribute: 'health', rate: {t: 5, b: 0}}], charge: {t: 10, b: 0}}]},
  LAIR: {name: 'Lair', code: 'l', slots: [4, 8, 12], battle: true, enemies: 'sdi', cost: 150, stamp: S.LAIR, p: P.FIGHT},
  random: function(){
    return R[H.GetRandomEntry(this.all())];
  },
  get: function(c) {
    var t
    H.EachValueKey(R, function(k){
      if(R[k].code == c)
        t = R[k]
    });
    return t;
  },
  all: function() {
    var sel = [];
    H.EachValueKey(R, function(k){
      if((k != 'random') && (k !='all') && (k!='get'))
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
    {name: 'Longsword', symbol: '∤', damage: 4, range: 3, code: 'ls', color: 'A7FBEB', offsetx: 0.7, top: - 0.45, bottom: -0.2},
    {name: 'Small Axe', symbol: '>', damage: 4, range: 1, code: 'sa', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Bow', symbol: '⦔', damage: 4, range: 1, code: 'bw', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Crucifix', symbol: '†', damage: 4, range: 1, code: 'cf', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Wand', symbol: '⊸', damage: 4, range: 1, code: 'wd', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Staff', symbol: '∣', damage: 4, range: 1, code: 'st', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Knife', symbol: '†', damage: 4, range: 1, code: 'kn', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3},
    {name: 'Lute', symbol: '∝', damage: 4, range: 1, code: 'lt', color: 'FF0000', offsetx: 0.8, top: - 0.4, bottom: -0.3}
  ],
  heroes: [
    {
      name: 'Knight',
      faves: 'hlei',
      hate: 's',
      turn: {t: 16, b: 5},
      hates: 's',
      money: {t: 200, b: 130},
      health: {t: 200, b: 14},
      fee: 10,
      increment: 0.5,
      symbol: '$',
      lvl_range: {t: 10, b: 3},
      weapons: ['ls', 'ss'],
      speed: {t: 1.5, b: 0.7},
      color: 'FFE9BA'
    },
    {
      name: 'Peon',
      faves: 'sh',
      hate: 'l',
      turn: {t: 20, b: 10},
      fee: 2,
      increment: 0.3,
      symbol: 'K',
      lvl_range: {t: 6, b: 0},
      weapons: ['ss', 'kn', 'sa'],
      money: {t: 100, b: 20},
      health: {t: 100, b: 12},
      speed: {t: 1.5, b: 0.8},
      color: 'FFAD8B'
    },
    {
      name: 'Dwarf',
      faves: 'shil',
      turn: {t: 15, b: 8},
      symbol: 'D',
      lvl_range: {t: 9, b: 1},
      weapons: ['sa'],
      money: {t: 170, b: 140},
      health: {t: 230, b: 24},
      speed: {t:1, b:0.7},
      fee: 8,
      increment: 0.9,
      color: 'FFE9AA'
    },
    {
      name: 'Priest',
      faves: 'cls',
      turn: {t: 18, b: 8},
      fee: 3,
      increment: 0.4,
      symbol: 'δ',
      lvl_range: {t: 10, b: 1},
      weapons: ['cf'],
      money: {t: 70, b: 40},
      health: {t: 330, b: 18},
      speed: {t: 1.1, b: 0.6},
      color: 'FFE9AA'
    },
    {
      name: 'Mage',
      faves: 'ishl',
      turn: {t: 11, b: 3},
      fee: 6,
      increment: 0.6,
      symbol: 'Î',
      lvl_range: {t: 10, b: 3},
      weapons: ['st', 'wd'],
      money: {t: 120, b: 80},
      health: {t: 160, b: 11},
      speed: {t: 1.1, b: 0.6},
      color: 'FFE9AA'
    },
    {
      name: 'Rogue',
      faves: 'slihc',
      turn: {t: 20, b: 10},
      fee: 4,
      increment: 0.8,
      symbol: '∱',
      lvl_range: {t: 8, b: 4},
      weapons: ['kn'],
      money: {t: 190, b: 40},
      health: {t: 200, b: 8},
      speed: {t: 1.1, b: 0.6},
      color: 'FFE9AA'
    },
    {
      name: 'Archer',
      faves: 'hlc',
      turn: {t: 21, b: 7},
      fee: 5,
      increment: 0.9,
      symbol: '∔',
      lvl_range: {t: 9, b: 2},
      weapons: ['bw'],
      money: {t: 170, b: 140},
      health: {t: 230, b: 24},
      speed: {t: 2.9, b: 1.8},
      color: 'FFE9AA'
    },
    {
      name: 'Muse',
      faves: 'ihcls',
      turn: {t: 36, b: 11},
      fee: 2,
      increment: 0.6,
      symbol: '♭',
      lvl_range: {t: 10, b: 4},
      weapons: ['lt'],
      money: {t: 200, b: 90},
      health: {t: 120, b: 34},
      speed: {t: 1.1, b: 0.6},
      color: 'FFE9AA'
    }
  ],
  enemies: [
    {name: 'Rat', code: 'r', symbol: '%', color: 'C2B49A', cost: {t: 10, b: 2}, attack: {t: 8, b: 1}, defense: {t: 74, b: 10}},
    {name: 'Skeleton', code: 's', symbol: '⥉', color: 'C6E5D9', cost: {t: 11, b: 3}, attack: {t: 11, b:2}, defense: {t: 101, b: 40}},
    {name: 'Dragon', code: 'd', symbol: '&', color: 'FF0000', cost: {t:40, b: 12}, attack: {t: 90, b: 30}, defense: {t: 130, b: 50}},
    {name: 'Imp', code: 'i', symbol: '?', color: 'EE1111', cost: {t: 21, b: 5}, attack: {t: 40, b: 7}, defense: {t: 80, b: 45}}
  ],
  GetRandomWeapon: function(choice) {
    var w = [];
    choice.forEach(function (c){
      w.push(this.GetWeapon(c))
    }.bind(this));
    return H.GetRandomEntry(w);
  },
  GetEnemy: function(code) {
    var e;
    this.enemies.forEach(function(c){
      if(c.code == code) e = c;
    });
    return e;
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
    return new Hero(UI.spawn_point.x, UI.spawn_point.y, H.GetRandomEntry(h)); //H.GetRandomEntry(h));
  }
};


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  if(evt != undefined)
    return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
  else
    return H.MouseCoords;
}

// function onDown() {
//   H.MouseDown = true;
//   H.MouseUp = false;
//   if(!H._clicked)
//     if(!H.MouseClick)
//       H._clicked = H.MouseClick = true;
//     else
//       H.MouseClick = false;
// };

// function onUp() {
//   H.MouseDown = false;
//   H.MouseUp = true;
//   H.MouseClick = H._clicked = false;
// }

GAME.addEventListener('click', function(event) {
  H.MouseCoords = getMousePos(GAME, event);
  H.MouseClick = true;
})

// GAME.addEventListener('mousemove', function(event) {
//   H.MouseCoords = getMousePos(GAME, event);
// });

// GAME.addEventListener('mouseout', function(event) {
//   H.MouseCoords = null;
//   H.MouseDown = false;
// });

// GAME.addEventListener('touchstart', function(event){
//   H.MouseCoords = getMousePos(GAME, event.targetTouches[0]);
//   onDown();
// });

// GAME.addEventListener('touchend', function(event){
//   H.MouseCoords = getMousePos(GAME, event.targetTouches[0]);
//   onUp();
// })

// GAME.addEventListener('touchcancel', function(event){
//   H.MouseCoords = getMousePos(GAME, event.targetTouches[0]);
//   onUp();
// })

// GAME.addEventListener('mousedown', function(event) {
//   onDown();
// });

// GAME.addEventListener('mouseup', function(event) {
//   onUp();
// });
