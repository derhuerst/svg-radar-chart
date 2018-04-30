# [svg-radar-chart](https://derhuerst.github.io/svg-radar-chart/)

**Generate SVG radar charts.** Note that this is an opinionated tool; I maintain it with my personal use cases in mind. It does *not* intend to cover every feature a radar chart library might possibly need.

![an example](https://rawgit.com/derhuerst/svg-radar-chart/master/example.svg)

[![npm version](https://img.shields.io/npm/v/svg-radar-chart.svg)](https://www.npmjs.com/package/svg-radar-chart)
[![build status](https://img.shields.io/travis/derhuerst/svg-radar-chart.svg)](https://travis-ci.org/derhuerst/svg-radar-chart)
[![dependency status](https://img.shields.io/david/derhuerst/svg-radar-chart.svg)](https://david-dm.org/derhuerst/svg-radar-chart)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/svg-radar-chart.svg)](https://david-dm.org/derhuerst/svg-radar-chart#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/svg-radar-chart.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)

This library is inspired by [radar-chart-d3](https://github.com/alangrafu/radar-chart-d3) but tries to do a few things differently:

- `svg-radar-chart` does not limit you in which frontend stack you use. It just returns [virtual-dom nodes](https://github.com/Matt-Esch/virtual-dom#dom-model).
- Because [radar-chart-d3](https://github.com/alangrafu/radar-chart-d3) includes [D3](https://d3js.org/), it weighs `212k`. `svg-radar-chart` weighs `9k`.
- Because [angular-radial-plot](https://github.com/colorfulgrayscale/angular-radial-plot) includes includes [D3](https://d3js.org/), it weighs roughly `160k`. `svg-radar-chart` weighs `9k`.

## Installing

```shell
npm install svg-radar-chart
```


## Usage

```js
const radar = require('svg-radar-chart')

const chart = radar({
	// columns
	battery: 'Battery Capacity',
	design: 'Design',
	useful: 'Usefulness'
}, [
	// data
	{class: 'iphone', battery: .7, design:  1, useful: .9},
	{class: 'galaxy', battery:  1, design: .6, useful: .8},
	{class: 'nexus',  battery: .8, design: .7, useful: .6}
])
```

**`svg-radar-chart` returns [virtual-dom](https://github.com/Matt-Esch/virtual-dom#dom-model), so you can decide what to do with it.**

To generate an SVG string from it, use [virtual-dom-stringify](https://github.com/alexmingoia/virtual-dom-stringify):

```js
const stringify = require('virtual-dom-stringify')

const svg = `
<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
	<style>
		.axis {
			stroke-width: .2;
		}
		.scale {
			stroke-width: .2;
		}
		.shape {
			fill-opacity: .3;
		}
		.shape:hover {
			fill-opacity: .6;
		}
	</style>
	${stringify(chart)}
</svg>
`
```

You may now create an SVG file using Node.js:

```js
process.stdout.write(svg)
```

```shell
node generate-chart.js >chart.svg
```

Or insert it into the DOM:

```js
document.querySelector('#my-chart').innerHTML = svg
```

**Check [the website](https://derhuerst.github.io/svg-radar-chart/) or [the example](example.js) on how to customize charts further.**

### Smoothing

You can pass the [cardinal-closed smoothing function](https://github.com/d3/d3-shape/blob/master/README.md#curveCardinalClosed) as follows, but it will add another `18k` to your bundle, if you use [`common-shakeify`](https://www.npmjs.com/package/common-shakeify), otherwise a bit more.

```js
const smoothing = require('svg-radar-chart/smoothing')
radar(columns, data, {
	smoothing: smoothing(.3) // tension of .3
})
```


## API

```
radar(columns, data, [opt])
```

`columns` must be an object. The values are captions.

`data` must be an array of data points. The keys in one `data` points must exist in `columns`.

`opt` is optional and has the following default values:

```js
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
```

`smoothing(points)` must return [valid SVG `<path>` commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).


## See also

- [`svg-patterns`](https://github.com/derhuerst/svg-patterns) – Create SVG patterns programmatically to visualize data.
- [`svg-world-map`](https://github.com/derhuerst/svg-world-map) – Render a world map with a pin at a specific location.


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/svg-radar-chart/issues).
