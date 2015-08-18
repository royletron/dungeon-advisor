global.Char = function(symbol, color, bg, alpha) {
  this.symbol = symbol;
  this.color = color;
  this.bg = bg;
  this.alpha = alpha || 1;
  this._canvas = document.createElement('canvas');
  this._canvas.width = CHAR_WIDTH;
  this._canvas.height = CHAR_HEIGHT;
  this._context = this._canvas.getContext('2d');
  this._context.globalAlpha = this.alpha;
  if(this.bg !== undefined)
  {
    this._context.fillStyle = '#'+this.bg;
    this._context.fillRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT);
  }
  this._context.fillStyle = '#'+this.color;
  this._context.textAlign = 'center';
  this._context.font = FONT;
  this._context.fillText(this.symbol, CHAR_WIDTH/2, CHAR_HEIGHT);
  this.stamp = function(toCanvas, x, y){
    var coords = H.BufferToCoords(x || 0, y || 0);
    toCanvas.drawImage(this._canvas, coords.x, coords.y);
  };
};

global.Menu = function() {
  this._bgcanvas = document.createElement('canvas');
  this._bgcanvas.width = CHAR_WIDTH * 20;
  this._bgcanvas.height = 600;
  this._bgcontext = this._bgcanvas.getContext('2d');
  this._bgcontext.globalAlpha = 0.8;
  this.generate = function(){
    H.MakeBox(14, 30, this._bgcontext);
  };
  this.generate();
  this.stamp = function(toCanvas, x, y){
    var coords = H.BufferToCoords(x || 0, y || 0);
    toCanvas.drawImage(this._bgcanvas, coords.x, coords.y);
  };
};
