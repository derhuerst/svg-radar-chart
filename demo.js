'use strict'

const safeEval = require('safe-eval')
const toHTML = require('virtual-dom-stringify')
const radar = require('.')
const smoothing = require('./smoothing')



const columns = document.querySelector('#demo-columns')
const data = document.querySelector('#demo-data')
const scales = document.querySelector('#demo-scales')
const axes = document.querySelector('#demo-axes')
const tension = document.querySelector('#demo-smoothing')

const opt = {
	shapeProps: (data) => ({
		className: 'shape',
		fill: data.color,
		stroke: data.color
	})
}

const render = () => {
	const c = safeEval(columns.value)
	const d = safeEval(data.value)
	const s = +scales.value
	const a = axes.checked
	const sm = +tension.value

	document.querySelector('#demo-target').innerHTML = toHTML(radar(c, d, {
		smoothing: smoothing(sm),
		scales: s, axes: a,
		shapeProps: (data) => ({
			className: 'shape',
			fill: data.color,
			stroke: data.color
		})
	}))
}

const asyncRender = () => setTimeout(render, 5)
columns.addEventListener('change', render)
columns.addEventListener('keypress', asyncRender)
data.addEventListener('change', render)
data.addEventListener('keypress', asyncRender)
scales.addEventListener('change', render)
axes.addEventListener('change', render)
tension.addEventListener('change', render)
asyncRender()
