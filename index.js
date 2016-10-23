'use strict'

const h = require('virtual-dom/h')



// helpers

const round = (v) => Math.round(v * 10000) / 10000

const polarToX = (angle, distance) =>
	Math.cos(angle - Math.PI / 2) * distance

const polarToY = (angle, distance) =>
	Math.sin(angle - Math.PI / 2) * distance

const points = (points) => points
	.map((point) => round(point[0]) + ',' + round(point[1]))
	.join(' ')

const noSmoothing = (points) => {
	let d = 'M' + points[0][0] + ',' + points[0][1]
	for (let i = 1; i < points.length; i++)
		d += 'L' + points[i][0] + ',' + points[i][1]
	return d + 'z'
}



const axis = (opt) => (column) =>
	h('polyline', Object.assign(opt.axisProps(column), {
		points: points([
			[0, 0], [
				polarToX(column.angle, opt.size / 2),
				polarToY(column.angle, opt.size / 2)
			]
		])
	}))

const shape = (columns, opt) => (data) =>
	h('path', Object.assign(opt.shapeProps(data), {
		d: opt.smoothing(columns.map((col) => [
			polarToX(col.angle, data[col.key] * opt.size / 2 * opt.maxShapeSize),
			polarToY(col.angle, data[col.key] * opt.size / 2 * opt.maxShapeSize)
		]))
	}))

const scale = (opt, value) =>
	h('circle', Object.assign(opt.scaleProps(value), {
		cx: 0, cy: 0, r: value * opt.size / 2 * opt.maxShapeSize
	}))

const defaults = {
	size: 100, // size of the whole chart
	axes: true, // show axes?
	scales: 3, // show scale circles?
	maxShapeSize: .9, // where on the axes is the value 1?
	smoothing: noSmoothing, // shape smoothing function
	axisProps: () => ({className: 'axis'}),
	scaleProps: () => ({className: 'scale', fill: 'none'}),
	shapeProps: () => ({className: 'shape'})
}

const render = (columns, data, opt = {}) => {
	if ('object' !== typeof columns || Array.isArray(columns))
		throw new Error('columns must be an object')
	if (!Array.isArray(data))
		throw new Error('data must be an array')
	opt = Object.assign({}, defaults, opt)

	columns = Object.keys(columns)
		.map((key, i, all) => ({
			key, caption: columns[key],
			angle: Math.PI * 2 * i / all.length
		}))
	columns.reduce((all, column) => {
		all[column.key] = column
		return all
	}, columns)

	const groups = [
		h('g', data.map(shape(columns, opt)))
	]
	if (opt.axes) groups.unshift(h('g', columns.map(axis(opt))))
	if (opt.scales > 0) {
		const scales = []
		for (let i = opt.scales; i > 0; i--)
			scales.push(scale(opt, i / opt.scales))
		groups.unshift(h('g', scales))
	}
	return h('g', {
		transform: `translate(${round(opt.size / 2)},${round(opt.size / 2)})`
	}, groups)
}

module.exports = render
