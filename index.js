// @ts-check

import h from 'virtual-dom/h.js'

// Type definitions for a Point and Points to improve clarity and reusability in the code
/**
 * @typedef {[number, number]} Point
 * Represents a point in 2D space as a tuple of two numbers [x, y].
 */

/**
 * @typedef {Point[]} Points
 * Represents an array of Points, i.e., a path or a shape in 2D space.
 */

// Data type definition for use with radar chart columns
/**
 * @template {Exclude<string, 'class'>} T
 * @typedef {Record<T, string | number> & { class: string }} Data<T>
 * Represents a record with keys of type T, and values of type string or number, with a special 'class' key that must be a string.
 */

// Column type definition with generics, excluding 'class' from keys
/**
 * @template {Exclude<string, 'class'>} T
 * @typedef {Object} Column<T>
 * @property {T} key - The unique key for identifying each column.
 * @property {string} caption - The caption that will be displayed on each axis.
 * @property {number} angle - The angle at which the axis is displayed.
 */

// Options type definition including methods for different visual components
/**
 * @template {Exclude<string, 'class'>} T
 * @typedef {Object} Options
 * @property {number} size - The overall size of the radar chart.
 * @property {number} scales - The number of concentric circles (scales) to show.
 * @property {boolean} axes - Whether to display the axes.
 * @property {boolean} captions - Whether to display the captions.
 * @property {number} captionsPosition - The radial position of the captions.
 * @property {(points: Points) => string} smoothing - Function to smooth the path between points.
 * @property {(col: Column<T>) => { className: string } & import('react').SVGProps<SVGSVGElement>} axisProps - Function to define properties for axis elements.
 * @property {(scale: number) => { className: string } & import('react').SVGProps<SVGSVGElement>} scaleProps - Function to define properties for scale elements.
 * @property {(col: Data<T>) => { className: string } & import('react').SVGProps<SVGSVGElement>} shapeProps - Function to define properties for shape elements.
 * @property {(col: Column<T>) => { className: string } & import('react').SVGProps<SVGSVGElement>} captionProps - Function to define properties for caption elements.
 */

// Extends basic options with additional chart size property
/**
 * @template {Exclude<string, 'class'>} T
 * @typedef {Options<T> & { chartSize: number }} ExtendedOptions
 */

// Converts polar coordinates to Cartesian X coordinate
/**
 * @param {number} angle - The angle in radians.
 * @param {number} distance - The distance from the origin.
 * @returns {number} The X coordinate.
 */
const polarToX = (angle, distance) => Math.cos(angle - Math.PI / 2) * distance

// Converts polar coordinates to Cartesian Y coordinate
/**
 * @param {number} angle - The angle in radians.
 * @param {number} distance - The distance from the origin.
 * @returns {number} The Y coordinate.
 */
const polarToY = (angle, distance) => Math.sin(angle - Math.PI / 2) * distance

// Converts an array of Points into a space-separated string for SVG paths
/**
 * @param {Points} points - An array of Points.
 * @returns {string} A string representing the 'points' attribute in SVG.
 */
const points = (points) => {
	return points
		.map(point => point[0].toFixed(4) + ',' + point[1].toFixed(4))
		.join(' ')
}

// Creates an SVG path data string with no smoothing (just straight lines)
/**
 * @param {Points} points - An array of Points to connect with lines.
 * @returns {string} An SVG path data string.
 */
const noSmoothing = (points) => {
	let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4)
	for (let i = 1; i < points.length; i++) {
		d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4)
	}
	return d + 'z'
}

// Returns a function that generates SVG polyline elements for each axis
/**
 * @template {Exclude<string, 'class'>} T
 * @param {ExtendedOptions<T>} opt - The options for rendering the radar chart.
 * @returns {(col: Column<T>) => string} A function that returns SVG polyline elements for each axis.
 */
const axis = (opt) => (col) => {
	return h('polyline', Object.assign(opt.axisProps(col), {
		points: points([
			[0, 0],
			[
				polarToX(col.angle, opt.chartSize / 2),
				polarToY(col.angle, opt.chartSize / 2)
			]
		])
	}))
}

// Returns a function that generates SVG path elements for each data shape
/**
 * @template {Exclude<string, 'class'>} T
 * @param {Column<T>[]} columns - The columns defining the axes of the radar chart.
 * @param {ExtendedOptions<T>} opt - The options for rendering the radar chart.
 * @returns {(data: Data<T>, i: number) => Point} A function that returns SVG path elements for each data shape.
 */
const shape = (columns, opt) => (data, i) => {
	return h('path', Object.assign(opt.shapeProps(data), {
		d: opt.smoothing(columns.map((col) => {
			const val = data[col.key]
			if (typeof val !== 'number') {
				throw new Error(`Data set ${i} is invalid.`)
			}

			return [
				polarToX(col.angle, val * opt.chartSize / 2),
				polarToY(col.angle, val * opt.chartSize / 2)
			]
		}))
	}))
}

// Returns an SVG circle element for each scale
/**
 * @template {Exclude<string, 'class'>} T
 * @param {ExtendedOptions<T>} opt - The options for rendering the radar chart.
 * @param {number} value - The value at which the scale is placed.
 * @returns {string} An SVG circle element for the scale.
 */
const scale = (opt, value) => {
	return h('circle', Object.assign(opt.scaleProps(value), {
		cx: 0, cy: 0, r: value * opt.chartSize / 2
	}))
}

// Returns a function that generates SVG text elements for each caption
/**
 * @template {Exclude<string, 'class'>} T
 * @param {ExtendedOptions<T>} opt - The options for rendering the radar chart.
 * @returns {(col: Column<T>) => string} A function that returns SVG text elements for each caption.
 */
const caption = (opt) => (col) => {
	return h('text', Object.assign(opt.captionProps(col), {
		x: polarToX(col.angle, opt.size / 2 * 0.95).toFixed(4),
		y: polarToY(col.angle, opt.size / 2 * 0.95).toFixed(4),
		dy: (parseInt(opt.captionProps(col).fontSize + '') || 2) / 2
	}), col.caption)
}

// Default configuration options for the radar chart
const defaults = /** @type {Options<string>} */ ({
	size: 100, // size of the chart (including captions)
	axes: true, // whether to show axes
	scales: 3, // number of concentric scales to show
	captions: true, // whether to show captions
	captionsPosition: 1.2, // radial position of captions
	smoothing: noSmoothing, // default smoothing function
	axisProps: () => ({className: 'axis'}), // default axis properties
	scaleProps: () => ({className: 'scale', fill: 'none'}), // default scale properties
	shapeProps: () => ({className: 'shape'}), // default shape properties
	captionProps: () => ({ // default caption properties
		className: 'caption',
		textAnchor: 'middle', fontSize: 3,
		fontFamily: 'sans-serif'
	})
})

// Main function to render the radar chart with given columns and data
/**
 * @template {Exclude<string, 'class'>} T
 * @param {Record<Exclude<T, 'class'>, string>} columnsData - The data for the columns.
 * @param {Data<T>[]} data - The array of data to be plotted.
 * @param {Partial<Options<T>>} opt - Additional options to override the defaults.
 * @returns {string} The rendered radar chart as an SVG element.
 */
const renderRadarChart = (columnsData, data, opt = {}) => {
	if (typeof columnsData !== 'object' || Array.isArray(columnsData)) {
		throw new Error('columns must be an object')
	}
	if (!Array.isArray(data)) {
		throw new Error('data must be an array')
	}
	if (data.some(data => Object.keys(data).some(key => key !== 'class' && typeof data[key] !== 'number'))) {
		throw new Error('data must contain set of numbers')
	}
	const options = /** @type {ExtendedOptions<T>} */({...defaults, ...opt, chartSize: 0})
	options.chartSize = options.size / options.captionsPosition

	const columns = /** @type {Column<T>[]} */ (Object.keys(columnsData).map((key, i, all) => ({
		key, caption: columnsData[key],
		angle: Math.PI * 2 * i / all.length
	})))

	const groups = [
		h('g', data.map(shape(columns, options)))
	]
	if (options.captions) groups.push(h('g', columns.map(caption(options))))
	if (options.axes) groups.unshift(h('g', columns.map(axis(options))))
	if (options.scales > 0) {
		const scales = []
		for (let i = options.scales; i > 0; i--) {
			scales.push(scale(options, i / options.scales))
		}
		groups.unshift(h('g', scales))
	}

	const delta = (options.size / 2).toFixed(4)
	return h('g', {
		transform: `translate(${delta},${delta})`
	}, groups)
}

// Export the radar chart rendering function
export {
	renderRadarChart as radar,
}
