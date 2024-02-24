import p5 from "p5";

import { flappyPreLoad, flappySetup, flappyDraw, flappyKeyPressed, flappyMousePressed } from "./flappybird";

let state = "flappybird";

let mainScene = new p5((p) => {
	p.preload = () => {
		flappyPreLoad(p);
	}

	p.setup = () => {
		p.createCanvas(window.innerWidth, window.innerHeight);
		p.rectMode(p.CENTER);
		p.imageMode(p.CENTER);

		flappySetup(p);
	};

	p.draw = () => {
		if (state === "flappybird") {
			flappyDraw(p);
		}
	};

	p.keyPressed = () => {
		if (state === "flappybird") {
			flappyKeyPressed(p);
		}
	}

	p.mousePressed = () => {
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
			if (state === "flappybird") {
				flappyMousePressed(p);
			}
		}
	}

	p.windowResized = () => {
		p.resizeCanvas(window.innerWidth, window.innerHeight);
	};
});