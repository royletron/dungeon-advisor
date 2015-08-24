global.UI = {
  renderer: null,
  gold: 100,
  lvl: 1,
  w: null,
  h: null,
  floors: [[undefined, undefined, undefined, undefined]],
  max_rooms: 4,
  max_floors: 1,
  change: false,
  clouds: [],
  spawn_counter: 0,
  spawn_wait: 0,
  spawn_point: {x: 2, y: 13.5},
  heroes: [],
  num_heroes: 0,
  bg: null,
  fg: null,
  ctx: null,
  add_floor_button: new Button('Add Floor', function(){
    console.log(this);
    UI.addFloor();
  },1, 1, 80),
  statuses: [],
  counters: [],
  selected_room: undefined,
  init: function(ctx){
    this.ctx = ctx;
    this.w = Math.floor(GAME.width / CHAR_WIDTH);
    this.h = Math.floor(GAME.height / CHAR_HEIGHT);
    this.renderer = new Renderer(GAME.width, GAME.height, 1);
    this.bg = new Renderer(GAME.width, GAME.height, 1);
    this.fg = new Renderer(GAME.width, GAME.height, 1);

    for(var x=0; x < this.w; x++) {
      if(Math.random() > 0.95)
      {
        var c = new Sprite(x, H.GetRandom(1, 3), new Char('@', 'FFFFFF', undefined, 0.2));
        c.body.velocity.x = 1;
        this.clouds.push(c);
      }
      if((x%14 === 0) && (Math.random() > 0.5) && (x > 20))
        S.OUTDOOR.stamp.stamp(this.bg.context, x, 0);
      for(var y=0; y < this.h; y++) {
        if(y > 4)
          if((x > this.w-31) && (x < this.w-2) && (y > 5) && (y < this.h - 1))
            if(y == 24)
              P.randomSolid().stamp(this.bg.context, x, y);
            else
              P.BOX_MD.stamp(this.bg.context, x, y);
          else if((x < 2) || (x > (this.w-33)) || (y < 6))
            P.randomSolid().stamp(this.fg.context, x, y);
          else
            if((y%ROOM_HEIGHT) == 5)
              if(Math.ceil(y/ROOM_HEIGHT)-1 > (this.floors.length))
                P.OFF_FLOOR.stamp(this.bg.context, x, y);
              else
                P.FLOOR.stamp(this.bg.context, x, y);
            else
              P.VOID.stamp(this.bg.context, x, y);
      }
    }
    this.bg.context.font = HEADING_FONT;
    this.bg.context.strokeStyle = 'white';
    this.bg.context.lineWidth = 5;
    this.bg.context.strokeText('dungeon', 10, 44);
    this.bg.context.fillText('dungeon', 10, 44);
    this.bg.context.fillStyle = '#579441';
    this.bg.context.strokeText('advisor', 135, 44);
    this.bg.context.fillText('advisor', 135, 44);
    this.renderer.stamp(ctx);

    this.add_floor_button.y = 10 + (this.floors.length * ROOM_HEIGHT);
    this.add_floor_button.x =((this.w-29)/2) - 8;

    this.counters.push(new Counter(P.GOLD, this, 'gold'));
    this.counters.push(new Counter(new Char('#', 'FA6728'), this, 'num_heroes'));
    this.addRoom(R.ENTRANCE);
  },
  addFloor: function() {
    if(this.gold >= 80)
    {
      this.floors.push([undefined, undefined, undefined, undefined]);
      this.gold += -80;
      for(x = 2; x < this.w-32; x++)
        P.FLOOR.stamp(this.bg.context, x, ((this.floors.length+1)* ROOM_HEIGHT) - 4);
      this.add_floor_button.y += ROOM_HEIGHT;
    }
  },
  addStatus: function(hero, title, text){
    var tmp = [];
    tmp.push(new StatusUpdate(hero, title, text));
    this.statuses.forEach(function(status){
      tmp.push(status);
    });
    if(tmp.length > 5)
      tmp.pop().kill();
    this.statuses = tmp;
  },
  addRoom: function(type, position){
    console.log(position);
    if(position === undefined)
      this.floors[0][0] = new Room(type, false);
    else
      if(this.floors[position.y] !== undefined)
        this.floors[position.y][position.x] = new Room(type, (position.y%2) == 1);

    // this.floors.forEach(function(f, i) {
    //   if((f.length < (this.max_rooms)) && !added)
    //   {
    //     added = true;
    //     f.push(new Room(type, ((i%2)== 1)));
    //   }
    // }.bind(this));
    //
    // if(!added)
    //   if(this.floors.length < (this.max_floors))
    //     this.floors.push([new Room(type, ((this.floors.length%2)==1))]);
    //   else
    //     console.log('No room');
  },
  spawnHero: function() {
    var h = E.GetRandomHero(1);
    this.heroes.push(h);
    this.num_heroes = this.heroes.length;
    this.gold += H.DoMath(h.type.increment, h.lvl, h.type.fee);
  },
  removeHero: function(hero) {
    this.heroes = H.RemoveFromArray(this.heroes, hero, 'id');
    hero.end();
    H.Null(hero);
    this.num_heroes = this.heroes.length;
  },
  _clicked: false,
  update: function(dt){
    this.clouds.forEach(function(cloud, idx){
      if(cloud.x > (this.w + 2))
        cloud.body.x = -1;
    }.bind(this));
    this.spawn_counter += dt;
    if(this.spawn_counter > this.spawn_wait)
    {
      this.spawn_counter = 0;
      this.spawn_wait = H.GetRandom(8, 14);
      this.spawnHero();
    }
    this.heroes.forEach(function(hero) {
      hero.update(dt);
      if(hero.sprite.x < (this.w - 31))
      {
        if(hero.sprite.x < (this.spawn_point.x - 2))
          if(hero.current_floor < this.floors.length)
            this.flipHero(hero);
          else
            this.removeHero(hero);
      }
      else
      {
        if(hero.current_floor < (this.floors.length))
          this.flipHero(hero);
        else
          this.removeHero(hero);
      }
    }.bind(this));

    if(H.MouseClick)
    {
      this.floors.forEach(function(floor, y){
        floor.forEach(function(room, x){
          if(H.HitTestPoint(H.MouseCoords, {x: (2+(x * ROOM_WIDTH)) * CHAR_WIDTH, y: (6 + (y * ROOM_HEIGHT)) * CHAR_HEIGHT, width: ROOM_WIDTH*CHAR_WIDTH, height: ROOM_HEIGHT*CHAR_HEIGHT}))
            this.setSelection(room || {x: x, y: y, found: false});
        }.bind(this));
      }.bind(this));
    }
    this.add_floor_button.update(dt);
  },
  setSelection: function(room) {
    this.selected_room = room;
  },
  flipHero: function(hero) {
    if(hero.current_floor === undefined)
      hero.current_floor = 1;
    else
      hero.current_floor += 1;
    hero.body.y += ROOM_HEIGHT;
    hero.turnAround();
    return hero;
  },
  makeSelection: function(x, y) {
    this.selected_room = {x: x, y: y, room: this.selected_room};
  },
  drawSelection: function(ctx) {
    var x = this.selected_room.x;
    var y = this.selected_room.y;
    ctx.strokeStyle = "#25989B";
    ctx.strokeRect((2+(x*ROOM_WIDTH))*CHAR_WIDTH, (6 + (y * ROOM_HEIGHT)) *CHAR_HEIGHT, ROOM_WIDTH*CHAR_WIDTH, ROOM_HEIGHT*CHAR_HEIGHT);

    console.log(this.selected_room);
  },
  draw: function() {
    var ctx = this.renderer.context;
    ctx.clearRect(0, 0, GAME.width, GAME.height);

    this.bg.stamp(ctx);

    this.clouds.forEach(function(cloud, idx){
      cloud.stamp(ctx);
    });
    this.floors.forEach(function(floor, y) {
      floor.forEach(function(room, x) {
        if(room !== undefined)
        {
          room.renderer.stamp(ctx, 2 + (x * ROOM_WIDTH), 6 + (y * ROOM_HEIGHT));
        }
        else{
          S.ADD_ROOM.stamp.stamp(ctx, (x * ROOM_WIDTH) + 8, (y * ROOM_HEIGHT) + 8);
        }
        if(UI.selected_room !== undefined)
          if(room !== undefined)
            if(room.id == UI.selected_room.id)
              UI.makeSelection(x, y);
          else if((x == UI.selected_room.x) && (y == UI.selected_room.y))
            UI.makeSelection(x, y);
      });
    });
    this.heroes.forEach(function(hero) {
      hero.stamp(ctx);
    });

    this.statuses.forEach(function(status, y){
      status.stamp(ctx, this.w-29, 26 + (y * 3));
    }.bind(this));

    this.counters.forEach(function (counter, x){
      counter.stamp(ctx, 3 + (x*7), 4);
    }.bind(this));

    this.add_floor_button.stamp(ctx, 1, 1);
    this.fg.stamp(ctx);

    if(this.selected_room !== undefined)
      this.drawSelection(ctx);
    // this.type.stamp(ctx, this.w-27, 9);

    this.renderer.stamp(g_ctx);
  }
};
