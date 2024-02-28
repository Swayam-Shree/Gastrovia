import satelliteImagePath from "./assets/flappybird/satellite.png";
import towerImagePath from "./assets/flappybird/tower.png";
import rotatedTowerImagePath from "./assets/flappybird/rotatedTower.png"

import { Button, TextBox } from "./ui";
import { pointInRect } from "./util";

let bird;
let gravity = 0.5;
let score = 0;
let dead = false;
let satelliteHitboxError = 15;
let pipeWHitboxError = 20;

let targetScore = 30;
let stateCleared = false;

let stars = [];
let starCount = 10;
let minStarRadius = 0.2;
let maxStarRadius = 2;
let minStarSpeed = 0.2;
let maxStarSpeed = 8;
let starDrift = 0.3;

let satelliteImage, towerImage, rotatedTowerImage; 

let replayButton, continueButton;
let answerBox;

export function flappyPreLoad(p) {
	satelliteImage = p.loadImage(satelliteImagePath);
	towerImage = p.loadImage(towerImagePath);
	rotatedTowerImage = p.loadImage(rotatedTowerImagePath);
}

export function flappySetup(p) {
	bird = new Bird(p);

	for (let i = 0; i < 6; ++i) {
		let x = p.width * 0.8 + i * Pipe.spread;
		let h = p.random(p.height * 0.1, p.height * 0.6);
		Pipe.pipes.push(new Pipe(p, x, h/2, h));
		let nh = p.height - h - Pipe.gap;
		Pipe.pipes.push(new Pipe(p, x, h + Pipe.gap + nh/2, nh));
	}

	answerBox = new TextBox(p, p.width * 0.5, p.height * 0.5, 200, 50, "Answer...", 20, 16);

	replayButton = new Button(p, p.width * 0.5, p.height * 0.85, 100, 50, "Replay", 20, () => {
		Pipe.pipes = [];
		score = 0;
		flappySetup(p);
		dead = false;
	});

	continueButton = new Button(p, p.width * 0.5, p.height * 0.85, 100, 50, "Continue...", 20, () => {
		console.log("Continue button pressed");
	});

	stars = [];
	for (let i = 0; i < starCount; ++i) {
		let z = p.random(0, 100);
		let vx = p.map(z, 0, 100, -maxStarSpeed, -minStarSpeed);
		stars.push(new Particle(p, p.random(0, p.width), p.random(0, p.height), z, vx, starDrift));
	}
}

export function flappyDraw(p) {
	p.background(0);
	answerBox.hide();

	for (let i = stars.length - 1; i >= 0; --i) {
		let star = stars[i];
		if (star.withinScreen()) {
			star.run();
		} else {
			let z = p.random(0, 100);
			let vx = p.map(z, 0, 100, -maxStarSpeed, -minStarSpeed);
			stars.push(new Particle(p, p.width, p.random(0, p.height), z, vx, starDrift));
			stars.splice(i, 1);
		}
	}

	if (stateCleared) {
		p.noStroke();
		p.textAlign(p.CENTER, p.CENTER);
		p.fill(0, 255, 0);
		p.textSize(48);
		p.text("Stage Cleared!", p.width * 0.5, p.height * 0.2);
		p.fill(255);
		p.textSize(16);
		p.text("Answer the question to move to next round", p.width * 0.5, p.height * 0.3);
		p.textSize(32);
		p.text("how much is 2 + 2", p.width * 0.5, p.height * 0.4);
		answerBox.run();
		answerBox.show();
		continueButton.run();
	} else if (dead) {
		p.noStroke();
		p.textAlign(p.CENTER, p.CENTER);
		p.fill(255, 0, 0);
		p.textSize(64);
		p.text("Game Over!", p.width * 0.5, p.height * 0.2);
		p.text("Score: " + score, p.width * 0.5, p.height * 0.4);
		p.fill(0, 255, 0);
		p.textSize(16);
		p.text("tap screen or press W/up arrow/space to stay afloat", p.width * 0.5, p.height * 0.5);
		p.fill(255);
		p.textSize(32);
		p.text("Press R", p.width * 0.5, p.height * 0.7);
		p.text("or click", p.width * 0.5, p.height * 0.75);
		replayButton.run(p.color(255), p.color(0), p.color(100));
	} else {
		bird.run(p);
	
		for (let i = Pipe.pipes.length - 2; i >= 0; i -= 2) {
			let pipe = Pipe.pipes[i];
			if (pipe.position.x + pipe.shape.x/2 < 0) {
				Pipe.pipes.splice(i, 2);
				++score;
	
				let x = Pipe.pipes[Pipe.pipes.length - 1].position.x + Pipe.spread;
				let h = p.random(p.height * 0.1, p.height * 0.6);
				Pipe.pipes.push(new Pipe(p, x, h/2, h));
				let nh = p.height - h - Pipe.gap;
				Pipe.pipes.push(new Pipe(p, x, h + Pipe.gap + nh/2, nh));
			}
			pipe.run(p);
			Pipe.pipes[i + 1].run(p);
		}

		p.fill(255);
		p.textSize(32);
		p.text("Score: " + score, p.width * 0.15, p.height * 0.1);

		if (score >= targetScore) {
			stateCleared = true;
		}
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

class Particle {
	constructor(p, x, y, z, vx, vy) {
		this.p = p;
		this.position = p.createVector(x, y, z);
		this.velocity = p.createVector(vx, vy);
		this.radius = p.map(z, 0, 100, maxStarRadius, minStarRadius);
	}

	run() {
		this.position.add(this.velocity);

		this.p.fill(255);
		this.p.stroke(255);
		this.p.circle(this.position.x, this.position.y, this.radius);
	}

	withinScreen() {
		return pointInRect(this.position, this.p.createVector(this.p.width/2, this.p.height/2), this.p.createVector(this.p.width, this.p.height));
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
		// p.rect(this.position.x, this.position.y, this.shape.x - satelliteHitboxError, this.shape.y - satelliteHitboxError);
		p.image(satelliteImage, this.position.x, this.position.y, this.shape.x, this.shape.y)

		for (let pipe of Pipe.pipes) {
			if (pipe.position.x > this.position.x - this.shape.x/2 - pipe.shape.x/2) {
				let left = this.position.x - this.shape.x/2 + satelliteHitboxError/2;
				let right = this.position.x + this.shape.x/2 - satelliteHitboxError/2;
				let top = this.position.y - this.shape.y/2 + satelliteHitboxError/2;
				let bottom = this.position.y + this.shape.y/2 - satelliteHitboxError/2;

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
	static gap = 230;
	static width = 50;
	static pipes = [];
	static speed = 4;
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