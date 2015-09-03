var t = global.UI = {
  renderer: null,
  gold: 1000,
  lvl: 1,
  w: null,
  h: null,
  floors: [[undefined, undefined, undefined, undefined]],
  max_rooms: 4,
  max_floors: 1,
  change: false,
  clouds: [],
  spawn_counter: 0,
  spawn_wait: 0,
  popularity: 5,
  spawn_point: {x: 0, y: 13.5},
  heroes: [],
  num_heroes: 0,
  bg: null,
  fg: null,
  ctx: null,
  add_floor_button: new Button('Add Floor', function(){
    UI.addFloor();
  },1, 1, 80),
  statuses: [],
  counters: [],
  buttons: [],
  rb: [],
  changed: false,
  offset: 0,
  r_total: 0,
  r_count: 0,
  init: function(ctx){
    t.ctx = ctx;
    t.w = Math.floor(GAME.width / CHAR_WIDTH);
    t.h = Math.floor(GAME.height / CHAR_HEIGHT);
    t.renderer = new Renderer(GAME.width, GAME.height, 1);
    t.bg = new Renderer(GAME.width, GAME.height, 1);
    t.fg = new Renderer(GAME.width, GAME.height, 1);
    t.rating = new StarRating();
    t.p = new Renderer(CHAR_WIDTH*28, CHAR_HEIGHT*20, 1);
    for(var x=0; x < t.w; x++) {
      if(Math.random() > 0.95)
      {
        var c = new Sprite(x, H.GR(1, 3), new Char('@', 'FFFFFF', undefined, 0.2));
        c.body.velocity.x = 1;
        t.clouds.push(c);
      }
      if((x%14 === 0) && (Math.random() > 0.5) && (x > 20))
      S.OUTDOOR.stamp.stamp(t.bg.x, x, 0);
      for(var y=0; y < t.h; y++) {
        if(y > 4)
          if((x > t.w-31) && (x < t.w-2) && (y > 5) && (y < t.h - 1))
            if(y == 24)
              P.randomSolid().stamp(t.bg.x, x, y);
            else
              P.BOX_MD.stamp(t.bg.x, x, y);
            else if((x < 2) || (x > (t.w-33)) || (y < 6))
              P.randomSolid().stamp(t.fg.x, x, y);
            else
              if((y%ROOM_HEIGHT) == 5)
                if(Math.ceil(y/ROOM_HEIGHT)-1 > (t.floors.length))
                  P.OFF_FLOOR.stamp(t.bg.x, x, y);
                else
                  P.FLOOR.stamp(t.bg.x, x, y);
                else
                  if(y == t.h-1)
                    P.randomSolid().stamp(t.bg.x, x, y);
                  else
                    P.VOID.stamp(t.bg.x, x, y);
      }
    }
    t.bg.x.font = HEADING_FONT;
    t.bg.x.strokeStyle = 'white';
    t.bg.x.lineWidth = 5;
    t.bg.x.strokeText('dungeon', 10, 44);
    t.bg.x.fillText('dungeon', 10, 44);
    t.bg.x.fillStyle = '#579441';
    t.bg.x.strokeText('advisor', 135, 44);
    t.bg.x.fillText('advisor', 135, 44);
    t.renderer.stamp(ctx);

    t.add_floor_button.y = 10 + (t.floors.length * ROOM_HEIGHT);
    t.add_floor_button.x =((t.w-29)/2) - 8;

    t.counters.push(new Counter(P.GOLD, t, 'gold'));
    t.counters.push(new Counter(new Char('#', 'FA6728'), t, 'num_heroes'));
    t.addRoom(R.ENTRANCE);
  },
  addFloor: function() {
    if(t.gold >= 80)
    {
      t.floors.push([undefined, undefined, undefined, undefined]);
      t.setGold(-80);
      for(x = 2; x <  t.w-32; x++)
      P.FLOOR.stamp(t.bg.x, x, ((t.floors.length+1)* ROOM_HEIGHT) - 4);
      t.add_floor_button.y += ROOM_HEIGHT;
    }
  },
  addStatus: function(hero, title, text){
    var tmp = [];
    tmp.push(new StatusUpdate(hero, title, text));
    t.statuses.forEach(function(status){
      tmp.push(status);
    });
    if(tmp.length > 4)
    tmp.pop().kill();
    t.statuses = tmp;
  },
  addRoom: function(type, position){
    if(position === undefined)
    {
      t.floors[0][0] = new Room(type, false, 0, 0);
      return t.floors[0][0]
    }
    else
      if( t.floors[position.y] !== undefined) {
        t.floors[position.y][position.x] = new Room(type, (position.y%2) == 1, position.x, position.y);
        return t.floors[position.y][position.x];
    }
  },
  spawnHero: function() {
    var h = E.GRHero(1);
    t.heroes.push(h);
    t.num_heroes =  t.heroes.length;
    t.setGold(h.type.fee * t.lvl);
  },
  removeHero: function(hero) {
    var exp = H.Summarise(hero);
    t.r_total += exp.r;
    t.r_count += 1;
    t.rating.setNum((t.r_total/t.r_count)*5);
    t.addStatus(hero, (exp.r*5).toFixed(1)+' rating from '+hero.name, exp.s);
    if(t.sh && (t.sh.id == hero.id))
      t.sh = undefined;
    H.RemoveFromArray( t.heroes, hero, 'id');
    hero.end();
    H.Null(hero);
    t.num_heroes =  t.heroes.length;
  },
  _clicked: false,
  update: function(dt){
    t.offset += dt*5;
    if(t.changed)
      t.setSelection(t.sr);
    t.changed = false;
    t.clouds.forEach(function(cloud, idx){
      cloud.update(dt);
      if(cloud.x > ( t.w + 2))
      cloud.body.x = -1;
    }.bind( t));
    t.spawn_counter += dt;
    if( t.spawn_counter >  t.spawn_wait)
    {
      t.spawn_counter = 0;
      t.spawn_wait = H.GR(24- ( t.popularity*4), (24 - ( t.popularity*4)) + ( 24 - ( t.popularity*4)));
      t.spawnHero();
    }
    t.heroes.forEach(function(hero) {
      hero.update(dt);
      if(hero.s.x < ( t.w - 32))
      {
        if(hero.s.x < ( t.spawn_point.x - 2))
        if(hero.current_floor <  t.floors.length)
        t.flipHero(hero);
        else
        t.removeHero(hero);
      }
      else
      {
        if(hero.current_floor < ( t.floors.length))
        t.flipHero(hero);
        else
        t.removeHero(hero);
      }
    }.bind( t));

    if(H.MouseClick)
    {
      t.floors.forEach(function(floor, y){
        floor.forEach(function(room, x){
          if(H.HT(H.MouseCoords, {x: (2+(x * ROOM_WIDTH)) * CHAR_WIDTH, y: (6 + (y * ROOM_HEIGHT)) * CHAR_HEIGHT, width: ROOM_WIDTH*CHAR_WIDTH, height: ROOM_HEIGHT*CHAR_HEIGHT}))
          t.setSelection(room || {x: x, y: y, found: false});
        }.bind( t));
      }.bind( t));
      t.heroes.forEach(function(hero){
        if(H.HT(H.MouseCoords, {x: hero.body.x * CHAR_WIDTH, y: hero.body.y * CHAR_HEIGHT, width:CHAR_WIDTH, height:CHAR_HEIGHT}))
          t.setSelection(hero, true);
      }.bind(t))
    }
    if( t.sr !== undefined)
    if( t.sr.found === false) {
      t.rb.forEach(function(button){
        button.update(dt);
      });
    }
    t.buttons.forEach(function(b){
      b.update(dt);
    })
    t.add_floor_button.update(dt);
  },
  cPs: function() {
    t.p.x.clearRect(0, 0,  t.p.canvas.width,  t.p.canvas.height);
  },
  setSelection: function(room, isHero) {
    t.sh = t.sr = undefined;
    t.cPs();
    if(isHero) {
      var h = t.sh = room;
      var a = new Avatar(h);
      a.stamp(t.p.x, 0.5, 0.5);
      a.kill();
      H.Null(a);
      H.T(h.name+' (lvl '+h.lvl+' '+h.type.name+')', 34, 15 + CHAR_HEIGHT, t.p.x, FONT, 'FFFFFF');
      var r = H.Summarise(h);
      var w = new TypeWriter(r.s, 22, 200);
      w.arr.forEach(function(l){
        H.T(l.c, l.x+34, l.y+30, t.p.x, STATUS_FONT, 'FFFFFF');
      });
    }
    else
    {
      t.sr = room;
      t.buttons.forEach(function(b) {
        b.kill();
      })
      t.buttons = [];
      if( t.sr !== undefined){
        if( t.sr.found === false)
        {
          R.all().forEach(function(room, idx){
            var r = R[room];
            H.T(r.name, 10, 18+ (CHAR_HEIGHT*1.8)*(idx),  t.p.x, FONT, 'FFFFFF');
            if( t.rb[idx] === undefined)
            {
              t.rb.push(new Button('Add', function(d){
                var room = UI.addRoom(R[d], UI.sr);
                UI.setSelection(room);
                UI.gold += -room.type.cost;
              }, ( t.w - 30)+16, 6+(idx*1.8), r.cost, room));
            }
            t.rb[idx].stamp( t.p.x, 16, idx*1.8);
          }.bind(t));
        }
        else
        {
          if(room.type)
            if(room.type.battle)
            {
              room.slots.forEach(function(s, i){
                if(s.npc)
                {
                  var a = new Avatar(s.npc.c, true);
                  H.T(s.npc.name+' ('+s.npc.type.name+')', 36, 18 + (CHAR_HEIGHT*1.8)*(i*2), t.p.x, FONT, 'FFFFFF');
                  a.stamp(t.p.x, 0, (i*2)*1.8);
                  H.Null(a);
                }
                else
                {
                  H.T('empty', 36, 18 + (CHAR_HEIGHT*1.8)*(i*2), t.p.x, FONT, 'EDEDED');
                }
              });
              var w = 0;
              var h = 0;
              room.type.enemies.split('').forEach(function(e, i){
                var en = E.GetEnemy(e);
                var f = false;
                var n = new Button(en.name, function(d){
                  d.r.slots.forEach(function(s, idx){
                    if((s.npc == undefined) && !f)
                    {
                      f = true;
                      s.npc = new Enemy(en, s, d.r);
                    }
                  })
                  t.changed = true;
                }, (t.w - 30) + w, 6+(((room.slots.length*2)+0.2+h)*1.8), Math.floor(H.Moultonize(UI.lvl, en.cost.b, en.cost.t)), {e: en, r: room});
                t.buttons.push(n);
                n.stamp(t.p.x, 0+w, (((room.slots.length * 2)+0.2+h)*1.8));
                w += n.r.width/CHAR_WIDTH;
                if(w > 17) { h++; w = 0; }
              });
            }
            else if(room.type.actions)
              room.type.actions.forEach(function(a, i){
                H.T(a.n, 10, 18 + (CHAR_HEIGHT*1.8)*i, t.p.x, FONT, 'FFFFFF');
                H.T(a.val, 195, 18 + (CHAR_HEIGHT*1.8)*i, t.p.x, FONT, 'FFFFFF', 'center');
                t.createStepper(room, t, a, i)
              });
        }
      }
    }
  },
  createStepper: function(room, t, a, i) {
    var b = new Button('↑', function(d){
      d.a.val += 1;
      UI.setSelection(d.r);
    }, (t.w - 30)+17, 6+(i*1.8), undefined, {r: room, a: a});
    var c = new Button('↓', function(d){
      d.a.val += -1;
      UI.setSelection(d.r);
    }, (t.w - 30)+24, 6+(i*1.8), undefined, {r: room, a: a});
    if(a.val !== a.c.t) {
      t.buttons.push(b);
      b.stamp(t.p.x, 17, i*1.8);
    }
    if(a.val !== a.c.b) {
      t.buttons.push(c);
      c.stamp(t.p.x, 24, i*1.8);
    }
  },
  setGold: function(amount) {
    t.gold += amount;
    // this.setSelection(this.selected_room);
  },
  flipHero: function(hero) {
    if(hero.current_floor === undefined)
      hero.current_floor = 1;
    else
      hero.current_floor += 1;
    hero.body.y += ROOM_HEIGHT;
    hero.turnAround();
    return hero;
  },
  drawSelection: function(ctx, x, y, width, height) {
    ctx.strokeStyle = "#25989B";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.lineDashOffset = -t.offset;
    ctx.strokeRect(x*CHAR_WIDTH, y*CHAR_HEIGHT, width*CHAR_WIDTH, height*CHAR_HEIGHT);
  },
  draw: function() {
    var ctx =  t.renderer.x;
    ctx.clearRect(0, 0, GAME.width, GAME.height);

    t.bg.stamp(ctx);

    t.clouds.forEach(function(cloud, idx){
      cloud.stamp(ctx);
    });
    t.floors.forEach(function(floor, y) {
      floor.forEach(function(room, x) {
        if(room !== undefined)
        {
          room.renderer.stamp(ctx, 2 + (x * ROOM_WIDTH), 6 + (y * ROOM_HEIGHT));
          if(room.slots)
            room.slots.forEach(function(s){
              if(s != undefined)
                if(s.npc)
                  s.npc.c.stamp(ctx, 2 +  (x * ROOM_WIDTH) + s.x, 6 + (y * ROOM_HEIGHT) + 7.6);
            })
        }
        else{
          S.ADD_ROOM.stamp.stamp(ctx, (x * ROOM_WIDTH) + 8, (y * ROOM_HEIGHT) + 8);
        }
      });
    });
    t.heroes.forEach(function(hero) {
      hero.stamp(ctx);
    });

    var j = 0;
    t.statuses.forEach(function(status){
      status.stamp(ctx,  t.w-29, 25.5 + j);
      j += status.height;
    }.bind(t));

    t.p.stamp(ctx,  t.w -30, 6);

    t.counters.forEach(function (counter, x){
      counter.stamp(ctx, 3 + (x*8), 4);
    }.bind( t));

    t.add_floor_button.stamp(ctx);
    t.fg.stamp(ctx);

    t.rating.stamp(ctx, 16, 4);

    if( t.sr !== undefined)
      t.drawSelection(ctx, (2+(t.sr.x*ROOM_WIDTH)), (6 + (t.sr.y*ROOM_HEIGHT)), ROOM_WIDTH, ROOM_HEIGHT);
    else if( t.sh !== undefined)
      if(t.sh.facing == RIGHT)
        t.drawSelection(ctx, t.sh.body.x - 0.2, t.sh.body.y -0.3, 1.8, 1.6);
      else
        t.drawSelection(ctx, t.sh.body.x - 0.8, t.sh.body.y -0.3, 1.8, 1.6);
    //  t.type.stamp(ctx,  t.w-27, 9);

    t.renderer.stamp(g_ctx);
  }
};
