global.UI = {
  renderer: null,
  w: null,
  h: null,
  floors: [[]],
  max_rooms: 4,
  change: false,
  clouds: [],
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
    })
  }
};
