window.onload = function() {
	var initialize = function() {
		var socket = io.connect('http://localhost:3000');
		socket.on('connect', function() {
			socket.on('disconnect', function() {
				console.log(message);
			});
			socket.on('message', function(message, callback) {
				console.log(message);
			});
		});

		var screenWidth = 360;
		var screenHeight = 360;
		// initialize
		var game = new Game(screenWidth, screenHeight);

		// preload image
		game.fps = 20;
		var screen = new Sprite(screenWidth, screenHeight);
		var surface = new Surface(screenWidth, screenHeight);
		screen.image = surface;
		game.rootScene.addChild(screen);
		var context = surface.context;
		var boxState = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
		game.onload = function() {
			game.rootScene.addEventListener('enterframe', function(e) {
				context.clearRect();
				for (var i = 0; i < boxState.length; i++) {
					for (var j = 0; j < boxState[i].length; j++) {
						context.beginPath();
						if (boxState[i][j] == 1) {
							drawArc(context, screenWidth, screenHeight, j, i);
						}
					}
				}
				drawBox(context, screenWidth, screenHeight);
			});
			game.rootScene.addEventListener('touchstart', function(e) {
				context.beginPath();
				var posX = parseInt(e.x / (screenWidth / 3));
				var posY = parseInt(e.y / (screenHeight / 3));
				boxState[posY][posX] = 1;
				socket.emit('touchEvent', {
					'posX' : posX,
					'posY' : posY
				});
			});
		};
		game.start();
	}
	var drawArc = function(context, screenWidth, screenHeight, touchX, touchY) {
		var i = (screenWidth / 3);
		var j = (screenHeight / 3);
		var x = (i * touchX) + (i / 2);
		var y = (j * touchY) + (j / 2);
		var radius = 40;
		var startAngle = 0, endAngle = Math.PI * 2;
		var anticlockwise = false;
		context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	}
	var drawBox = function(context, screenWidth, screenHeight) {
		var x = screenWidth / 3;
		var y = screenHeight / 3;
		context.moveTo(0, 0);
		context.lineTo(screenWidth, 0);
		context.moveTo(0, 0);
		context.lineTo(0, screenHeight);
		context.moveTo(screenWidth, screenHeight);
		context.lineTo(screenWidth, 0);
		context.moveTo(screenWidth, screenHeight);
		context.lineTo(0, screenHeight);
		for (var i = 0; i < 2; i++) {
			context.moveTo(x * (i + 1), 0);
			context.lineTo(x * (i + 1), screenHeight);
			context.moveTo(0, y * (i + 1));
			context.lineTo(screenWidth, y * (i + 1));
		}
		context.stroke();
	}
	enchant();
	initialize();
}