global.Char = function(symbol, color, bg, alpha) {
  this.symbol = symbol;
  this.color = color;
  this.bg = bg;
  this.renderer = new Renderer(CHAR_WIDTH, CHAR_HEIGHT, alpha);
  if(this.bg !== undefined)
  {
    H.DrawRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT, this.renderer.context, this.bg);
  }
  H.WriteText(this.symbol, CHAR_WIDTH/2, CHAR_HEIGHT -1, this.renderer.context, FONT, this.color, 'center');
  this.stamp = function(toCanvas, x, y){
    this.renderer.stamp(toCanvas, x, y);
  };
  this.flip = function(){
    this.renderer.flip();
  }
  this.kill = function(){
    this.renderer.kill();
    H.Null(this);
  }
};

global.Button = function(text, cb, x, y, cost, data) {
  this.width = ((text.length + 2) + (cost != undefined ? cost.toString().length + 4 : 0)) * CHAR_WIDTH;
  this.height = CHAR_HEIGHT*2;
  this.renderer = new Renderer(this.width, this.height);
  this.renderer.whole = false;
  this.cost = cost;
  H.DrawRect(3, 3, this.width-5, this.height-5, this.renderer.context, '0D423D');
  H.DrawRect(0, 0, this.width-5, this.height-5, this.renderer.context, '007A52');
  this.data = data;

  H.WriteText(text, CHAR_WIDTH, CHAR_HEIGHT * 1.2, this.renderer.context, FONT, 'EBE1CE');
  if(cost != undefined) {
    this.renderer.context.fillText(cost.toString(), (text.length+4)*CHAR_WIDTH, CHAR_HEIGHT*1.2);
    P.GOLD.renderer.whole = false;
    P.GOLD.stamp(this.renderer.context, text.length+2.5, 0.2);
  }
  this.x = x;
  this.y = y;
  this.cb = cb;
  this.getHitArea = function() {
    return {x: this.x*CHAR_WIDTH, y: this.y*CHAR_HEIGHT, width: this.renderer.width, height: this.renderer.height};
  }
  this.stamp = function(toCanvas, x, y) {
    if(this.cost && (this.cost <= UI.gold))
      this.renderer.stamp(toCanvas, x || this.x, y || this.y);
  }
  this.update = function(dt) {
    if(H.MouseClick)
      if(H.HitTestPoint(H.MouseCoords, this.getHitArea())) {
        this._clicked = true;
        this.cb(this.data);
      }
  }
}

global.Avatar = function(hero) {
  this.color = '25989B';
  this.hero = hero;
  this.renderer = new Renderer(3 *CHAR_WIDTH, 3 * CHAR_HEIGHT);
  this.renderer.whole = false;
  this.stamped = false;
  this.current_floor=0
  this.gen = function(){
    H.WriteText('◜◝', 0, CHAR_HEIGHT, this.renderer.context, FONT, this.color);
    H.WriteText('◟◞', 0, CHAR_HEIGHT*2, this.renderer.context, FONT, this.color);
    this.hero.stamp(this.renderer.context, 0.3, 0.65);
    this.stamped = true;
  }
  if(this.hero.stamp != null)
    this.gen();
  this.stamp = function(toCanvas, x, y){
    if(!this.stamped) this.gen();
    this.renderer.stamp(toCanvas, x, y);
  }
  this.kill = function(){
    this.renderer.kill();
    H.Null(this);
  }
}

global.StatusUpdate = function(hero, title, text) {
  this.hero = hero;
  this.avatar = new Avatar(hero);
  this.typewriter = new TypeWriter(text, 21, 4);
  this.typewriter.run();
  this.renderer = new Renderer(21 * CHAR_WIDTH, CHAR_HEIGHT);
  H.WriteText(title, 0, CHAR_HEIGHT-2, this.renderer.context, STATUS_FONT, 'ffffff');
  this.stamp = function(toCanvas, x, y){
    this.avatar.stamp(toCanvas, x, y);
    this.renderer.stamp(toCanvas, x+3, y);
    this.typewriter.stamp(toCanvas, x+3, y+1);
  }
  this.kill = function(){
    this.avatar.kill();
    this.typewriter.kill();
    this.renderer.kill();
    H.Null(this);
  }
}

global.TypeWriter = function(text, width, height, fixed) {
  this.fixed = fixed || false;
  this.text = text;
  this.renderer = new Renderer(width * CHAR_WIDTH, height * CHAR_HEIGHT);
  this.interval;
  this.height = 1;
  this.run = function() {
    var i = 0;
    var cursorX = 0; var cursorY = 0; var lineHeight = CHAR_HEIGHT;
    this.interval = setInterval(function(){
      var rem = this.text.substr(i);
      var space = rem.indexOf(' ');
      space = (space === -1)?this.text.length:space;
      var wordwidth = this.renderer.context.measureText(rem.substring(0, space)).width;
      var w = this.renderer.context.measureText(this.text.charAt(i)).width;
      if(cursorX + wordwidth >= this.renderer.canvas.width) {
          cursorX = 0;
          cursorY += lineHeight;
          this.height += 1;
      }
      H.WriteText(this.text.charAt(i), cursorX, cursorY + CHAR_HEIGHT, this.renderer.context, STATUS_FONT, '25989B');
      i++;
      cursorX += w;
      if(i === this.text.length)
        clearInterval(this.interval);
    }.bind(this), 110);
  };
  this.stamp = function(toCanvas, x, y) {
    this.renderer.stamp(toCanvas, x, y);
  }
  this.kill = function(){
    clearInterval(this.interval);
    this.renderer.kill();
    H.Null(this);
  }
}

global.Body = function(x, y, width, height, fixed) {
  this.x = x; this.y = y; this.width = width; this.height = height;
  this.fixed = fixed || false;
  this._lastposition = {x: x, y: y};
  this.velocity = {x: 0, y: 0};
  this.maxvelocity = {x: -1, y: -1};
  this.acceleration = {x: 0, y: 0};
  this.callbacks = [];
  this.update = function(dt) {
    this._lastposition = {x: this.x, y: this.y};
    if(!this.fixed) {
      this.x += this.velocity.x * dt;
      this.y += this.velocity.y * dt;
    }
    this.callbacks.forEach(function(cb){
      cb(this);
    }.bind(this));
  };
  // this.impact = function
};

global.Physics = {
  _bodies: [],
  createBody: function(entity, x, y, width, height, fixed) {
    var body = new Body(x, y, width, height, fixed);
    this._bodies.push({body: body, entity: entity});
    return body;
  },
  removeBody: function(body) {
    this._bodies = H.RemoveFromArray(this._bodies, body);
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

global.Room = function(type, flipped) {
  this.renderer = new Renderer(ROOM_WIDTH * CHAR_WIDTH, ROOM_HEIGHT * CHAR_HEIGHT, 1);
  this.type = type;
  this.id = roomID;
  roomID++;
  if(flipped)
    type.stamp.reverse.stamp(this.renderer.context);
  else
    type.stamp.stamp.stamp(this.renderer.context);
};

global.Renderer = function(width, height, alpha) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width = width;
  this.canvas.height = this.height = height;
  this.context = this.canvas.getContext('2d');
  this.context.globalAlpha = this.alpha = alpha || 1;
  this.whole = false;
  this.stamp = function(toCanvas, x, y){
    var coords = H.BufferToCoords(x || 0, y || 0, this.whole);
    toCanvas.drawImage(this.canvas, coords.x, coords.y);
  };
  this.flip = function(){
    H.FlipCanvas(this.canvas);
  };
  this.kill = function() {
    this.canvas = null;
    H.Null(this);
  }
};

global.Sprite = function(x, y, renderer) {
  this.renderer = renderer;
  this.x = x;
  this.y = y;
  this.body = Physics.createBody(this, x, y, CHAR_WIDTH, CHAR_HEIGHT);
  this.stamp = function(toCanvas, x, y) {
    this.renderer.stamp(toCanvas, x || this.x, y || this.y);
  };
  this.kill = function() {
    this.renderer.kill();
    H.Null(this)
  };
};

global.Tween = function(entity, values, time, cb) {
  this.current = 0;
  this.entity = entity;
  this.values = values;
  this.start_values = {};
  H.EachValueKey(entity, function(k){
    this.start_values[k] = entity[k];
  }.bind(this));
  this.cb = cb;
  this.time = time;
  this.function = function(dt){
    this.current += dt;
    H.EachValueKey(this.values, function(k){
      var diff = this.values[k] - this.start_values[k];
      this.entity[k] = this.start_values[k] + (diff * (this.current/this.time));
      if(this.entity[k] > this.values[k]) this.entity[k] = this.values[k];
    }.bind(this));
    if(this.current > this.time)
    {
      if(this.cb !== undefined)
        this.cb();

      POP_CALLBACK(this.function);
      H.Null(this);
    }
  }.bind(this);
  PUSH_CALLBACK(this.function);
};

global.Counter = function(symbol, object, value) {
  this.renderer = new Renderer(CHAR_WIDTH * 10, CHAR_HEIGHT);
  this.symbol = symbol;
  this.object = object;
  this.value = value;
  this.draw = function(){
    this.previous = this.object[this.value];
    var txt = H.NumToText(this.previous);
    this.renderer.context.clearRect(0, 0, CHAR_WIDTH * 10, CHAR_HEIGHT);
    H.WriteText(txt, CHAR_WIDTH+4, CHAR_HEIGHT-1, this.renderer.context, FONT, '000000');
    this.symbol.stamp(this.renderer.context);
  };
  this.draw();
  this.stamp = function(toCanvas, x, y){
    if(this.object[this.value] != this.previous)
      this.draw();
    this.renderer.stamp(toCanvas, x, y);
  };
};

var heroId = 1;

global.Hero = function(x, y, type) {
  this.type = type;
  this.sprite = new Sprite(x, y, new Char(type.symbol, type.color));
  this.body = Physics.createBody(this.sprite, x, y, CHAR_WIDTH, CHAR_HEIGHT);
  this.weapon = {type: E.GetRandomWeapon(type.weapons), d:true};
  this.name = N.Random();
  this.weapon.x = x + this.weapon.type.offsetx;
  this.weapon.y = y + this.weapon.type.top;
  this.weapon.spr = new Char(this.weapon.type.symbol, this.weapon.type.color);
  this.sprite.renderer.renderer.whole = this.weapon.spr.renderer.whole = false;
  this.active = true;
  this.id = heroId;
  heroId ++;
  this.body.callbacks.push(function(b){
    var add = this.weapon.type.offsetx;
    if(this.facing == LEFT)
      add = -add;
    this.weapon.x = b.x + add;
  }.bind(this));
  this.facing = RIGHT;
  this.speed = H.GetRandom(type.speed.b * 100, type.speed.t * 100)/100;
  this.body.velocity.x = this.speed;
  this.lvl = H.WeightedRandom([(UI.lvl == 1 ? 1 : UI.lvl-1), UI.lvl, UI.lvl+1], [0.4, 1, 0.5]);
  UI.addStatus(this, this.name+" has entered!", "A "+this.type.name.toLowerCase()+" from ...");
  this.update = function(dt) {
    var m = (this.speed/3) * dt;
    if(this.weapon.d)
      this.weapon.y += m;
    else
      this.weapon.y += -m;
    if(this.weapon.y > (this.body.y +  this.weapon.type.bottom))
    {
      this.weapon.y = this.body.y + this.weapon.type.bottom;
      this.weapon.d = false;
    }
    else if (this.weapon.y < (this.body.y + this.weapon.type.top))
    {
      this.weapon.y = this.body.y + this.weapon.type.top;
      this.weapon.d = true;
    }
    var c = this.getCurrentRoom();
    if((this.currentRoom == undefined) || (c.id != this.currentRoom.id))
      this.roomChanged(c);
  },
  this.roomChanged = function(c) {
    this.currentRoom = c;
  },
  this.getCurrentRoom = function() {
    var x = this.body.x - UI.spawn_point.x;
    var y = this.body.y - UI.spawn_point.y;
    var r = UI.floors[Math.floor(y/ROOM_HEIGHT)];
    if(r !== undefined)
      r = r[Math.floor(x/ROOM_WIDTH)];
    if(r === undefined) return this.currentRoom;
    else return r;
  },
  this.turnAround = function() {
    this.sprite.renderer.flip();
    this.weapon.spr.renderer.flip();
    if(this.facing == RIGHT) {
      this.facing = LEFT;
      this.body.velocity.x = -this.speed;
    }
    else{
      this.facing = RIGHT;
      this.body.velocity.x = this.speed;
    }
  };
  this.stamp = function(toCanvas, x, y) {
    var wx, wy;
    if(x != undefined) wx = x + this.weapon.type.offsetx;
    if(y != undefined) wy = y + this.weapon.type.top;
    if(this.sprite && this.active)
    {
      this.sprite.stamp(toCanvas, x, y);
      this.weapon.spr.stamp(toCanvas, wx || this.weapon.x, wy || this.weapon.y);
    }
  };
  this.end = function() {
    // Physics.removeBody(this.body);
    UI.addStatus(this, this.name+" has left!", "A "+this.type.name.toLowerCase()+" from ...");
    this.active = false;
    this.sprite.kill();
    this.weapon.spr.kill();
    H.Null(this);
  };
};

global.Menu = function(title, width, height) {
  this.width = width;
  this.height = height;
  this.renderer = new Renderer(CHAR_WIDTH * this.width, CHAR_HEIGHT * this.height, 1);
  this.title = title;
  this.generate = function(){
    H.MakeBox(this.width, this.height, this.renderer.context);
    H.StampText(this.renderer.context, 2, 0, this.title, BOX, BOX_B);
  };
  this.generate();
  this.stamp = function(toCanvas, x, y){
    this.renderer.stamp(toCanvas, x, y);
  };
};
