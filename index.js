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
	let d = 'M' + round(points[0][0]) + ',' + round(points[0][1])
	for (let i = 1; i < points.length; i++)
		d += 'L' + round(points[i][0]) + ',' + round(points[i][1])
	return d + 'z'
}



const axis = (opt) => (column) =>
	h('polyline', Object.assign(opt.axisProps(column), {
		points: points([
			[0, 0], [
				polarToX(column.angle, opt.chartSize / 2),
				polarToY(column.angle, opt.chartSize / 2)
			]
		])
	}))

const shape = (columns, opt) => (data) =>
	h('path', Object.assign(opt.shapeProps(data), {
		d: opt.smoothing(columns.map((col) => [
			polarToX(col.angle, data[col.key] * opt.chartSize / 2),
			polarToY(col.angle, data[col.key] * opt.chartSize / 2)
		]))
	}))

const scale = (opt, value) =>
	h('circle', Object.assign(opt.scaleProps(value), {
		cx: 0, cy: 0, r: value * opt.chartSize / 2
	}))

const caption = (opt) => (col) =>
	h('text', Object.assign(opt.captionProps(col), {
		x: round(polarToX(col.angle, opt.size / 2 * .95)),
		y: round(polarToY(col.angle, opt.size / 2 * .95)),
		dy: (opt.captionProps(col).fontSize || 2) / 2
	}), col.caption)



const defaults = {
	size: 100, // size of the chart (including captions)
	axes: true, // show axes?
	scales: 3, // show scale circles?
	captions: true, // show captions?
	captionsPosition: 1.2, // where on the axes are the captions?
	smoothing: noSmoothing, // shape smoothing function
	axisProps: () => ({className: 'axis'}),
	scaleProps: () => ({className: 'scale', fill: 'none'}),
	shapeProps: () => ({className: 'shape'}),
	captionProps: () => ({
		className: 'caption',
		textAnchor: 'middle', fontSize: 3,
		fontFamily: 'sans-serif'
	})
}

const render = (columns, data, opt = {}) => {
	if ('object' !== typeof columns || Array.isArray(columns))
		throw new Error('columns must be an object')
	if (!Array.isArray(data))
		throw new Error('data must be an array')
	opt = Object.assign({}, defaults, opt)
	opt.chartSize = opt.size / opt.captionsPosition

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
	if (opt.captions) groups.push(h('g', columns.map(caption(opt))))
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
