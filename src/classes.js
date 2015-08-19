global.Char = function(symbol, color, bg, alpha) {
  this.symbol = symbol;
  this.color = color;
  this.bg = bg;
  this.renderer = new Renderer(CHAR_WIDTH, CHAR_HEIGHT, alpha);
  if(this.bg !== undefined)
  {
    this.renderer.context.fillStyle = '#'+this.bg;
    this.renderer.context.fillRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT);
  }
  this.renderer.context.fillStyle = '#'+this.color;
  this.renderer.context.textAlign = 'center';
  this.renderer.context.font = FONT;
  this.renderer.context.fillText(this.symbol, CHAR_WIDTH/2, CHAR_HEIGHT -1);
  this.stamp = function(toCanvas, x, y){
    this.renderer.stamp(toCanvas, x, y);
  };
};

global.Body = function(x, y, width, height, fixed) {
  this.x = x; this.y = y; this.width = width; this.height = height;
  this.fixed = fixed || false;
  this._lastposition = {x: x, y: y};
  this.velocity = {x: 0, y: 0};
  this.maxvelocity = {x: -1, y: -1};
  this.acceleration = {x: 0, y: 0};
  this.iscolliding = false;
  this.bounciness = 0.8;
  this.update = function(dt) {
    this._lastposition = {x: this.x, y: this.y};
    if(!this.fixed) {
      this.x += this.velocity.x * dt;
      this.y += this.velocity.y * dt;
    }
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
  update: function(dt) {
    this._bodies.forEach(function(item, idx){
      item.body.update(dt);
      item.entity.x = item.body.x;
      item.entity.y = item.body.y;
    });
  }
};

global.Renderer = function(width, height, alpha) {
  this._can = document.createElement('canvas');
  this._can.width = width;
  this._can.height = height;
  this.context = this._can.getContext('2d');
  this.context.globalAlpha = this.alpha = alpha || 1;

  this.stamp = function(toCanvas, x, y){
    var coords = H.BufferToCoords(x || 0, y || 0);
    toCanvas.drawImage(this._can, coords.x, coords.y);
  };
};

global.Sprite = function(x, y, renderer) {
  this.renderer = renderer;
  this.x = x;
  this.y = y;
  this.body = Physics.createBody(this, x, y, CHAR_WIDTH, CHAR_HEIGHT);
  this.stamp = function(toCanvas) {
    this.renderer.stamp(toCanvas, this.x, this.y);
  };
};

global.Menu = function(title) {
  this.width = 20;
  this.renderer = new Renderer(CHAR_WIDTH * this.width, 600, 1);
  this.title = title;
  this.generate = function(){
    H.MakeBox(14, 30, this.renderer.context);
    H.StampText(this.renderer.context, 0, 0, this.title, BOX, BOX_B);
  };
  this.generate();
  this.stamp = function(toCanvas, x, y){
    this.renderer.stamp(toCanvas, x, y);
  };
};
