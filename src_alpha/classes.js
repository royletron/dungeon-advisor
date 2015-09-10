function Char (symbol, color, bg, alpha) {
    this.symbol = symbol;
    this.color = color;
    this.bg = bg;
    this.alpha = alpha || 1;
    this._old = {};
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.render = function(x, y, to) {
      if((this.symbol != this._old.s) || (this.color != this._old.c) || (this.bg != this._old.b) || (this.alpha != this._old.a))
      {
        //We need to draw the canvas;
        this.context.globalAlpha = this.alpha;
        if(this.bg !== undefined)
        {
          this.context.fillStyle = this.bg;
          this.context.fillRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT);
        }
        this.context.fillStyle = this.color;
        this.context.textAlign = 'center';
        this.context.font = FONT;
        this.context.fillText(this.symbol, CHAR_WIDTH/2, CHAR_HEIGHT-1);
        this._old = {s: this.symbol, c: this.color, b: this.bg, a: this.alpha};
      }
      if(to === undefined)
        to = content;

      var coords = Helpers.sp(x, y);
      to.drawImage(this.canvas, coords.x, coords.y);
    };
}

function Renderer (chars, to) {
  this.chars = chars;
  this.canvas = document.createElement('canvas');
  this.canvas.width = 1024;
  this.context = this.canvas.getContext('2d');
  this.update = function(this_x, this_y){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    chars.forEach(function (row, y) {
      row.forEach(function (column, x) {
        if(column !== undefined)
        {
          column.render(x + this_x, y + this_y, this.context);
        }
      });
    });
  };
}

function Menu() {
  this.x = Math.floor(canvas.width/CHAR_WIDTH) - 20;
  this.y = 0;
  this.frame = TextToRenderer(Helpers.MakeBox('MENU', 20, 19), '#9BC955', '#102E34', 0.8);
  this._needsUpdating = true;
  this.update = function() {
    this._needsUpdating = false;
    this.frame.update(this.x, this.y);
  };
  this.render = function(to) {
    var coords = Helpers.sp(this.x, this.y);
    // console.log(to);
    //to.drawImage(this.heading.renderer.canvas, coords.x, coords.y);

    if(this._needsUpdating);
      this.update(coords.x, coords.y);
  };
}


function Baddie(x, y, renderer) {
  this.x = x;
  this.y = y;
  this.renderer = renderer;
  this.direction = Math.floor(Math.random()*4);
  this.update = function(dt, ctx) {
    this.renderer.update(Math.floor(this.x), Math.floor(this.y), ctx);
  };
}
