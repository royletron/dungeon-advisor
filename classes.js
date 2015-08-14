function Char (symbol, color, bg) {
    this.symbol = symbol;
    this.color = color;
    this.bg = bg;
    this.render = function(x, y) {
      if(this.bg !== undefined)
      {
        context.fillStyle = this.bg;
        context.fillRect(x * CHAR_WIDTH, (y-1) * CHAR_HEIGHT, CHAR_WIDTH, CHAR_HEIGHT);
      }
      context.fillStyle = this.color;
      context.fillText(this.symbol, x * CHAR_WIDTH, y * CHAR_HEIGHT);
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
  this.update = function() {
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
