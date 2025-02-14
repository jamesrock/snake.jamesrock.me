(function() {

	class Food {
		constructor(x, y) {

			this.x = x;
			this.y = y;

		};
		color = 'grey';
	};
	
	class Segment {
		constructor(x, y) {

			this.x = x;
			this.y = y;

		};
		color = 'black'
	};

	class Snake {
		constructor() {

			this.node = document.createElement('div');
			this.scoreNode = document.createElement('div');
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');
			this.width = 350;
			this.height = 500;
			this.size = 10;
			this.speed = 300;
			this.increment = 5;
			this.eaten = 0;
			this.direction = directions.right;
			this.segments = [];
			this.foods = [];

			this.node.classList.add('snake');
			this.scoreNode.classList.add('score');

			this.canvas.width = this.width;
			this.canvas.height = this.height;

			this.node.appendChild(this.scoreNode);
			this.node.appendChild(this.canvas);

			this.updateScore();

		};
		start() {

			var
			snake = this,
			startLength = snake.size;

			for (var i = 0; i < startLength; i++) {
				snake.segments.push(new Segment(i, 0));
			};

			snake.createFoods();

			snake.draw();

		};
		draw() {

			var
			snake = this;

			snake.canvas.width = snake.width;

			snake.segments.forEach(function(seg) {
				snake.ctx.fillStyle = seg.color;
				snake.ctx.fillRect(snake.inflate(seg.x), snake.inflate(seg.y), snake.size, snake.size);
			});
			
			snake.foods.forEach(function(food) {
				snake.ctx.fillStyle = food.color;
				snake.ctx.fillRect(snake.inflate(food.x), snake.inflate(food.y), snake.size, snake.size);
			});

			setTimeout(function() {
				snake.update();
			}, snake.speed - (snake.increment * snake.eaten));

		};
		update() {

			var 
			seg = this.segments[this.segments.length-1],
			x = seg.x,
			y = seg.y;

			switch(this.direction) {
				case directions.right:
					x ++;
				break;
				case directions.left:
					x --;
				break;
				case directions.down:
					y ++;
				break;
				case directions.up:
					y --;
				break;
			};

			if(this.checkCollision(x, y)) {
				if(confirm(`GAME OVER\nYou scored ${snake.eaten}. Press OK to try again.`)) {
					snake.reset();
				};
				return;
			};

			this.checkFood(x, y);

		};
		checkCollision(x, y) {

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

		};
		checkFood(x, y) {

			var
			snake = this;

			snake.foods.forEach(function(food, i) {

				if(food.x === x && food.y === y) {
					
					snake.eaten ++;
					snake.segments.push(new Segment(food.x, food.y));

					snake.foods.splice(i, 1);
					snake.updateScore();

					return 'break';
					
				};

			});

			if(snake.foods.length === 0) {
				
				snake.createFoods();

			};
			
			snake.move(x, y);

		};
		createFoods() {

			this.foods.push(new Food(this.getRandomX(), this.getRandomY()));

			return this;

		};
		move(x, y) {
			
			var 
			snake = this,
			seg = snake.segments.shift();

			seg.x = x;
			seg.y = y;
			snake.segments.push(seg);

			snake.draw();

		};
		turn(direction) {

			console.log(`snake.turn(${direction})`);

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

		};
		updateScore() {

			this.scoreNode.innerHTML = this.eaten;
			return this;

		};
		renderTo(to) {

			to.appendChild(this.node);
			return this;

		};
		reset() {

			location.reload();
			return this;

		};
		inflate(a) {
			
			return (a * this.size);

		};
		deflate(a) {
			
			return (a / this.size);

		};
		getRandom(max) {

			return Math.floor(Math.random() * ((max - this.size) / this.size));

		};
		getRandomX() {

			return this.getRandom(this.width);

		};
		getRandomY() {

			return this.getRandom(this.height);

		};
	};

	var 
	body = document.body,
	snake,
	swipeThreshold = 30,
	swipeThresholdInverse = (swipeThreshold*-1),
	touchX,
	touchY,
	directions = {
		'left': 'ArrowLeft',
		'up': 'ArrowUp',
		'right': 'ArrowRight',
		'down': 'ArrowDown'
	},
	snake = new Snake();

	snake.renderTo(body);

	document.addEventListener('keydown', function(e) {

		console.log(e);

		return snake.turn(e.key);

	});
	document.addEventListener('touchstart', function(e) {

		var
		firstTouch = e.originalEvent.touches[0];

		touchX = firstTouch.clientX;
		touchY = firstTouch.clientY;

		return false;

	});
	document.addEventListener('touchmove', function(e) {

		var
		firstTouch = e.originalEvent.changedTouches[0],
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
	document.addEventListener('touchend', function(e) {

		return false;

	});
	
	snake.start();

})();