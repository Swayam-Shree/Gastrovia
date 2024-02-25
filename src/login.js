import { Button } from './ui.js';
import { nextState } from './util.js';

let playButton;
// let nameBox, passwordBox;
// let showInvalidFieldPrompt = false;

export function loginSetup(p) {
	// nameBox = new TextBox(p, p.width / 2, p.height / 2 - 150, 200, 50, "Name...", 20, 16);
	// passwordBox = new TextBox(p, p.width / 2, p.height / 2 - 75, 200, 50, "Password...", 20, 16, true);
	playButton = new Button(p, p.width / 2, p.height / 2, 100, 50, "Play", 20, () => {
		// if (nameBox.text && passwordBox.text) {
			nextState();
		// } else {
		// 	showInvalidFieldPrompt = true;
		// }
	});
}

export function loginDraw(p) {
	p.background(0);

	playButton.run();
	// nameBox.run();
	// passwordBox.run();

	// if (showInvalidFieldPrompt) {
	// 	p.fill(255, 0, 0);
	// 	p.textSize(20);
	// 	p.textAlign(p.CENTER, p.CENTER);
	// 	p.text("Please fill in all fields", p.width / 2, p.height / 2);
	// }
}

export function loginKeyPressed(p) {
	// nameBox.keyPressed();
	// passwordBox.keyPressed();
}

export function loginMousePressed(p) {
	playButton.mousePressed();
	// nameBox.mousePressed();
	// passwordBox.mousePressed();
}