global.UI = {
  renderer: null,
  w: null,
  h: null,
  clouds: [],
  ctx: null,
  init: function(ctx){
    this.ctx = ctx;
    this.w = Math.floor(GAME.width / CHAR_WIDTH);
    this.h = Math.floor(GAME.height / CHAR_HEIGHT);
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
    this.renderer.stamp(ctx);
  },
  update: function(dt){
    var _this = this;
    this.clouds.forEach(function(cloud, idx){
      cloud.stamp(g_ctx);
      if(cloud.x > (_this.w + 2))
        cloud.body.x = -1;
    });
  }
};
