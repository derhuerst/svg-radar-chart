import h from 'virtual-dom/h.js'

// helpers

const polarToX = (angle, distance) => Math.cos(angle - Math.PI / 2) * distance

const polarToY = (angle, distance) => Math.sin(angle - Math.PI / 2) * distance

const points = (points) => {
	return points
	.map(point => point[0].toFixed(4) + ',' + point[1].toFixed(4))
	.join(' ')
}

const noSmoothing = (points) => {
	let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4)
	for (let i = 1; i < points.length; i++) {
		d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4)
	}
	return d + 'z'
}



const axis = (opt) => (col) => {
	return h('polyline', Object.assign(opt.axisProps(col), {
		points: points([
			[0, 0], [
				polarToX(col.angle, opt.chartSize / 2),
				polarToY(col.angle, opt.chartSize / 2)
			]
		])
	}))
}

const shape = (columns, opt) => (data, i) => {
	return h('path', Object.assign(opt.shapeProps(data), {
		d: opt.smoothing(columns.map((col) => {
			const val = data[col.key]
			if ('number' !== typeof val) {
				throw new Error(`Data set ${i} is invalid.`)
			}

			return [
				polarToX(col.angle, val * opt.chartSize / 2),
				polarToY(col.angle, val * opt.chartSize / 2)
			]
		}))
	}))
}

const scale = (opt, value) => {
	return h('circle', Object.assign(opt.scaleProps(value), {
		cx: 0, cy: 0, r: value * opt.chartSize / 2
	}))
}

const caption = (opt) => (col) => {
	return h('text', Object.assign(opt.captionProps(col), {
		x: polarToX(col.angle, opt.size / 2 * .95).toFixed(4),
		y: polarToY(col.angle, opt.size / 2 * .95).toFixed(4),
		dy: (opt.captionProps(col).fontSize || 2) / 2
	}), col.caption)
}



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

const renderRadarChart = (columns, data, opt = {}) => {
	if ('object' !== typeof columns || Array.isArray(columns)) {
		throw new Error('columns must be an object')
	}
	if (!Array.isArray(data)) {
		throw new Error('data must be an array')
	}
	opt = Object.assign({}, defaults, opt)
	opt.chartSize = opt.size / opt.captionsPosition

	columns = Object.keys(columns).map((key, i, all) => ({
		key, caption: columns[key],
		angle: Math.PI * 2 * i / all.length
	}))

	const groups = [
		h('g', data.map(shape(columns, opt)))
	]
	if (opt.captions) groups.push(h('g', columns.map(caption(opt))))
	if (opt.axes) groups.unshift(h('g', columns.map(axis(opt))))
	if (opt.scales > 0) {
		const scales = []
		for (let i = opt.scales; i > 0; i--) {
			scales.push(scale(opt, i / opt.scales))
		}
		groups.unshift(h('g', scales))
	}

	const delta = (opt.size / 2).toFixed(4)
	return h('g', {
		transform: `translate(${delta},${delta})`
	}, groups)
}

export {
	renderRadarChart as radar,
}
