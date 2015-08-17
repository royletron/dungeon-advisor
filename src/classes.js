function Char(symbol, color, bg, alpha) {
  this.symbol = symbol;
  this.color = color;
  this.bg = bg;
  this.alpha = alpha || 1;
  this._canvas = document.createElement('canvas');
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
  this._context.fillText(this.symbol, CHAR_WIDTH/2, CHAR_HEIGHT-1);
  this.stamp = function(toCanvas, x, y){
    var coords = H.BufferToCoords(x || 0, y || 0);
    toCanvas.drawImage(this._canvas, coords.x, coords.y);
  };
}
