global.Char = function(s, color, bg, alpha) {
  var t = this;
  t.s = s;
  t.color = color;
  t.bg = bg;
  t.renderer = new Renderer(CHAR_WIDTH, CHAR_HEIGHT, alpha);
  if(t.bg !== undefined)
  {
    H.DrawRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT, t.renderer.context, t.bg);
  }
  H.WriteText(t.s, CHAR_WIDTH/2, CHAR_HEIGHT -1, t.renderer.context, FONT, t.color, 'center');
  t.stamp = function(toCanvas, x, y){
    t.renderer.stamp(toCanvas, x, y);
  };
  t.flip = function(){
    t.renderer.flip();
  }
  t.kill = function(){
    t.renderer.kill();
    H.Null(t);
  }
};

global.Enemy = function(type) {
  var t = this;
  t.type = type
  t.name = N.Random();
  t.c = new Char(type.symbol, type.color);
}

global.Button = function(text, cb, x, y, cost, data) {
  var t = this;
  t.width = ((text.length + 2) + (cost != undefined ? cost.toString().length + 4 : 0.75)) * CHAR_WIDTH;
  t.height = CHAR_HEIGHT*2;
  t.r = new Renderer(t.width, t.height);
  t.r.whole = false;
  t.cost = cost;
  H.DrawRect(3, 3, t.width-5, t.height-5, t.r.context, '0D423D');
  H.DrawRect(0, 0, t.width-5, t.height-5, t.r.context, '007A52');
  t.data = data;

  H.WriteText(text, CHAR_WIDTH, CHAR_HEIGHT * 1.2, t.r.context, FONT, 'EBE1CE');
  if(cost != undefined) {
    t.r.context.fillText(cost.toString(), (text.length+4)*CHAR_WIDTH, CHAR_HEIGHT*1.2);
    P.GOLD.renderer.whole = false;
    P.GOLD.stamp(t.r.context, text.length+2.5, 0.2);
  }
  t.x = x;
  t.y = y;
  t.cb = cb;
  t.kill = function() {
    t.r.kill();
    H.Null(this);
  }
  t.getHitArea = function() {
    return {x: t.x*CHAR_WIDTH, y: t.y*CHAR_HEIGHT, width: t.r.width, height: t.r.height};
  }
  t.stamp = function(toCanvas, x, y) {
    var s = true;
    if(t.cost != undefined)
      if(t.cost > UI.gold)
        s = false;
    if(s)
      t.r.stamp(toCanvas, x === undefined ? t.x : x, y === undefined ? t.y : y);
  }
  t.update = function(dt) {
    if(H.MouseClick)
    {
      if(H.HitTestPoint(H.MouseCoords, t.getHitArea())) {
        t._clicked = true;
        t.cb(t.data);
      }
    }
  }
}

global.Avatar = function(hero) {
  var t = this;
  t.color = '25989B';
  t.hero = hero;
  t.renderer = new Renderer(3 *CHAR_WIDTH, 3 * CHAR_HEIGHT);
  t.renderer.whole = false;
  t.stamped = false;
  t.current_floor=0
  t.gen = function(){
    H.WriteText('◜◝', 0, CHAR_HEIGHT, t.renderer.context, FONT, t.color);
    H.WriteText('◟◞', 0, CHAR_HEIGHT*2, t.renderer.context, FONT, t.color);
    t.hero.stamp(t.renderer.context, 0.3, 0.65);
    t.stamped = true;
  }
  if(t.hero.stamp != null)
    t.gen();
  t.stamp = function(toCanvas, x, y){
    if(!t.stamped) t.gen();
    t.renderer.stamp(toCanvas, x, y);
  }
  t.kill = function(){
    t.renderer.kill();
    H.Null(t);
  }
}

global.StatusUpdate = function(hero, title, text) {
  var t = this;
  t.hero = hero;
  t.avatar = new Avatar(hero);
  t.tw = new TypeWriter(text, 21, 4);
  t.tw.run();
  t.renderer = new Renderer(21 * CHAR_WIDTH, CHAR_HEIGHT);
  H.WriteText(title, 0, CHAR_HEIGHT-2, t.renderer.context, STATUS_FONT, 'ffffff');
  t.stamp = function(toCanvas, x, y){
    t.avatar.stamp(toCanvas, x, y);
    t.renderer.stamp(toCanvas, x+3, y);
    t.tw.stamp(toCanvas, x+3, y+1);
  }
  t.kill = function(){
    t.avatar.kill();
    t.tw.kill();
    t.renderer.kill();
    H.Null(t);
  }
}

global.TypeWriter = function(text, width, height, fixed) {
  var t = this;
  t.fixed = fixed || false;
  t.text = text;
  t.renderer = new Renderer(width * CHAR_WIDTH, height * CHAR_HEIGHT);
  t.interval;
  t.height = 1;
  t.run = function() {
    var i = 0;
    var cursorX = 0; var cursorY = 0; var lineHeight = CHAR_HEIGHT;
    t.interval = setInterval(function(){
      var rem = t.text.substr(i);
      var space = rem.indexOf(' ');
      space = (space === -1)?t.text.length:space;
      var wordwidth = t.renderer.context.measureText(rem.substring(0, space)).width;
      var w = t.renderer.context.measureText(t.text.charAt(i)).width;
      if(cursorX + wordwidth >= t.renderer.canvas.width) {
          cursorX = 0;
          cursorY += lineHeight;
          t.height += 1;
      }
      H.WriteText(t.text.charAt(i), cursorX, cursorY + CHAR_HEIGHT, t.renderer.context, STATUS_FONT, '25989B');
      i++;
      cursorX += w;
      if(i === t.text.length)
        clearInterval(t.interval);
    }.bind(t), 110);
  };
  t.stamp = function(toCanvas, x, y) {
    t.renderer.stamp(toCanvas, x, y);
  }
  t.kill = function(){
    clearInterval(t.interval);
    t.renderer.kill();
    H.Null(t);
  }
}

global.Body = function(x, y, width, height, fixed) {
  var t = this;
  t.x = x; t.y = y; t.width = width; t.height = height;
  t.fixed = fixed || false;
  t._lastposition = {x: x, y: y};
  t.velocity = {x: 0, y: 0};
  t.maxvelocity = {x: -1, y: -1};
  t.acceleration = {x: 0, y: 0};
  t.update = function(dt) {
    t._lastposition = {x: t.x, y: t.y};
    if(!t.fixed) {
      t.x += t.velocity.x * dt;
      t.y += t.velocity.y * dt;
    }
  };
  // this.impact = function
};

var p_i = 1;

global.Physics = {
  _bodies: [],
  createBody: function(entity, x, y, width, height, fixed) {
    var body = new Body(x, y, width, height, fixed);
    // this._bodies.push({body: body, entity: entity});
    body.i = p_i;
    p_i ++;
    return body;
  },
  removeBody: function(body) {
    H.RemoveFromArray(this._bodies, body, 'i');
  },
  update: function(dt) {
    this._bodies.forEach(function(item, idx){
      item.body.update(dt);
      item.entity.x = item.body.x;
      item.entity.y = item.body.y;
    });
  }
};

var roomID = 1;

global.Particle = function(char, x, y) {
  var t = this;
  if(char.length > 0)
    t.char = H.GetRandomEntry(char);
  else
    t.char = char;
  t.x = x;
  t.y = y;
  t.ux = (H.GetRandom(0, 100) - 50)/75;
  t.rate = (H.GetRandom(100, 150))/100;
  t.alpha = 1;
  t.destroy = function() {
    H.Null(t);
  }
  t.cb = PUSH_CALLBACK(function(dt){
    dt = dt * this.rate;
    this.alpha += -dt/4;
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
    if(t.type.battle)
      if(h.slot)
      {
        //fight?

      }
  };
  t.update = function(dt, h) {
    if((h.busy != true) && t.slots)
    {
      t.slots.forEach(function(s){
        if(!h.busy && (s.x + (this.x * ROOM_WIDTH)) === Math.floor(h.body.x) && (h.body.y === (13.5 + (this.y * ROOM_HEIGHT))) && (s.hero == undefined)) {
          s.hero = h;
          h.slot = s;
          h.busy = true;
          h.room_time = h.last_tick = 0;
          h.total_room_time = H.GetRandom(h.type.turn.b, h.type.turn.t);
          h.return_velocity = h.body.velocity.x;
          h.body.velocity.x = 0;
          h.had_a_go = true;
        }
      }.bind(this));
    }
    else{
      h.room_time += dt;
      h.last_tick += dt;
      if(h.last_tick > h.type.increment)
        t.tick(h);
      if(h.room_time > h.total_room_time) {
        if(t.slots)
          t.slots.forEach(function(s){
            if(s.hero == h)
              s.hero = undefined;
        })
        h.room_action(t)
        h.busy = h.entertaining = false;
        h.body.velocity.x = h.return_velocity;
      }
    }
  }
};

global.Renderer = function(width, height, alpha) {
  var t = this;
  t.canvas = document.createElement('canvas');
  t.canvas.width = t.width = width;
  t.canvas.height = t.height = height;
  t.context = t.canvas.getContext('2d');
  t.context.globalAlpha = t.alpha = alpha || 1;
  t.context.imageSmoothingEnabled = false;
  t.whole = false;
  this.stamp = function(toCanvas, x, y){
    var coords = H.BufferToCoords(x || 0, y || 0, t.whole);
    toCanvas.drawImage(t.canvas, coords.x, coords.y);
  };
  this.flip = function(){
    H.FlipCanvas(t.canvas);
  };
  this.kill = function() {
    t.canvas = null;
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
  t.renderer = new Renderer(CHAR_WIDTH * 10, CHAR_HEIGHT);
  t.symbol = symbol;
  t.object = object;
  t.value = value;
  t.draw = function(){
    t.previous = t.object[t.value];
    var txt = H.NumToText(t.previous);
    t.renderer.context.clearRect(0, 0, CHAR_WIDTH * 10, CHAR_HEIGHT);
    H.WriteText(txt, CHAR_WIDTH+4, CHAR_HEIGHT-1, t.renderer.context, FONT, '000000');
    t.symbol.stamp(t.renderer.context);
  };
  t.draw();
  this.stamp = function(toCanvas, x, y){
    if(t.object[t.value] != t.previous)
      t.draw();
    t.renderer.stamp(toCanvas, x, y);
  };
};

var heroId = 1;

global.Hero = function(x, y, type) {
  var t = this;
  t.type = type;
  t.current_floor = 1;
  t.sprite = new Char(type.symbol, type.color);
  t.body = Physics.createBody(t.sprite, x, y, CHAR_WIDTH, CHAR_HEIGHT);
  t.w = {type: E.GetRandomWeapon(type.weapons), d:true};
  t.name = N.Random();
  t.w.x = x + t.w.type.offsetx;
  t.w.y = y + t.w.type.top;
  t.w.spr = new Char(t.w.type.symbol, t.w.type.color);
  t.sprite.renderer.whole = t.w.spr.renderer.whole = false;
  t.active = true;
  t.experience = [];
  t.id = heroId;
  heroId ++;
  t.facing = RIGHT;
  t.speed = H.GetRandom(type.speed.b * 100, type.speed.t * 100)/100;
  t.money = H.GetRandom(type.money.b, type.money.t);
  t.body.velocity.x = t.speed;
  t.lvl = H.WeightedRandom([(UI.lvl == 1 ? 1 : UI.lvl-1), UI.lvl, UI.lvl+1], [0.4, 1, 0.5]);
  t.getXP = function(lvl) {
    return H.Moultonize(lvl || t.lvl, 1, 100000);
  }
  t.getHealth = function(lvl) {
    return H.Moultonize(lvl || t.lvl, t.type.health.b, t.type.health.t);
  }
  t.health = t.max_health = t.getHealth();
  t.xp = t.getXP(t.lvl-1);
  // UI.addStatus(t, t.name+" has entered!", "A "+t.type.name.toLowerCase()+" from ...");
  t.updateHealth = function(v) {
    t.health += v;
    if(t.health > t.max_health)
      t.health = t.max_health
  }
  t.updateXP = function(v) {
    t.xp += v;
    if(t.getXP(t.lvl+1) < t.xp)
      t.levelUp();
  }
  t.levelUp = function() {
    t.lvl += 1;
    t.max_health = t.getHealth();
    console.log('lvl up');
    t.experience.push({n: 1, r: 'Levelled up to '+t.lvl, t:'5'});
  }
  t.room_action = function(room) {
    console.log(room);
  }
  t.update = function(dt) {
    t.body.update(dt);
    t.sprite.x = t.body.x;
    t.sprite.y = t.body.y;
    t.update_weapon(dt);
    var c = t.getCurrentRoom();
    if(t.entertaining)
      t.currentRoom.update(dt, t);
    if(c != t.currentRoom)
      t.roomChanged(c);
  }
  t.update_weapon = function(dt) {
    var add = t.w.type.offsetx;
    if(t.facing == LEFT)
      add = -add;
    t.w.x = t.body.x + add;
    var m = (t.speed/3) * dt;
    if(t.w.d)
      t.w.y += m;
    else
      t.w.y += -m;
    if(t.w.y > (t.body.y +  t.w.type.bottom))
    {
      t.w.y = t.body.y + t.w.type.bottom;
      t.w.d = false;
    }
    else if (t.w.y < (t.body.y + t.w.type.top))
    {
      t.w.y = t.body.y + t.w.type.top;
      t.w.d = true;
    }
  }
  t.roomChanged = function(c) {
    if(t.had_a_go === true)
    {
      if(t.currentRoom.type.battle)
      {
        if(t.slot && t.slot.npc)
          t.experience.push({n: 2, r: 'Great to fight against real enemies like '+t.slot.npc.name, t:'4'});
        else
          t.experience.push({n: 1, r: 'Would have been better to fight real enemies', t: '3'});
      }
      else
        t.experience.push({n: 1, r: 'Loved the '+t.currentRoom.type.name, t: '2'});
    }
    else if(t.had_a_go === false)
      t.experience.push({n: -1, r: 'There was no room in '+t.currentRoom.type.name, t: '1'});

    t.had_a_go = undefined;
    t.entertaining = false;
    t.currentRoom = c;
    if(c !== undefined)
    {
      if(H.Contains(t.type.faves, c.type.code))
      {
        if(Math.random() < 0.9)
          t.entertaining = true;
      }
      else{
        if(Math.random() < 0.1)
          t.entertaining = true;
      }
    }
    // console.log(c.type, this.type);
  }
  t.getCurrentRoom = function() {
    var x = t.body.x - UI.spawn_point.x;
    var y = t.body.y - UI.spawn_point.y;
    var r = UI.floors[Math.floor(y/ROOM_HEIGHT)];
    if(r !== undefined)
      return r[Math.floor(x/ROOM_WIDTH)];
    else
      return undefined;
  }
  t.turnAround = function() {
    t.sprite.renderer.flip();
    t.w.spr.renderer.flip();
    if(t.facing == RIGHT) {
      t.facing = LEFT;
      t.body.velocity.x = -t.speed;
    }
    else{
      this.facing = RIGHT;
      t.body.velocity.x = t.speed;
    }
  }
  t.stamp = function(toCanvas, x, y) {
    var wx, wy;
    if(x != undefined) wx = x + t.w.type.offsetx;
    if(y != undefined) wy = y + t.w.type.top;
    if(t.sprite && t.active)
    {
      t.sprite.stamp(toCanvas, x || t.body.x, y || t.body.y);
      t.w.spr.stamp(toCanvas, wx || t.w.x, wy || t.w.y);
    }
  }
  this.end = function() {
    // UI.addStatus(t, t.name+" has left!", "A "+t.type.name.toLowerCase()+" from ...");
    t.active = false;
    t.sprite.kill();
    t.w.spr.kill();
    H.Null(t);
  }
};
