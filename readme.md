# svg-radar-chart

**A reusable radar chart in SVG.**

![an example](https://cdn.rawgit.com/derhuerst/svg-radar-chart/master/example.svg)

[![npm version](https://img.shields.io/npm/v/svg-radar-chart.svg)](https://www.npmjs.com/package/svg-radar-chart)
[![build status](https://img.shields.io/travis/derhuerst/svg-radar-chart.svg)](https://travis-ci.org/derhuerst/svg-radar-chart)
[![dependency status](https://img.shields.io/david/derhuerst/svg-radar-chart.svg)](https://david-dm.org/derhuerst/svg-radar-chart)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/svg-radar-chart.svg)](https://david-dm.org/derhuerst/svg-radar-chart#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/svg-radar-chart.svg)

This library is inspired by [radar-chart-d3](https://github.com/alangrafu/radar-chart-d3) but tries to do a few things differently:

- `svg-radar-chart` does not limit you in which frontend stack you use. It just returns [virtual-dom nodes](https://github.com/Matt-Esch/virtual-dom#dom-model).
- Because [radar-chart-d3](https://github.com/alangrafu/radar-chart-d3) includes [D3](https://d3js.org/), it weighs `212k`. `svg-radar-chart` weighs `9k`.


## Installing

```shell
npm install svg-radar-chart
```


## Usage

```js
const radar = require('svg-radar-chart')
const stringify = require('virtual-dom-stringify')

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

process.stdout.write(`
<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
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
		}
		.shape:hover { fill-opacity: .6; }
	</style>
	${stringify(chart)}
</svg>
`)
```

[The example how to customize the chart further](example.js).


## API

```
radar(columns, data, [opt])
```

`columns` must be an object. The values are captions.

`data` must be an array of data points. The keys in one `data` points must exist in `columns`.

`opt` is optional and has the following default values:

```js
{
	size: 100, // size of the whole chart
	axes: true, // show axes?
	scales: 3, // show scale circles?
	maxShapeSize: .9, // where on the axes is the value 1?
	axisProps: () => ({className: 'axis'}),
	scaleProps: () => ({className: 'scale', fill: 'none'}),
	shapeProps: () => ({className: 'shape'})
}
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/svg-radar-chart/issues).
