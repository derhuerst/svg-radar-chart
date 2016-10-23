'use strict'

const h = require('virtual-dom/h')



// helpers

const round = (v) => Math.round(v * 10000) / 10000

const points = (points) => points
	.map((point) => round(point[0]) + ',' + round(point[1]))
	.join(' ')

const polarToX = (angle, distance) =>
	Math.cos(angle - Math.PI / 2) * distance

const polarToY = (angle, distance) =>
	Math.sin(angle - Math.PI / 2) * distance



const axis = (opt) => (column) =>
	h('polyline', {
		className: opt.axisClassName,
		points: points([
			[0, 0], [
				polarToX(column.angle, opt.size / 2),
				polarToY(column.angle, opt.size / 2)
			]
		])
	})

const spoke = (columns, opt) => (data) =>
	h('polygon', {
		className: opt.spokeClassName,
		points: points(
			Object.keys(data).map((key) => {
				const value = data[key]
				const angle = columns[key].angle
				return [
					polarToX(angle, value * opt.size / 2 * opt.maxSpokeSize),
					polarToY(angle, value * opt.size / 2 * opt.maxSpokeSize)
				]
			})
		)
	})

const scale = (opt, value) =>
	h('circle', {
		className: opt.scaleClassName,
		cx: 0, cy: 0, r: value * opt.size / 2 * opt.maxSpokeSize
	})

const defaults = {
	size: 100,
	axes: true,
	axisClassName: 'axis',
	scales: 3,
	scaleClassName: 'scale',
	spokeClassName: 'spoke',
	maxSpokeSize: .9
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
		h('g', data.map(spoke(columns, opt)))
	]
	if (opt.axes) groups.unshift(h('g', columns.map(axis(opt))))
	if (opt.scales > 0) {
		const scales = []
		for (let i = 1; i <= opt.scales; i++)
			scales.push(scale(opt, i / opt.scales))
		groups.unshift(h('g', scales))
	}
	return h('g', {
		transform: `translate(${round(opt.size / 2)},${round(opt.size / 2)})`
	}, groups)
}

module.exports = render
