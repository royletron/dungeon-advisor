global.UI = {
  renderer: null,
  w: null,
  h: null,
  floors: [[]],
  max_rooms: 4,
  change: false,
  clouds: [],
  spawn_counter: 0,
  spawn_wait: 10,
  heroes: [],
  ctx: null,
  init: function(ctx){
    this.ctx = ctx;
    this.w = Math.floor(GAME.width / CHAR_WIDTH) - 25;
    this.h = Math.floor(GAME.height / CHAR_HEIGHT);
    this.menu = new Menu('MENU', 25,  this.h);
    this.renderer = new Renderer(GAME.width, GAME.height, 1);
    for(var x=0; x < this.w; x++) {
      if(Math.random() > 0.95)
      {
        var c = new Sprite(x, H.GetRandom(1, 3), new Char('@', 'FFFFFF', undefined, 0.2));
        c.body.velocity.x = 1;
        this.clouds.push(c);
      }
      if((x%14 === 0) && (Math.random() > 0.5))
        S.OUTDOOR.stamp.stamp(this.renderer.context, x, 0);
      for(var y=0; y < this.h; y++) {
        if(y > 4)
          if((x < 5) || (x > (this.w-5)) || (y < 8))
            P.randomSolid().stamp(this.renderer.context, x, y);
          else
            P.VOID.stamp(this.renderer.context, x, y);
      }
    }
    this.menu.stamp(this.renderer.context, this.w);
    this.renderer.stamp(ctx);
    this.addRoom(R.ENTRANCE);
    this.addRoom(R.ENTRANCE);
    this.addRoom(R.ENTRANCE);
    this.addRoom(R.ENTRANCE);
    this.addRoom(R.ENTRANCE);
  },
  addRoom: function(type){
    if(this.floors[this.floors.length-1].length < this.max_rooms)
    {
      this.floors[this.floors.length-1].push(new Room(type));
    }
    else{
      console.log('too many rooms on floor');
    }
  },
  spawnHero: function() {
    this.heroes.push(new Hero(3, 16, '$'))
  },
  update: function(dt){
    var _this = this;
    this.clouds.forEach(function(cloud, idx){
      cloud.stamp(g_ctx);
      if(cloud.x > (_this.w + 2))
        cloud.body.x = -1;
    });
    this.floors.forEach(function(floor, y) {
      floor.forEach(function(room, x) {
        room.renderer.stamp(g_ctx, 5 + (x * ROOM_WIDTH), 8 + (y * ROOM_HEIGHT))
      });
    });
    this.spawn_counter += dt
    if(this.spawn_counter > this.spawn_wait)
    {
      this.spawn_counter = 0;
      this.spawn_wait = H.GetRandom(8, 14);
      this.spawnHero();
    }
    var _tmp = []
    this.heroes.forEach(function(hero) {
      hero.stamp(g_ctx);
      if(hero.sprite.x < _this.w - 2)
        _tmp.push(hero);
      else
        hero.end();
    });
    this.heroes = _tmp;
  }
};
