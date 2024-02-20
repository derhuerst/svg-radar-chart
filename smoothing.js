// https://github.com/d3/d3-shape/blob/04f60b8/test/curve/cardinalClosed-test.js#L11

import {line, curveCardinalClosed} from 'd3-shape'

const createAddSmoothing = (tension = .3) => (points) => {
	return line().curve(curveCardinalClosed.tension(tension))(points)
}

export {
	createAddSmoothing as smoothing,
}
