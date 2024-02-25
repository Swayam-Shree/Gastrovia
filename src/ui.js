import { globals } from "./globals";
import { pointInRect } from "./util";

export class Button {
	constructor(p, x, y, w, h, text, textSize, onClick) {
		this.p = p;
		this.position = p.createVector(x, y);
		this.shape = p.createVector(w, h);
		this.text = text;
		this.textSize = textSize;
		this.onClick = onClick;
	} 

	run(bgColor=this.p.color(255), textColor=this.p.color(0), hoverBgColor=this.p.color(100)) {
		if (pointInRect(this.p.createVector(this.p.mouseX, this.p.mouseY), this.position, this.shape)) {
			this.p.fill(hoverBgColor);
		} else {
			this.p.fill(bgColor);
		}
		this.p.rect(this.position.x, this.position.y, this.shape.x, this.shape.y);
		this.p.fill(textColor);
		this.p.textSize(this.textSize);
		this.p.textAlign(this.p.CENTER, this.p.CENTER);
		this.p.text(this.text, this.position.x, this.position.y);
	}

	mousePressed() {
		if (pointInRect(this.p.createVector(this.p.mouseX, this.p.mouseY), this.position, this.shape)) {
			this.onClick();
		}
	}
}

export class TextBox {
	static leftPadding = 15;

	constructor(p, x, y, w, h, defaultText, textSize, maxLength, hideText=false) {
		this.p = p;
		this.position = p.createVector(x, y);
		this.shape = p.createVector(w, h);
		this.defaultText = defaultText;
		this.textSize = textSize;
		this.selected = false;
		this.text = "";
		this.hideText = hideText;
		this.maxLength = maxLength;
	}
	
	run(bgColor=this.p.color(255), hoverBgColor=this.p.color(170), selectedBgColor=this.p.color(210), defaultTextColor=this.p.color(100), textColor=this.p.color(0)) {
		if (this.selected){
			this.p.fill(selectedBgColor);
		} else if (pointInRect(this.p.createVector(this.p.mouseX, this.p.mouseY), this.position, this.shape)) {
			this.p.fill(hoverBgColor);
		} else {
			this.p.fill(bgColor);
		}
		this.p.rect(this.position.x, this.position.y, this.shape.x, this.shape.y);
		this.p.textSize(this.textSize);
		this.p.textAlign(this.p.LEFT, this.p.CENTER);
	
		if (this.text === "" && !this.selected) {
			this.p.fill(defaultTextColor);
			this.p.text(this.defaultText, this.position.x + TextBox.leftPadding, this.position.y, this.shape.x, this.shape.y);
		} else {
			this.p.fill(textColor);
			let displayText = this.hideText ? "*".repeat(this.text.length) : this.text;
			if (this.selected) {
				if (this.p.round(globals.frameCount/30) % 2) {
					this.p.text(displayText, this.position.x + TextBox.leftPadding, this.position.y, this.shape.x, this.shape.y);
				} else {
					this.p.text(displayText + "|", this.position.x + TextBox.leftPadding, this.position.y, this.shape.x, this.shape.y);
				}
			} else {
				this.p.text(displayText, this.position.x + TextBox.leftPadding, this.position.y, this.shape.x, this.shape.y);
			}
		}
	}

	keyPressed() {
		if (this.selected) {
			if (this.p.keyCode === 8) {
				this.text = this.text.slice(0, -1);
			} else if (this.p.keyCode >= 32 && this.p.keyCode <= 126 && this.text.length < this.maxLength) {
				this.text += this.p.key;
			}
		}
	}

	mousePressed() {
		this.selected = pointInRect(this.p.createVector(this.p.mouseX, this.p.mouseY), this.position, this.shape);
	}
}