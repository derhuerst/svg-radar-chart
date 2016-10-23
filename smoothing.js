'use strict'

// https://github.com/d3/d3-shape/blob/04f60b8/test/curve/cardinalClosed-test.js#L11

const line = require('d3-shape/src/line').default
const cardinal = require('d3-shape/src/curve/cardinalClosed').default

const points = (tension = .3) => (points) =>
	line().curve(cardinal.tension(tension))(points)

module.exports = points
