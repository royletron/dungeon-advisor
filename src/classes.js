function Char (symbol, color, bg) {
    this.symbol = symbol;
    this.color = color;
    this.bg = bg;
    this._old = {};
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.render = function(x, y, to) {
      if((this.symbol != this._old.s) || (this.color != this._old.c) || (this.bg != this._old.b))
      {
        //We need to draw the canvas;

        if(this.bg !== undefined)
        {
          this.context.fillStyle = this.bg;
          this.context.fillRect(0, 0, CHAR_WIDTH, CHAR_HEIGHT);
        }
        this.context.fillStyle = this.color;
        this.context.align = 'center';
        this.context.font = FONT;
        this.context.fillText(this.symbol, 0, CHAR_HEIGHT);
        this._old = {s: this.symbol, c: this.color, b: this.bg};
      }

      if(to === undefined)
        to = content;
      to.drawImage(this.canvas, x * CHAR_WIDTH, y * CHAR_HEIGHT);
    };
}

function Renderer (chars) {
  this.chars = chars;
  this.update = function(this_x, this_y){
    chars.forEach(function (row, y) {
      row.forEach(function (column, x) {
        if(column !== undefined)
        {
          buffer.addItem(x + this_x, y + this_y, column);
        }
      });
    });
  };
}

function Baddie(x, y, renderer) {
  this.x = x;
  this.y = y;
  this.renderer = renderer;
  this.direction = Math.floor(Math.random()*4);
  this.update = function(dt) {
    this.x += 0.5 * dt;
    this.renderer.update(Math.floor(this.x), Math.floor(this.y));
  };
}

function Boat (x, y) {
  this.x = x;
  this.y = y;
  this.renderer = new Renderer([
    [undefined, new Char('@', '#998888'), undefined],
    [new Char('@', '#121212'), new Char('@', '#121212'), new Char('@', '#121212')],
  ]);
  this.update = function() {
    this.renderer.update(Math.floor(this.x), Math.floor(this.y));
  };
}
