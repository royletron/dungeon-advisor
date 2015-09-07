global.Char = function(s, color, bg, alpha) {
  var t = this;
  t.s = s;
  t.color = color;
  t.bg = bg;
  t.r = t.renderer = new Renderer((CHAR_WIDTH*s.length), CHAR_HEIGHT, alpha);
  if(t.bg !== undefined)
  {
    H.R(0, 0, (CHAR_WIDTH*s.length), CHAR_HEIGHT, t.r.x, t.bg);
  }
  H.T(t.s, (CHAR_WIDTH*s.length)/2, CHAR_HEIGHT -1, t.r.x, FONT, t.color, 'center');
  t.stamp = function(d, x, y){
    t.r.stamp(d, x, y);
  };
  t.flip = function(){
    t.r.flip();
  }
  t.kill = function(){
    t.r.kill();
    H.Null(t);
  }
};

global.Enemy = function(type) {
  var t = this;
  t.type = type
  t.effort = 3;
  t.name = N.Random();
  t.c = new Char(type.symbol, type.color);
  t.charge = function() {
    var r = t.type.rate;
    return Math.floor(r.b+((r.t-r.b) * (t.effort/5)));
  }
  t.kill = function(){
    t.c.kill();
    H.Null(this);
  }
}

global.Button = function(text, cb, x, y, cost, data, r) {
  var t = this;
  t.width = ((text.length + 2) + (cost != undefined ? cost.toString().length + 4 : 0.75)) * CHAR_WIDTH;
  t.height = CHAR_HEIGHT*2;
  t.r = new Renderer(t.width, t.height);
  t.r.whole = false;
  t.cost = cost;
  H.R(3, 3, t.width-5, t.height-5, t.r.x, r ? 'FF0000':'0D423D');
  H.R(0, 0, t.width-5, t.height-5, t.r.x, r ? 'AA0000':'007A52');
  t.data = data;

  H.T(text, CHAR_WIDTH, CHAR_HEIGHT * 1.2, t.r.x, FONT, 'EBE1CE');
  if(cost != undefined) {
    t.r.x.fillText(cost.toString(), (text.length+4)*CHAR_WIDTH, CHAR_HEIGHT*1.2);
    P.GOLD.renderer.whole = false;
    P.GOLD.stamp(t.r.x, text.length+2.5, 0.2);
  }
  t.x = x;
  t.y = y;
  t.s = false;
  t.cb = cb;
  t.kill = function() {
    t.r.kill();
    H.Null(this);
  }
  t.u = function() {
    t.s = true;
    if(t.cost != undefined)
      if(t.cost > UI.gold)
        t.s = false;
  }
  t.hit = function() {
    return {x: t.x*CHAR_WIDTH, y: t.y*CHAR_HEIGHT, width: t.r.width, height: t.r.height};
  }
  t.stamp = function(d, x, y) {
    t.u();
    if(!t.s)
      d.globalAlpha = 0.4;
    t.r.stamp(d, x === undefined ? t.x : x, y === undefined ? t.y : y);
    d.globalAlpha = 1;
  }
  t.update = function(dt) {
    t.u();
    if(H.MouseClick && t.s)
    {
      if(H.HT(H.MouseCoords, t.hit())) {
        H.MouseClick = false;
        t._clicked = true;
        t.cb(t.data);
      }
    }
  }
}

global.Avatar = function(hero, center) {
  var t = this;
  t.color = '25989B';
  t.h = hero;
  t.r = new Renderer(3 *CHAR_WIDTH, 3 * CHAR_HEIGHT);
  t.s = false;
  t.c = center
  t.gen = function(){
    H.T('◜◝', 0, CHAR_HEIGHT, t.r.x, FONT, t.color);
    H.T('◟◞', 0, CHAR_HEIGHT*2, t.r.x, FONT, t.color);
    t.h.stamp(t.r.x, t.c ? 0.5:0.3, 0.65);
    t.s = true;
  }
  if(t.h.stamp != null)
    t.gen();
  t.stamp = function(d, x, y){
    if(!t.s) t.gen();
    t.r.stamp(d, x, y);
  }
  t.kill = function(){
    t.r.kill();
    H.Null(t);
  }
}

global.StarRating = function(txt) {
  var t = this;
  t.i = 0;
  t.r = new Renderer(30*CHAR_WIDTH, CHAR_HEIGHT);
  t.setNum = function(val)
  {
    if(val != t.num){
      t.num = val;
      t.r.x.clearRect(0, 0, t.r.c.width, t.r.c.height);
      for(var i=0; i < 5; i++)
      {
        if(Math.round(val) > i)
          P.STAR.stamp(t.r.x, i, 0);
        else
          P.B_STAR.stamp(t.r.x, i, 0);
      }
      H.T(t.num.toFixed(1) + ' ('+t.i+' reviews)', 5.5*CHAR_WIDTH, CHAR_HEIGHT-1, t.r.x, FONT, '000000');
    }
  }
  t.increment = function() {
    t.i ++;
  }
  t.setNum(0);
  t.stamp = function(c, x, y){
    t.r.stamp(c, x, y);
  }
}

global.StatusUpdate = function(hero, title, text) {
  var t = this;
  t.h = hero;
  t.a = new Avatar(hero);
  t.tw = new TypeWriter(text, 21, 4);
  t.height = t.tw.height + 2
  t.tw.run();
  t.r = new Renderer(23 * CHAR_WIDTH, CHAR_HEIGHT);
  H.T(title, 0, CHAR_HEIGHT-2, t.r.x, STATUS_FONT, 'ffffff');
  t.stamp = function(d, x, y){
    t.a.stamp(d, x, y);
    t.r.stamp(d, x+3, y);
    t.tw.stamp(d, x+3, y+1);
  }
  t.kill = function(){
    t.a.kill();
    t.tw.kill();
    t.r.kill();
    H.Null(t);
  }
}

global.TypeWriter = function(text, width, height, fixed) {
  var t = this;
  t.fixed = fixed || false;
  t.text = text;
  t.r = new Renderer(width * CHAR_WIDTH, height * CHAR_HEIGHT);
  t.interval;
  t.height = 0;
  t.arr = [];

  var cursorX = 0;
  var cursorY = 0;
  var lineHeight = CHAR_HEIGHT;
  var i = 0;
  while(i !== text.length) {
    var rem = text.substr(i);
    var space = rem.indexOf(' ');
    space = (space === -1)?text.length:space;
    t.r.x.font = STATUS_FONT;
    var wordwidth = t.r.x.measureText(rem.substring(0, space)).width;
    var w = t.r.x.measureText(text.charAt(i)).width;
    if(cursorX + wordwidth >= t.r.c.width) {
      cursorX = 0;
      cursorY += lineHeight;
      t.height ++;
    }
    t.arr.push({c: text.charAt(i), x: cursorX, y: cursorY + CHAR_HEIGHT});
    i++;
    cursorX += w;
    t.r.c.height = (t.height+2) * CHAR_HEIGHT
  }


  t.run = function() {
    var i = 0;
    t.interval = setInterval(function(){
      H.T(t.arr[i].c, t.arr[i].x, t.arr[i].y, t.r.x, STATUS_FONT, '25989b');
      if(i == t.arr.length-1)
        clearInterval(t.interval);
      i++;
    }.bind(t), 20);
  }
  t.stamp = function(d, x, y) {
    t.r.stamp(d, x, y);
  }
  t.kill = function(){
    clearInterval(t.interval);
    t.r.kill();
    H.Null(t);
  }
}

global.Body = function(x, y, width, height) {
  var t = this;
  t.x = x; t.y = y; t.width = width; t.height = height;
  t.velocity = {x: 0, y: 0};
  t.update = function(dt) {
    t.x += t.velocity.x * dt;
    t.y += t.velocity.y * dt;
  };
  // this.impact = function
};

var p_i = 1;

global.Physics = {
  createBody: function(entity, x, y, width, height, fixed) {
    var body = new Body(x, y, width, height, fixed);
    body.i = p_i;
    p_i ++;
    return body;
  }
};

var roomID = 1;

global.Particle = function(char, x, y, kill) {
  var t = this;
  if(char.length > 0)
    t.char = H.RE(char);
  else
    t.char = char;
  t.x = x;
  t.y = y;
  t.ux = (H.GR(0, 100) - 50)/75;
  t.rate = (H.GR(100, 150))/100;
  t.alpha = 1;
  t.k = kill;
  t.destroy = function() {
    if(t.k)
      t.char.kill();
    H.Null(t);
  }
  t.cb = PUSH_CALLBACK(function(dt){
    dt = dt * this.rate;
    this.alpha += -dt/3;
    if(this.alpha < 0) {
      POP_CALLBACK(this.cb);
      this.destroy();
    }
    else{
      g_ctx.globalAlpha = this.alpha;
      this.y += -dt;
      this.x += (this.ux * dt)
      this.char.stamp(g_ctx, this.x, this.y);
      g_ctx.globalAlpha = 1;
    }
  }.bind(this));
}

global.Room = function(type, flipped, x, y) {
  var t = this;
  t.renderer = new Renderer(ROOM_WIDTH * CHAR_WIDTH, ROOM_HEIGHT * CHAR_HEIGHT, 1);
  t.type = type;
  t.flipped = flipped;
  t.id = roomID;
  t.x = x;
  t.y = y;
  if(t.type.slots)
    t.slots = t.type.slots.map(function(s){
      return {x: s, npc: undefined, hero: undefined}
    });

  roomID++;
  if(flipped)
    type.stamp.reverse.stamp(t.renderer.context);
  else
    type.stamp.stamp.stamp(t.renderer.context);
  t.tick = function (h) {
    h.last_tick = 0;
    new Particle(t.type.p, h.body.x, h.body.y-1);
  };
  t.kill = function() {
    t.slots.forEach(function(s){
      if(s.hero !== undefined)
        s.hero.room_action(t);
      if(s.npc !== undefined)
        s.npc.kill();
    });
    t.renderer.kill();
    H.Null(this);
  }
  t.update = function(dt, h) {
    if((h.busy != true) && t.slots)
    {
      t.slots.forEach(function(s){
        if((s.x + (this.x * ROOM_WIDTH)) === Math.floor(h.body.x) && (Math.floor(h.body.y) === (13 + (this.y * ROOM_HEIGHT))) && (s.hero == undefined)) {
          s.hero = h;
          h.slot = s;
          h.busy = true;
          h.room_time = h.last_tick = 0;
          h.total_room_time = H.GR(h.type.turn.b, h.type.turn.t);
          h.return_velocity = h.body.velocity.x;
          h.body.velocity.x = 0;
          h.had_a_go = true;
        }
      }.bind(this));
    }
    else{
      h.room_time += dt;
      h.last_tick += dt;
      if(h.last_tick > h.type.i)
        t.tick(h);
      if(h.room_time > h.total_room_time) {
        if(t.slots)
          t.slots.forEach(function(s){
            if(s.hero == h)
              s.hero = undefined;
        })
        h.room_action(t)
      }
    }
  }
};

global.Renderer = function(width, height, alpha) {
  var t = this;
  t.canvas = t.c = document.createElement('canvas');
  t.c.width = t.width = width;
  t.c.height = t.height = height;
  t.context = t.x = t.c.getContext('2d');
  t.x.globalAlpha = t.alpha = alpha || 1;
  t.x.imageSmoothingEnabled = false;
  t.x.fontStyle = FONT;
  t.whole = false;
  this.stamp = function(d, x, y){
    var c = H.BufferToCoords(x || 0, y || 0, t.whole);
    d.drawImage(t.c, c.x, c.y);
  };
  this.flip = function(){
    H.FlipCanvas(t.c);
  };
  this.kill = function() {
    t.c = null;
    H.Null(t);
  }
};

global.Sprite = function(x, y, renderer) {
  var t = this;
  t.renderer = renderer;
  t.x = x;
  t.y = y;
  t.body = Physics.createBody(t, x, y, CHAR_WIDTH, CHAR_HEIGHT);
  t.stamp = function(toCanvas, x, y) {
    t.renderer.stamp(toCanvas, x || t.body.x, y || t.body.y);
  };
  t.update = function(dt) {
    t.body.update(dt);
  };
  t.kill = function() {
    t.renderer.kill();
    H.Null(t)
  };
};

global.Counter = function(symbol, object, value) {
  var t = this;
  t.r = new Renderer(CHAR_WIDTH * 10, CHAR_HEIGHT);
  t.s = symbol;
  t.o = object;
  t.v = value;
  t.draw = function(){
    t.p = t.o[t.v];
    var txt = H.NT(t.p);
    t.r.x.clearRect(0, 0, CHAR_WIDTH * 10, CHAR_HEIGHT);
    H.T(txt, CHAR_WIDTH+4, CHAR_HEIGHT-1, t.r.x, FONT, '000000');
    t.s.stamp(t.r.x);
  };
  t.draw();
  this.stamp = function(d, x, y){
    if(t.o[t.v] != t.p)
      t.draw();
    t.r.stamp(d, x, y);
  };
};

var heroId = 1;

global.Hero = function(x, y, type) {
  var t = this;
  t.type = type;
  t.current_floor = 1;
  t.s = new Char(type.x, type.c);
  t.body = Physics.createBody(t.s, x, y, CHAR_WIDTH, CHAR_HEIGHT);
  t.w = {type: E.GRWeapon(type.w), d:true};
  t.name = N.Random();
  t.w.x = x + t.w.type.ox;
  t.w.y = y + t.w.type.t;
  t.w.spr = new Char(t.w.type.x, t.w.type.c);
  t.active = true;
  t.experience = [];
  t.id = heroId;
  heroId ++;
  t.facing = RIGHT;
  t.speed  = H.GR(type.s.b * 100, type.s.t * 100)/100;
  t.body.velocity.x = t.speed;
  t.lvl = H.WeightedRandom([(UI.lvl == 1 ? 1 : UI.lvl-1), UI.lvl, UI.lvl+1], [0.4, 1, 0.5]);
  t.getXP = function(lvl) {
    return H.Moultonize(lvl || t.lvl, 1, 100000);
  }
  t.getHealth = function(lvl) {
    return H.Moultonize(lvl || t.lvl, t.type.health.b, t.type.health.t);
  }
  t.levelUp = function() {
    t.lvl += 1;
    t.experience.push({n: 1, r: 'I levelled up to '+t.lvl, t: 4});
  }
  t.room_action = function(room) {
    t.busy = t.entertaining = false;
    t.body.velocity.x = t.return_velocity;
    L.inc(0.5);
    if(room.type.battle){
      if(t.slot && t.slot.npc)
      {
        var g=H.G({t:5, b: 1}, t.slot.npc.effort, t);
        var c=-t.slot.npc.charge()
        UI.setGold(c);
        var o = new Char((c).toString(), 'FFF566', '000000');
        new Particle(o, t.body.x, t.body.y-1, true);
        if(g === -1)
          t.experience.push({n: 1, r: 'I had a great fight against '+t.slot.npc.name, t: 26});
        if(g === 1)
          t.experience.push({n: 0.3, r: 'I had a terrible fight against '+t.slot.npc.name, t: 22});
        else
          t.experience.push({n: 0.7, r: 'I had an alright fight against '+t.slot.npc.name, t: 23});
      }
      else
        t.experience.push({n: 0.5, r: 'There was no one to fight in the '+t.type.name.toLowerCase(), t: 7});
    }
    else
    {
      var a=H.RE(room.type.actions);
      var g=H.G(a.c, a.val, t);
      UI.setGold(a.val);
      var c = new Char(a.val.toString(), 'FFF566', '000000');
      new Particle(c, t.body.x, t.body.y-1, true);
      if(g === 0)
        t.experience.push({n: 0.7, r: 'the prices for '+a.n.toLowerCase()+' were fair'});
      if(g === 1)
        t.experience.push({n: 1, r: 'the '+a.n.toLowerCase()+'s were cheap!'});
      if(g === -1)
        t.experience.push({n: 0.4, r: 'the cost of '+a.n.toLowerCase()+' was expensive.'});
      }
  }
  t.update = function(dt) {
    t.body.update(dt);
    t.s.x = t.body.x;
    t.s.y = t.body.y;
    t.uw(dt);
    var c = t.gCR();
    if(t.entertaining)
      t.cr.update(dt, t);
    if(c != t.cr)
      t.roomChanged(c);
  }
  t.uw = function(dt) {
    var add = t.w.type.ox;
    if(t.facing == LEFT)
      add = -add;
    t.w.x = t.body.x + add;
    var m = (t.speed/3) * dt;
    if(t.w.d)
      t.w.y += m;
    else
      t.w.y += -m;
    if(t.w.y > (t.body.y +  t.w.type.b))
    {
      t.w.y = t.body.y + t.w.type.b;
      t.w.d = false;
    }
    else if (t.w.y < (t.body.y + t.w.type.t))
    {
      t.w.y = t.body.y + t.w.type.t;
      t.w.d = true;
    }
  }
  t.roomChanged = function(c) {
    if(t.entertaining !== undefined)
      if(t.had_a_go === true)
        if(H.Contains(t.type.faves, t.cr.type.code))
          t.experience.push({n: 1, r: 'of the '+t.cr.type.name, t: 1});
      else
        t.experience.push({n: 0.4, r: 'I didn\'t get in the '+t.cr.type.name, t: 3});

    t.had_a_go = undefined;
    t.entertaining = undefined;
    t.cr = c;
    if(c !== undefined)
    {
      if(H.Contains(t.type.faves, c.type.code))
      {
        if(Math.random() < 0.95)
          t.entertaining = true;
      }
      else{
        if(Math.random() < 0.6)
          t.entertaining = true;
      }
    }
  }
  t.gCR = function() {
    var x = t.body.x - UI.spawn_point.x;
    var y = t.body.y - UI.spawn_point.y;
    var r = UI.floors[Math.floor(y/ROOM_HEIGHT)];
    if(r !== undefined)
      return r[Math.floor(x/ROOM_WIDTH)];
    else
      return undefined;
  }
  t.turnAround = function() {
    t.s.renderer.flip();
    t.w.spr.renderer.flip();
    if(t.facing == RIGHT) {
      t.facing = LEFT;
      t.body.velocity.x = -t.speed;
    }
    else{
      t.facing = RIGHT;
      t.body.velocity.x = t.speed;
    }
  }
  t.stamp = function(d, x, y) {
    var wx, wy;
    if(x != undefined) wx = x + t.w.type.ox;
    if(y != undefined) wy = y + t.w.type.t;
    if(t.s && t.active)
    {
      t.s.stamp(d, x || t.body.x, y || t.body.y);
      t.w.spr.stamp(d, wx || t.w.x, wy || t.w.y);
    }
  }
  this.end = function() {
    t.active = false;
    t.s.kill();
    t.w.spr.kill();
    H.Null(t);
  }
};
