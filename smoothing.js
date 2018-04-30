'use strict'

// https://github.com/d3/d3-shape/blob/04f60b8/test/curve/cardinalClosed-test.js#L11

const {line, curveCardinalClosed} = require('d3-shape')

const points = (tension = .3) => (points) => {
	return line().curve(curveCardinalClosed.tension(tension))(points)
}

module.exports = points
