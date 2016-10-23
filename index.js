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



const axis = (column) =>
	h('polyline', {
		className: 'axis',
		points: points([
			[0, 0],
			[polarToX(column.angle, 50), polarToY(column.angle, 50)]
		])
	})

const spoke = (columns) => (data) =>
	h('polygon', {
		className: 'spoke',
		points: points(
			Object.keys(data)
			.map((key) => {
				const value = data[key]
				const angle = columns[key].angle
				return [polarToX(angle, value * 50), polarToY(angle, value * 50)]
			})
		)
	})

const render = (columns, data) => {
	columns = Object.keys(columns)
		.map((key, i, all) => ({
			key, caption: columns[key],
			angle: Math.PI * 2 * i / all.length
		}))
	columns.reduce((all, column) => {
		all[column.key] = column
		return all
	}, columns)

	return h('g', [
		h('g', columns.map(axis)),
		h('g', data.map(spoke(columns)))
	])
}

module.exports = render
