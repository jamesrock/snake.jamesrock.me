(function() {

	var 
	body = document.body,
	snake,
	swipeThreshold = 30,
	swipeThresholdInverse = (swipeThreshold*-1),
	touchX,
	touchY,
	directions = {
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		rotate: 32
	},
	Food = ROCK.Object.extend({
		constructor: function Food(x, y) {

			this.x = x;
			this.y = y;

		},
		color: "grey"
	}),
	Segment = ROCK.Object.extend({
		constructor: function Segment(x, y) {

			this.x = x;
			this.y = y;

		},
		color: "black"
	}),
	Snake = ROCK.Object.extend({
		constructor: function Snake() {

			this.node = ROCK.DOM.createNode("div");
			this.scoreNode = ROCK.DOM.createNode("div");
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			this.width = 350;
			this.height = 500;
			this.level = 1;
			this.size = 10;
			this.speed = 280;
			this.eaten = 0;
			this.direction = directions.right;
			this.segments = [];
			this.foods = [];

			ROCK.DOM.addClass(this.node, "snake");
			ROCK.DOM.addClass(this.scoreNode, "score");

			this.canvas.width = this.width;
			this.canvas.height = this.height;

			ROCK.DOM.append(this.scoreNode, this.node);
			ROCK.DOM.append(this.canvas, this.node);

			this.updateScore();

		},
		start: function() {

			var
			snake = this,
			startLength = snake.size;

			for (var i = 0; i < startLength; i++) {
				snake.segments.push(new Segment(i, 0));
			};

			snake.createFoods();

			snake.draw();

		},
		draw: function() {

			var
			snake = this;

			snake.canvas.width = snake.width;
			
			ROCK.ARRAY.each(snake.segments, function(seg) {
				snake.ctx.fillStyle = seg.color;
				snake.ctx.fillRect(snake.inflate(seg.x), snake.inflate(seg.y), snake.size, snake.size);
			});

			ROCK.ARRAY.each(snake.foods, function(food) {
				snake.ctx.fillStyle = food.color;
				snake.ctx.fillRect(snake.inflate(food.x), snake.inflate(food.y), snake.size, snake.size);
			});

			setTimeout(function() {
				snake.update();
			}, snake.speed/snake.level);

		},
		update: function() {

			var 
			seg = ROCK.ARRAY.last(this.segments),
			x = seg.x,
			y = seg.y;

			if(this.direction === directions.right) {
				x ++;
			} 
			else if(this.direction === directions.left) {
				x --;
			} 
			else if(this.direction === directions.down) {
				y ++;
			} 
			else if(this.direction === directions.up) {
				y --;
			};

			if(this.checkCollision(x, y)) {
				if(confirm("GAME OVER\nYou scored " + snake.eaten + ". Press OK to try again.")) {
					snake.reset();
				};
				return;
			};

			this.checkFood(x, y);

		},
		checkCollision: function(x, y) {

			var 
			collision = false,
			snake = this,
			seg;

			for(var i = 1; i < snake.segments.length; i++) {
				seg = snake.segments[i];
				if(seg.x === x && seg.y === y) {
					collision = true;
				};
			};

			if((x === -1) || (y === -1) || (snake.inflate(x) === snake.width) || (snake.inflate(y) === snake.height)) {
				collision = true;
			};

			return collision;

		},
		checkFood: function(x, y) {

			var
			snake = this;

			ROCK.ARRAY.each(snake.foods, function(food, i) {

				if(food.x === x && food.y === y) {
					
					snake.eaten ++;
					snake.segments.push(new Segment(food.x, food.y));

					snake.foods.splice(i, 1);
					snake.updateScore();

					return "break";
					
				};

			});

			if(snake.foods.length === 0) {
				
				snake.level ++;
				snake.createFoods();

			};
			
			snake.move(x, y);

		},
		createFoods: function() {

			for(var i = 0; i < this.level; i++) {
				this.foods.push(new Food(this.getRandomX(), this.getRandomY()));
			};

			return this;

		},
		move: function(x, y) {
			
			var 
			snake = this,
			seg = snake.segments.shift();

			seg.x = x;
			seg.y = y;
			snake.segments.push(seg);

			snake.draw();

		},
		rotate: function() {

			var
			direction;

			switch(this.direction) {
				case directions.right:
					direction = directions.down;
				break;
				case directions.down:
					direction = directions.left;
				break;
				case directions.left:
					direction = directions.up;
				break;
				case directions.up:
					direction = directions.right;
				break;
			};

			return direction;

		},
		turn: function(direction) {

			var 
			move = false;

			if(!direction) {
				return move;
			};

			if((direction === directions.left) && (this.direction != directions.right)) {
				move = true;
			}
			else if((direction === directions.up) && (this.direction != directions.down)) {
				move = true;
			}
			else if((direction === directions.right) && (this.direction != directions.left)) {
				move = true;
			}
			else if((direction === directions.down) && (this.direction != directions.up)) {
				move = true;
			};

			if(move) {
				this.direction = direction;
			};

			return move;

		},
		updateScore: function() {

			ROCK.DOM.html(this.scoreNode, this.eaten);
			return this;

		},
		renderTo: function(to) {

			ROCK.DOM.append(this.node, to);
			return this;

		},
		reset: function() {

			location.reload();
			return this;

		},
		inflate: function(a) {
			
			return (a * this.size);

		},
		deflate: function(a) {
			
			return (a / this.size);

		},
		getRandom: function(max) {

			return Math.floor(Math.random() * ((max - this.size) / this.size));

		},
		getRandomX: function() {

			return this.getRandom(this.width);

		},
		getRandomY: function() {

			return this.getRandom(this.height);

		}
	});

	snake = new Snake();
	snake.renderTo(body);

	document.addEventListener("keydown", function(e) {

		return snake.turn(e.keyCode);

	});
	document.addEventListener("touchstart", function(e) {

		var
		firstTouch = ROCK.ARRAY.first(e.originalEvent.touches);

		touchX = firstTouch.clientX;
		touchY = firstTouch.clientY;

		return false;

	});
	document.addEventListener("touchmove", function(e) {

		var
		firstTouch = ROCK.ARRAY.first(e.originalEvent.changedTouches),
		touchXDiff = (firstTouch.clientX - touchX),
		touchYDiff = (firstTouch.clientY - touchY),
		direction;

		if((touchXDiff >= swipeThreshold)) {
			direction = directions.right;
		}
		else if((touchXDiff <= swipeThresholdInverse)) {
			direction = directions.left;
		}
		else if((touchYDiff >= swipeThreshold)) {
			direction = directions.down;
		}
		else if((touchYDiff <= swipeThresholdInverse)) {
			direction = directions.up;
		};

		snake.turn(direction);

		return false;

	});
	document.addEventListener("touchend", function(e) {

		return false;

	});
	
	snake.start();

})();