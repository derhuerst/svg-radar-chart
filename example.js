'use strict'

const radar = require('.')
const stringify = require('virtual-dom-stringify')

const chart = radar({
	// columns
	price: 'Price',
	useful: 'Usefulness',
	design: 'Design',
	battery: 'Battery Capacity',
	camera: 'Camera Quality'
}, [
	// data
	{class: 'iphone', price:  1, battery: .7, design:  1, useful: .9, camera: .9},
	{class: 'galaxy', price: .8, battery:  1, design: .6, useful: .8, camera:  1},
	{class: 'nexus',  price: .5, battery: .8, design: .7, useful: .6, camera: .6}
], {
	shapeProps: (data) => ({className: 'shape ' + data.class})
})

process.stdout.write(`
<svg version="1" xmlns="http://www.w3.org/2000/svg" width="1000" height="200" viewBox="-200 0 500 100">
	<style>
		.axis {
			stroke: #555;
			stroke-width: .2;
		}
		.scale {
			fill: #f0f0f0;
			stroke: #999;
			stroke-width: .2;
		}
		.shape {
			fill-opacity: .3;
			stroke-width: .5;
		}
		.shape:hover { fill-opacity: .6; }

		.shape.iphone { fill: #edc951; stroke: #edc951; }
		.shape.nexus  { fill: #cc333f; stroke: #cc333f; }
		.shape.galaxy { fill: #00a0b0; stroke: #00a0b0; }
	</style>
	${stringify(chart)}
</svg>
`)
