global.HELP = {
	init: function(){
		var t = this;
		t.arr = ['', 'Welcome to Dungeon Advisor - For trusted dungeon advice']
		t.r = new Renderer(GAME.width, GAME.height);
		t.p = 0;
		t.d();
		t.n();
	},
	d: function() {
		this.r.x.clearRect(0, 0, GAME.width, GAME.height);
		this.r.x.globalAlpha = 0.3;
		H.R(0, 0, GAME.width, GAME.height, this.r.x, 'FF0000');
		this.r.x.globalAlpha = 1;
	},
	n: function(){
		var a = this.arr;
		var p = this.p;
		p++
		if(p*2 >= a.length)
			p = 0;
		var i = a[p];
		var t = a[p+1];
		console.log(i,t);
		if(i.length == 0){
			H.T(t, GAME.width/2, GAME.height/2, this.r.x, FONT, 'FFFFFF', 'center');
		}
	},
	update: function(dt){

	},
	draw: function(){
		this.r.stamp(g_ctx);
	}
}