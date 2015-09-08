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
    });
    var _tmp = {p: [], n: []};
    hero.experience.forEach(function(exp, i){
      score += exp.n;
      if(exp.n > 0.5){
        if(!H.InArray(_tmp.p, exp.t, 't'))
          _tmp.p.push(H.RE(['I liked it', 'It was good', 'I enjoyed it']) + ' because '+ exp.r);
      }
      else
        if(!H.InArray(_tmp.n, exp.t, 't'))
          _tmp.n.push(H.RE(['I hated it', 'It was terrible', 'I didn\'t enjoy it']) + ' because '+ exp.r);
    });
    if(hero.experience.length === 0){
      return {r: 0, s: 'Terrible'};
    }
    if(_tmp.p.length > 0){
      review += H.RE(_tmp.p);
      if(_tmp.n.length > 0)
        review += ' but '
    }
    if(_tmp.n.length > 0)
      review += H.RE(_tmp.n);
    var rtn = {r: score/hero.experience.length, s: review}
    if(rtn.r < 0) rtn.r = 0.1;
    return rtn;
  },
  G: function(c, v, h){
    var m = c.b + ((c.t - c.b)/2);
    var p = (v-m)/(c.t-m);
    if(p>=h.type.m.t)
      return -1;
    else if(p<=h.type.m.b)
      return 1;
    else
      return 0;
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
  T: function(t, x, y, c, f, l, a, w) {
    c.font = f;
    c.fillStyle = '#'+l;
    c.textAlign = a || 'left';
    c.fillText(t, x, y);
  },
  R: function(x, y, w, h, c, f) {
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

    var rn = this.GR(0, tw);
    var ws = 0;

    for (var i = 0; i < l.length; i++) {
      ws += w[i];
      ws = +ws.toFixed(2);

      if (rn <= ws) {
          return l[i];
      }
    }
  },
  NT: function(txt) {
    if(txt > 3000)
      txt = Math.floor(txt/1000) +'k'+((txt%1000)!== 0 ? '+' : '');
    return txt;
  },
  HT: function(objA, objB) {
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
  RE: function(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  },
  GR: function (low, high) {
      return~~ (Math.random() * (high - low)) + low;
  },
  EK: function(obj, cb){
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
              r.val = r.c.b + ((r.c.t - r.c.b) /2);
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
  randomSolid: function(){ return H.RE(this.SOLID_TILES); },
  SOLID_TILES: [new Char('∵', '84596F', '594B54'), new Char('#', '84596F', '594B54'), new Char('*', '84596F', '594B54')],
  BLOOD: new Char('∵', 'FF0000'),
  BOX_MD: new Char(' ', BOX, BOX_B),
  HEALTH: new Char('+', '00ff00'),
  DRINK: new Char('¡', 'B85456'),
  X: new Char('X', 'CF3267'),
  XX: new Char('x', 'D98D8D'),
  XXX: new Char('⧜', 'D87093'),
  DRINK2: new Char('#', 'F1D67D'),
  HOLY: new Char('†', '3CD9BC'),
  HOLY2: new Char('†', 'F2A777'),
  FLOOR: new Char('┈', '63545E', '302222'),
  OFF_FLOOR: new Char('┈', '3b3539', '302222'),
  GOLD: new Char('●', 'FFE545'),
  B_STAR: new Char('☆', '490A3D'),
  STAR: new Char('★', 'E97F02'),
  FIGHT: new Char('⤧', 'FF0066'),
  FIGHT2: new Char('⩓', '73E9CF'),
  FIGHT3: new Char('⨳', 'C6FC50'),
  VOID: new Char(' ', '302222', '302222'),
  CHAT_1: new Char('⩹', 'D7F6FC'),
  CHAT_2: new Char('⩺', 'FECE98'),
  BULLET: new Char('•', 'FFAAFF'),
  BULLET2: new Char('⧂', 'B4B6A8')
};

global.A = {
  a: '63545E ',
  b: '302222 '
}

global.S = {
  ARENA: {
    p: A.a+A.b+'8D7F47 584034 D7B575 A23B3E C57155', d: '═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01╦01░31░31░31◼51░31○61░31©61░31@51░31Ⓢ61░31©51░31Ω51░31░31░31║01░31░31╒23═23═23═23═23═23═23═23═23═23═23═23═23═23╕23░31░31║01░31░31╰23─23─23─23─23─23─23─23─23─23─23─23─23─23╯23░31░31║01░31@61░31░31░31░31░31Ⓢ61░31░31░31░31Ω51░31░31░31@51░31░31░31╒23═23═23╕23░21╒23═23═23╕23░21╒23═23═23╕23░21╒23═23═23╕23░21╰23─23─23╯23░21╰23─23─23╯23░21╰23─23─23╯23░21╰23─23─23╯23░21░21░21░21░21░21░21░21░21░21░21░21░21░21░21░21░21░21░21░21░21┉21┄21┈21┉21┄21┉21┉21┈21┉21┅21┈21┉21┉21┉21┉21┉21┅21┉21┄21┉21', w: 20, h: 9
  },
  SHOP: {
    p: A.a+A.b+'665950 739C8A 0A4F6B FF7867 FFAE75 FEFFE6 B8D6B1', d:'═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01╦01 01✠61 01⧍81 01⨭71 01♪51 01 01 01⫏51 01⫯81 01⥿71 01⏢81 01║01 01┈01┈01┈01┈01┈01┈01┈01 01 01 01┈01┈01┈01┈01┈01┈01┈01 01║01 01⊷81 01≦51 01∑81 01Å61 01 01 01φ71 01ϖ61 01«81 01*61 01║01 01┈01┈01┈01┈01┈01┈01┈01 01 01 01┈01┈01┈01┈01┈01┈01┈01 01 01 01┌23─23┬23─23┬23─23┐23 01○01 01┌23─23┬23─23┬23─23┐23 01 01 01│23▽64│23℗64│23⊞84│23{01⥉01}01│23★64│23◱54│23⌖74│23 01 01┏12┷12━12┷12━12┷12━12┷12━12━12━12┷12━12┷12━12┷12━12┷12┓12 01┸12╌12╌12╌12╌12╌12╌12╌12╌12╌12╌12╌12╌12╌12╌12╌12╌12╌12┸12╌01', w: 20, h: 9
  },
  BROTHEL: {p: A.a+A.b+'83AF9B C8C8A9 FE4365 F9CDAD', d:'═01═01╦01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01╤01 01 01║51▓41▓41 01 01◆01 01 01 01 01 01 01 01 01 01 01 01╎01 01 01║51▓41▓41 01 01▢01 01 01 01 01┌01╍01╍01┐01 01▤31▤31╎01 01 01╚51═51═51═51═51═51 01 01╔51═51╧51═51═51╧51═51═51═51╡01 01 01 01 01 01 01 01 01 01╔51╝51 01 01 01 01 01 01 01 01╎01 01 01─01─01─01╮01 01 01╔51╝51 01 01 01 01─01─01─01╮01 01 01 01 21░21░21░21╽01 01╔51╝51 01 01 01 01 31▒31▒31▒31╽01 01 01 01 21░21░21░21┃01 01╝51▗41▄41▄41▟41 01 31▒31▒31▒31┃01 01 01┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41┉41', w: 20, h: 9},
  HOSPITAL: {p: A.a+A.b+'998D2D FEF441 493B23 383636 D20000 B4D645 F8F7F1 392929', d: '═01╤04═04═04═04╤04═01╤04═04═04═04╤04═01╤04═04═04═04╤04═01╗01 01╧34═32═32═32╧34 01╧34═32═32═32╧34 01╧34═32═32═32╧34 01║01◼91 01◼04 04◼04 01◼91 01◼04 04◼04 01◼91 01◼04 04◼04 01◼91║01 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01║01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91║01 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01◼91 01 01 01⩴85⟿65 01○01 01⩴85⟿75 01○01 01⩴85⟿75 01○01 01⩴85⟿65 01○01 01▗01▄01▟01|01 01▗01▄01▟01|01 01▗01▄01▟01|01 01▗01▄01▟01|01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01┅01', w: 20, h: 9},
  ENTRANCE: {p: A.a+A.b+'C3F83C 493B23 998D2D FEF441', d: '═01╦01═01═01═01╦01═01═01═01╦01═01═01═01╦01═01═01═01═01═01╦01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░03◌54░03░01░01╎01░01░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░03░01░01░03◌54░03░01░01╎01░01░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░03░01░01░03◌54░03░01░01╎01░01░01░01░01░01║01░01░01░01░01░01░01░01░01░01░03░01░01░03◌54░03░01░01░01░01║01░01░01░01░01░01░01░01░01░01░01░01░01░01░03░01░01░01░01░01 01░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01◬21░01░01░01 01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01┈01', w: 20, h:9},
  CHURCH: {p: A.a+A.b+'62533E F9DC90 FFF64F FF9999 C79C00', d: '═01═01═01═01═01═01╦01═01═01═01═01═01╦01═01═01═01═01═01═01╦01 01 01 01 01 01 01╹01 01 01 01 01 01╹01 01 01 01 01 01 01║01 01┌32─32─32┐32 01 01 01 01╻41 01 01 01 01┌32─32─32┐32 01║01 01│32#52)52│32 01 01 01━41╋41━41 01 01 01│32(52%52│32 01║01 01└32─32─32┘32 01 01 01 01┃41 01 01 01 01└32─32─32┘32 01║01 01 01 01 01 01 01 01 01 01╹41 01 01 01 01 01 01 01 01 01║01 01◯61 01●61 01◯61 01 01 01●61 01 01 01◯61 01●61 01◯61 01 01 01╹31 01╹31 01╹31 01┏32━32┻32━32┓32 01╹31 01╹31 01╹31 01 01┈31┈31┈31┈31┈31┈31┈31┻31╍31╍31╍31┻31┈31┈31┈31┈31┈31┈31┈31┈31', w: 20, h: 9},
  SEWER: {p: A.a+A.b+'9AE2A8 374332 58442C 794425 FEF441', d:'═01═01═01═01═01═01═01═01═01═01═01═01═01┉01═01═01═01═01═01╤01▙01 01 01 01 01 01 01 01◌51 01 01 01 01◜51◝51 01 01 01▜01│01 01 01 01◎16 01 01 01 01▒21 01 01 01 01◟51◞51 01 01◎16 01│01 01 01 01▼51 01 01 01 01▒21 01◉06 01 01▗01 01 01 01▼51 01│01 01 01▞01 01 01 01 01 01░21 01 01 01 01 01▚01 01▞01 01 01┆01 01▞01 01 01 01 01 01 01░21 01 01 01 01 01 01▛01 01 01 01 01 01 01 01 01 01 01 01 01░21 01 01 01 01 01▞01 01 01 01 01 01 01 01 01 01 01 01 01 01◒21 01 01 01 01 01 01 01 01 01 01 01┄01┅01┄01┉01┅01┉01┄01┉01┄01┉01┅01┈01┄01┉01┅01┉01┄01┉01┉01┈01', w: 20, h:9},
  INN: {p: A.a+A.b+'604B38 DCC091 C79C00 493B23 E3DA4B E13B3B 34DBB2 6D2A24 987C57 88553B', d: '═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01╦01 01 01 32T32Ħ32Ę32 32 32Đ32Ů32Ň32Ğ32Ē32ī32Ň32Ŋ32 32 01 01║01 01╔01═01═01═01═01╗01 01 01 05 01 01 01 01 01 01 01 05 01║01 01║01 01 01◎01 01║01 01 05●45 05 01 01 01 01 01 05●45 05║01 01║01 01 01◎01 01║01 01 01╹45 01 01 01 01 01 01 01╹45 01║01 01╚01═01═01═01═01╝01 01 01 01 01 01 01 01○01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01◮61◊71◬81{01⥉01}01 01 01☎71 01 01┬A1─A1─A1┬A1 01┌A1┤A1 01┌A9┴A9┴A9┴A9─A9─A9─A9─A9─A9┐A9 01┈01┴A1┈01┈01┴A1┈01┴A1┴A1┈01┴A9┈A9┈A9┈A9┈A9┈A9┈A9┈A9┈A9┴A9┈01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01', w: 20, h: 9},
  LAIR: {p: A.a+A.b+'A88474 BAB15D 859C84', d: '═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01═01╦01 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01║01 01●31 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01●31 01║01 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01●31 01 01 01║01 01●31 01 01 01●31 01 01 01●31 01▙21 01●31 01 01 01●31 01║01 01 01 01●31 01 01 01●31 01▟21█21█21▙21 01 01●31 01 01 01║01 01░31░31░31▒01▒01▒01▟21█21█21█21█21█21▙21▒01▒01▒01░31 01 01░31░31▒01▒01▒01▒01▟21█21█21█21█21█21█21█21█21▙21▒01▒01░31 01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01┉01', w: 20, h: 9},
  OUTDOOR: {p: '2CA9AD 25989B ADDADE D5D0CD 9BC560 BFBBB8 837E7B FFFFFF', d: ' 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11 11╱71╲71 11 11 11 11 11 11 11 11 11 11 11╱31 33 33╲31╱31╲31 11 11 11 11 11 11 11╱51 55 55 55 55 55 55╲51 11 11 11 11 11╱61 66 66 66 66 66 66 66 66 66╲61 11╥41 11', w:14, h:5},
  ADD_ROOM: {p: A.a+A.b, d: '┌01 01 01 01 01 01┐01 01 01 01│01 01 01 01 01─01─01┼01─01─01 01 01 01 01│01 01 01 01└01 01 01 01 01 01┘01', w: 7, h: 5}
};

global.R = {
  CHURCH: {
    name: 'Church',
    code: 'c',
    cost: 60,
    stamp: S.CHURCH,
    p: [P.HOLY, P.HOLY2],
    slots: [4, 8, 10, 12, 16],
    actions: [{
      n: 'Prayers',
      c: {t: 14, b: 2}
    },
    {
      n: 'Confessions',
      c: {t: 20, b: 4}
    }],
    l: 1
  },
  SEWER: {
    name: 'Sewer',
    code: 's',
    slots: [3, 7, 12, 17],
    battle: true,
    enemies: 'rs',
    cost: 120,
    stamp: S.SEWER,
    p: P.FIGHT,
    l: 1
  },
  INN: {
    name: 'Inn',
    p: [P.DRINK, P.DRINK2],
    code: 'i', slots: [3, 9, 14, 16, 18],
    actions: [{
      n: 'Drinks',
      c: {t: 8, b: 2}
    },{
      n: 'Eats',
      c: {t: 13, b: 3}
    }],
    cost: 220,
    stamp: S.INN,
    l: 2
  },
  ARENA: {
    name: 'Arena',
    code: 'a',
    slots: [4, 9, 14, 18],
    enemies: 'wc',
    battle: true,
    cost: 260,
    p: [P.FIGHT, P.FIGHT2],
    stamp: S.ARENA,
    l: 3
  },
  HOSPITAL: {
    name: 'Hospital',
    p: P.HEALTH,
    code: 'h',
    slots: [4, 9, 14, 19],
    actions: [{
      n: 'Nurses',
      c: {t: 18, b: 10}
    },{
      n: 'Doctors',
      c: {t: 24, b: 12}
    }],
    cost: 350,
    stamp: S.HOSPITAL,
    l: 4
  },
  SHOP: {
    name: 'Shop',
    p: [P.BULLET, P.BULLET2],
    code: 'x',
    slots: [4, 8, 12, 16, 20],
    actions: [{
      n: 'Weapons',
      c: {t: 22, b: 14}
    },{
      n: 'Armour',
      c: {t: 30, b: 20}
    },{
      n: 'Items',
      c: {t: 50, b: 10}
    }],
    cost: 500,
    stamp: S.SHOP,
    l: 5
  },
  BROTHEL: {
    name: 'Brothel',
    p: [P.X, P.XX, P.XXX],
    code: 'b', slots: [5, 11, 18],
    actions: [{
      n: 'Kisses',
      c: {t: 76, b: 40}
    },{
      n: 'Hugs',
      c: {t: 100, b: 50}
    },{
      n: 'Cuddles',
      c: {t: 120, b: 70}
    }],
    cost: 700,
    stamp: S.BROTHEL,
    l: 7
  },
  LAIR: {
    name: 'Lair',
    code: 'l',
    slots: [4, 8, 12, 16],
    battle: true,
    enemies: 'di',
    cost: 950,
    stamp: S.LAIR,
    p: [P.FIGHT, P.FIGHT2, P.FIGHT3, P.BULLET],
    l: 7
  },
  ENTRANCE: {
    name: 'Entrance',
    code: 'e',
    actions: [{
      n: 'Nibbles',
      c: {t: 12, b: 2}
    },{
      n: 'Introductions',
      c: {t: 10, b: 0}
    }],
    slots: [3, 6, 9, 12, 15, 18],
    cost: 100,
    p: [P.CHAT_1, P.CHAT_2],
    stamp: S.ENTRANCE,
    l: 100
  },
  random: function(){
    return R[H.RE(this.all())];
  },
  get: function(c) {
    var t
    H.EK(R, function(k){
      if(R[k].code == c)
        t = R[k]
    });
    return t;
  },
  all: function() {
    var sel = [];
    H.EK(R, function(k){
      if((k != 'random') && (k !='all') && (k!='get'))
        sel.push(k);
    });
    return sel;
  }
};

global.L = {
  xp: 0,
  boundaries: [0, 3, 10, 25, 40, 100, 200, 450, 700, 1000],
  inc: function(val) {
    if(val)
      this.xp += val;
    else
      this.xp ++;

    var lvl = this.boundaries.reduce(function(p, v, i){
      if(this.xp > (v*10)) return i;
      else return p;
    }.bind(this));
    UI.lvl = lvl+1;
  }
};


global.N = {
  names: 'Tom Thomas Brian Bobby Boromir Budgergy Bobbin Bilbo Bonzo Bongo Calvin Capitan Mr White Jack John Shirley Jonty Monty Cresswell Burgermeister Royletron Timon Aladdin Adolf Tony Antony Finn Jake Peter Pete Pele Persius Ponyo Pogo Serj Sergey Samir Todmorden Kevin Dante Colin Dennis Jake Solomon',
  Random: function() {
    return H.RE(this.names.split(' '));
  }
};

global.E = {
  weapons: [
    {name: 'Shortsword', x: '}', code: 'ss', c: '00FF00', ox: 0.6, t: -0.5, b: -0.35},
    {name: 'Longsword', x: '∤', code: 'ls', c: 'A7FBEB', ox: 0.7, t: - 0.45, b: -0.2},
    {name: 'Small Axe', x: '>', code: 'sa', c: 'FF0000', ox: 0.8, t: - 0.4, b: -0.3},
    {name: 'Bow', x: '⦔', code: 'bw', c: 'FF0000', ox: 0.8, t: - 0.4, b: -0.3},
    {name: 'Crucifix', x: '†', code: 'cf', c: 'FF0000', ox: 0.8, t: - 0.4, b: -0.3},
    {name: 'Wand', x: '⊸', code: 'wd', c: 'FF0000', ox: 0.8, t: - 0.4, b: -0.3},
    {name: 'Staff', x: '∣', code: 'st', c: 'FF0000', ox: 0.8, t: - 0.4, b: -0.3},
    {name: 'Knife', x: '†', code: 'kn', c: 'FF0000', ox: 0.8, t: - 0.4, b: -0.3},
    {name: 'Lute', x: '∝', code: 'lt', c: 'FF0000', ox: 0.8, t: - 0.4, b: -0.3}
  ],
  heroes: [
    {
      name: 'Knight',
      faves: 'hxlei',
      turn: {t: 9, b: 5},
      fee: 15,
      i: 0.5,
      x: '$',
      l: {t: 10, b: 5},
      w: 'ls ss',
      s: {t: 2.5, b: 1.3},
      c: 'FFE9BA',
      m: {t: 0.8, b: 0.1}
    },
    {
      name: 'Peon',
      faves: 'sce',
      turn: {t: 20, b: 10},
      fee: 3,
      i: 0.3,
      x: 'K',
      l: {t: 6, b: 0},
      w: 'ss kn sa',
      s: {t: 2.5, b: 1.8},
      c: 'FFAD8B',
      m: {t: 0.2, b: -0.4}
    },
    {
      name: 'Dwarf',
      faves: 'shil',
      turn: {t: 15, b: 8},
      x: 'D',
      l: {t: 9, b: 5},
      w: 'sa',
      s: {t:2, b:1.7},
      fee: 8,
      i: 0.9,
      c: 'FFE9AA',
      m: {t: 0.3, b: -0.6}
    },
    {
      name: 'Priest',
      faves: 'csi',
      turn: {t: 18, b: 8},
      fee: 5,
      i: 0.4,
      x: 'δ',
      l: {t: 6, b: 2},
      w: 'cf',
      s: {t: 2.1, b: 1.6},
      c: 'FFE9AA',
      m: {t: 0.2, b: -0.7}
    },
    {
      name: 'Mage',
      faves: 'isxhl',
      turn: {t: 11, b: 4},
      fee: 16,
      i: 0.6,
      x: 'Î',
      l: {t: 9, b: 5},
      w: 'st wd',
      s: {t: 2.1, b: 1.6},
      c: 'FFE9AA',
      m: {t: 0.5, b: -0.2}
    },
    {
      name: 'Rogue',
      faves: 'slihcb',
      turn: {t: 20, b: 10},
      fee: 24,
      i: 0.8,
      x: '∱',
      l: {t: 10, b: 5},
      w: 'kn',
      s: {t: 3.1, b: 1.9},
      c: 'FFE9AA',
      m: {t: 0.9, b: -0.9}
    },
    {
      name: 'Archer',
      faves: 'halxc',
      turn: {t: 21, b: 7},
      fee: 15,
      i: 0.9,
      x: '∔',
      l: {t: 10, b: 6},
      w: 'bw',
      s: {t: 3.9, b: 1.8},
      c: 'FFE9AA',
      m: {t: 0.7, b: 0}
    },
    {
      name: 'Muse',
      faves: 'ihcxlab',
      turn: {t: 36, b: 11},
      fee: 32,
      i: 0.6,
      x: '♭',
      l: {t: 10, b: 6},
      w: 'lt',
      s: {t: 1.1, b: 0.6},
      c: 'FFE9AA',
      m: {t: 0.1, b: -0.6}
    }
  ],
  enemies: [
    {name: 'Rat', code: 'r', symbol: '%', color: 'C2B49A', cost: {t: 50, b: 12}, rate: {t: 15, b: 4}},
    {name: 'Skeleton', code: 's', symbol: '⥉', color: 'C6E5D9', cost: {t: 60, b: 26}, rate: {t:10, b: 4}},
    {name: 'Warrior', code: 'w', symbol: '¥', color: 'F5F2E8', cost: {t: 90, b: 40}, rate: {t: 30, b: 10}},
    {name: 'Champ', code: 'c', symbol: '⨳', color: 'ACA287', cost: {t: 80, b: 34}, rate: {t: 26, b: 8}},
    {name: 'Dragon', code: 'd', symbol: '&', color: 'FF0000', cost: {t:190, b: 70}, rate: {t: 60, b: 20}},
    {name: 'Imp', code: 'i', symbol: '?', color: 'EE1111', cost: {t: 140, b: 50}, rate: {t: 80, b: 30}}
  ],
  GetEnemy: function(code) {
    var e;
    this.enemies.forEach(function(c){
      if(c.code == code) e = c;
    });
    return e;
  },
  GW: function(code) {
    var w;
    this.weapons.forEach(function(c){
      if(c.code == code) w = c;
    });
    return w;
  },
  GRWeapon: function(choice) {
    return this.GW(H.RE(choice.split(' ')));
  },
  GRHero: function(lvl) {
    var h = [];
    this.heroes.forEach(function(c){
      if(c.l.b <= lvl)
        h.push(c)
    })
    return new Hero(UI.spawn_point.x, UI.spawn_point.y, H.RE(h)); //H.RE(h));
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
