global.Char = function(symbol, color, bg, alpha) {
  this.symbol = symbol;
  this.color = color;
  this.bg = bg;
  this.renderer = new Renderer(CHAR_WIDTH, CHAR_HEIGHT, alpha)
  if(this.bg !== undefined)
  {
    this.renderer.context.fillStyle = '#'+this.bg;
    this.renderer.context.fillRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT);
  }
  this.renderer.context.fillStyle = '#'+this.color;
  this.renderer.context.textAlign = 'center';
  this.renderer.context.font = FONT;
  this.renderer.context.fillText(this.symbol, CHAR_WIDTH/2, CHAR_HEIGHT);
  this.stamp = function(toCanvas, x, y){
    this.renderer.stamp(toCanvas, x, y);
  };
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
}

global.Hero = function(x, y) {
  this.renderer = new Char('@', 'FF0000');
  this.x = x;
  this.y = y;
  this.stamp = function(toCanvas) {
    this.renderer.stamp(toCanvas, this.x, this.y);
  }
}

global.Menu = function() {
  this.renderer = new Renderer(CHAR_WIDTH * 20, 600, 0.8);
  this.generate = function(){
    H.MakeBox(14, 30, this.renderer.context);
  };
  this.generate();
  this.stamp = function(toCanvas, x, y){
    this.renderer.stamp(toCanvas, x, y);
  }
};
