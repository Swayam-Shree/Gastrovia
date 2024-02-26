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
		this.p.noStroke();
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
		this.maxLength = maxLength;

		this.input = p.createInput("", hideText ? "password" : "text");
		this.input.position(x - w/2, y - h/2);
		this.input.size(w, h);
		this.input.elt.placeholder = defaultText;
		this.input.elt.style.fontSize = textSize + "px";
		this.input.elt.style.paddingLeft = TextBox.leftPadding + "px";
		this.input.hide();
	}
	
	run() {		
		let val = this.input.value();
		if (val.length > this.maxLength) {
			this.input.value(val.slice(0, this.maxLength));
		}
	}

	value(s) {
		if (s) {
			this.input.value(s);
		} else {
			return this.input.value();
		}
	}

	show() {
		this.input.show();
	}
	hide() {
		this.input.hide();
	}
	remove() {
		this.input.remove();
	}
}