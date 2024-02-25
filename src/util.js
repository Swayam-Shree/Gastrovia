import { globals } from './globals.js';

export function pointInRect(point, position, shape) {
	return point.x > position.x - shape.x/2 && point.x < position.x + shape.x/2 &&
		point.y > position.y - shape.y/2 && point.y < position.y + shape.y/2;
}

export function nextState() {
	if (globals.stateIndex < globals.stateOrder.length - 1) {
		++globals.stateIndex;
		globals.state = globals.stateOrder[globals.stateIndex];
	}
}