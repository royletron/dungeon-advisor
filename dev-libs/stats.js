var stats = new Stats();
stats.setMode( 1 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

var update = function () {

    stats.begin();

    // monitored code goes here

    stats.end();

    requestAnimationFrame( update );

};

requestAnimationFrame( update );