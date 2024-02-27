import p5 from "p5";

import { flappyPreLoad, flappySetup, flappyDraw, flappyKeyPressed, flappyMousePressed } from "./flappybird";
import { loginSetup, loginDraw, loginKeyPressed, loginMousePressed } from "./login";
import { globals } from "./globals";

let prevTime = Date.now();

let mainScene = new p5((p) => {
	p.preload = () => {
		flappyPreLoad(p);
	}

	p.setup = () => {
		p.createCanvas(window.innerWidth, window.innerHeight);
		p.rectMode(p.CENTER);
		p.imageMode(p.CENTER);
		p.angleMode(p.DEGREES);

		loginSetup(p);
		flappySetup(p);
	};

	p.draw = () => {
		++globals.frameCount;
		globals.dt = Date.now() - prevTime;
		prevTime = Date.now();
		if (globals.state === "login") {
			loginDraw(p);
		} else if (globals.state === "flappybird") {
			flappyDraw(p);
		}
	};

	p.keyPressed = () => {
		if (globals.state === "login") {
			loginKeyPressed(p);
		} else if (globals.state === "flappybird") {
			flappyKeyPressed(p);
		}
	}

	p.mousePressed = () => {
		if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
			if (globals.state === "login") {
				loginMousePressed(p);
			} else if (globals.state === "flappybird") {
				flappyMousePressed(p);
			}
		}
	}

	p.windowResized = () => {
		p.resizeCanvas(window.innerWidth, window.innerHeight);
	};
});