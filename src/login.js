import { auth, googleProvider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

import { Button } from './ui.js';
import { nextState } from './util.js';

let playButton, googleSignInButton, signOutButton;
let signedIn = false;
let userName = "";

export function loginSetup(p) {
	playButton = new Button(p, p.width/2, p.height/2 + 100, 100, 50, "Play", 20, () => {
		nextState();
	});
	googleSignInButton = new Button(p, p.width/2, p.height/2 + 100, 200, 50, "Sign in with Google", 20, () => {
		signInWithPopup(auth, googleProvider);
	});
	signOutButton = new Button(p, p.width/2, p.height/2 + 250, 100, 50, "Sign Out", 20, () => {
		signOut(auth);
	});
	onAuthStateChanged(auth, (user) => {
		signedIn = !!user;
		userName = user?.displayName;
	});
}

export function loginDraw(p) {
	p.background(0);

	p.noStroke();
	p.fill(255);
	p.textSize(48);
	p.textAlign(p.CENTER, p.CENTER);
	p.push();
		p.translate(p.width/2, p.height/2 - 225);
		p.rotate(-3)
		p.text("Welcome To", 0, 0);
	p.pop();
	p.textSize(64);
	p.push();
		p.translate(p.width/2, p.height/2 - 150);
		p.rotate(-3);
		p.text("Gastrovia", 0, 0);
	p.pop();

	if (signedIn) {
		p.push();
			p.textSize(24 + 4 * Math.sin(p.frameCount * 5 * Math.PI / 180));
			p.fill(0, 255, 0);
			p.translate(p.width/2, p.height/2 - 25);
			p.rotate(5);
			p.text("Welcome, " + userName, 0, 0);
		p.pop();

		signOutButton.run();
		playButton.run();
	} else {
		googleSignInButton.run();
	}
}

export function loginKeyPressed(p) {
}

export function loginMousePressed(p) {
	if (signedIn) {
		signOutButton.mousePressed();
		playButton.mousePressed();
	} else {
		googleSignInButton.mousePressed();
	}
}