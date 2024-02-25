import satelliteImagePath from "./assets/flappybird/satellite.png";
import towerImagePath from "./assets/flappybird/tower.png";
import rotatedTowerImagePath from "./assets/flappybird/rotatedTower.png"

import { Button } from "./ui";

let bird;
let gravity = 0.5;
let score = 0;
let dead = false;
let pipeWHitboxError = 20;

let satelliteImage, towerImage, rotatedTowerImage; 

let replayButton;

export function flappyPreLoad(p) {
	satelliteImage = p.loadImage(satelliteImagePath);
	towerImage = p.loadImage(towerImagePath);
	rotatedTowerImage = p.loadImage(rotatedTowerImagePath);
}

export function flappySetup(p) {
	bird = new Bird(p);

	for (let i = 0; i < 2; ++i) {
		let x = p.width * 0.8 + i * Pipe.spread;
		let h = p.random(p.height * 0.1, p.height * 0.6);
		Pipe.pipes.push(new Pipe(p, x, h/2, h));
		let nh = p.height - h - Pipe.gap;
		Pipe.pipes.push(new Pipe(p, x, h + Pipe.gap + nh/2, nh));
	}

	replayButton = new Button(p, p.width * 0.5, p.height * 0.85, 100, 50, "Replay", 20, () => {
		Pipe.pipes = [];
		score = 0;
		flappySetup(p);
		dead = false;
	});
}

export function flappyDraw(p) {
	p.background(0);

	if (dead) {
		p.textAlign(p.CENTER, p.CENTER);
		p.fill(255, 0, 0);
		p.textSize(64);
		p.text("Game Over!", p.width * 0.5, p.height * 0.2);
		p.text("Score: " + score, p.width * 0.5, p.height * 0.5);
		p.fill(255);
		p.textSize(32);
		p.text("Press R", p.width * 0.5, p.height * 0.7);
		p.text("or click", p.width * 0.5, p.height * 0.75);
		replayButton.run(p.color(255), p.color(0), p.color(100));
	} else {
		bird.run(p);
	
		for (let i = Pipe.pipes.length - 1; i >= 0; --i) {
			let pipe = Pipe.pipes[i];
			if (pipe.position.x + pipe.shape.x/2 < 0) {
				Pipe.pipes.splice(i, 1);
				score += 0.5;
	
				let x = Pipe.pipes[Pipe.pipes.length - 1].position.x + Pipe.spread;
				let h = p.random(p.height * 0.1, p.height * 0.6);
				Pipe.pipes.push(new Pipe(p, x, h/2, h));
				let nh = p.height - h - Pipe.gap;
				Pipe.pipes.push(new Pipe(p, x, h + Pipe.gap + nh/2, nh));
			}
			pipe.run(p);
		}

		p.fill(255);
		p.textSize(32);
		p.text("Score: " + score, p.width * 0.15, p.height * 0.1);
	}

}

export function flappyKeyPressed(p) {
	if (p.keyCode === 38 || p.keyCode === 32 || p.keyCode === 87) {
		bird.jump(p);
	}

	if (dead && p.keyCode === 82) {
		Pipe.pipes = [];
		score = 0;
		flappySetup(p);
		dead = false;
	}
}

export function flappyMousePressed(p) {
	bird.jump(p);

	if (dead) {
		replayButton.mousePressed();
	}
}

class Bird {
	static upSpeed = 10;

	constructor(p) {
		this.position = p.createVector(p.width * 0.15, p.height * 0.5);
		this.velocity = p.createVector(0, 0);
		this.acceleration = p.createVector(0, 0);
		this.shape = p.createVector(70, 70);
	}

	applyForce(force) {
		this.acceleration.add(force);
	}

	jump(p) {
		bird.velocity.mult(0);
		bird.applyForce(p.createVector(0, -Bird.upSpeed));
	}

	run(p) {
		this.applyForce(p.createVector(0, gravity));

		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.mult(0);

		if (this.position.y + this.shape.y/2 > p.height) {
			this.position.y = p.height - this.shape.y/2;
			this.velocity.mult(0);
		} else if (this.position.y - this.shape.y/2 < 0) {
			this.position.y = this.shape.y/2;
			this.velocity.mult(0);
		}

		p.noStroke();
		p.fill(255);
		p.image(satelliteImage, this.position.x, this.position.y, this.shape.x, this.shape.y)

		for (let pipe of Pipe.pipes) {
			if (pipe.position.x > this.position.x - this.shape.x/2 - pipe.shape.x/2) {
				let left = this.position.x - this.shape.x/2;
				let right = this.position.x + this.shape.x/2;
				let top = this.position.y - this.shape.y/2;
				let bottom = this.position.y + this.shape.y/2;

				if (left > pipe.position.x - pipe.shape.x/2 + pipeWHitboxError/2 && left < pipe.position.x + pipe.shape.x/2 - pipeWHitboxError/2 ||
					right > pipe.position.x - pipe.shape.x/2 + pipeWHitboxError/2 && right < pipe.position.x + pipe.shape.x/2 - pipeWHitboxError/2) {
					if (top > pipe.position.y - pipe.shape.y/2 && top < pipe.position.y + pipe.shape.y/2 ||
						bottom > pipe.position.y - pipe.shape.y/2 && bottom < pipe.position.y + pipe.shape.y/2) {
						dead = true;
						break;
					}
				}
			}
		}
	}
}

class Pipe {
	static gap = 250;
	static width = 50;
	static pipes = [];
	static speed = 3;
	static spread = 250;

	constructor(p, x, y, h) {
		this.position = p.createVector(x, y);
		this.velocity = p.createVector(-Pipe.speed, 0);
		this.shape = p.createVector(Pipe.width, h);
	}

	run(p) {
		this.position.add(this.velocity);

		// p.fill(0, 255, 0);
		// p.stroke(255, 0, 0);
		// p.strokeWeight(2);
		// p.rect(this.position.x, this.position.y, this.shape.x - pipeWHitboxError, this.shape.y);
		if (this.position.y > p.height * 0.5) {
			p.image(towerImage, this.position.x, this.position.y, this.shape.x, this.shape.y);
		} else {
			p.image(rotatedTowerImage, this.position.x, this.position.y, this.shape.x, this.shape.y);
		}
	}
}