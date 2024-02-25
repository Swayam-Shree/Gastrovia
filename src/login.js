import { Button, TextBox } from './ui.js';
import { nextState } from './util.js';

let playButton;
let nameBox, passwordBox;
let showInvalidFieldPrompt = false;

export function loginSetup(p) {
	nameBox = new TextBox(p, p.width/2, p.height/2 - 50, 200, 50, "Name...", 20, 16);
	passwordBox = new TextBox(p, p.width/2, p.height/2 + 25, 200, 50, "Password...", 20, 16, true);
	nameBox.show();
	passwordBox.show();
	playButton = new Button(p, p.width/2, p.height/2 + 200, 100, 50, "Play", 20, () => {
		if (nameBox.value() && passwordBox.value()) {
			nextState();
			nameBox.remove();
			passwordBox.remove();
		} else {
			showInvalidFieldPrompt = true;
		}
	});
}

export function loginDraw(p) {
	p.background(0);

	p.fill(255);
	p.textSize(48);
	p.textAlign(p.CENTER, p.CENTER);
	p.text("Welcome To", p.width / 2, p.height / 2 - 225);
	p.textSize(64);
	p.text("Gastrovia", p.width / 2, p.height / 2 - 150);

	playButton.run();

	nameBox.run();
	passwordBox.run();

	if (showInvalidFieldPrompt) {
		p.fill(255, 0, 0);
		p.textSize(20);
		p.textAlign(p.CENTER, p.CENTER);
		p.text("Please fill in all fields", p.width/2, p.height/2 + 150);
	}
}

export function loginKeyPressed(p) {
}

export function loginMousePressed(p) {
	playButton.mousePressed();
}