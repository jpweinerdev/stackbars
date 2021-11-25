# Stackbars
Animated stacked bars percentage indicator jQuery plugin<br>
jQuery Plugin for indicating percentage values with the option of clicking on each bar for selection purpose<br>
build upon D3.js

![preview](https://raw.github.com/jpweinerdev/stackbars/intro.png)


## jQuery initialization and customization
This plugin requires jQuery (&gt;= 1.8.x) and D3.js (&gt;= v5.4.0)<br>Font Awesome (4.4.x) is used for the handles inner icon symbols.

## Minimal html configuration
```html
<div id="indicator"></div>
```

## Minimal CSS settings
```html
text {
	fill: #777;
	font-family: Helvetica, Arial;
	font-size: 11px;
}
.stack:hover {
	cursor: pointer;
}
```

## jQuery initialization and customization
This plugin requires jQuery (>= 1.8.x) and D3.js (&gt;= v5.4.0)

```javascript
$("#indicator").stackbars({
	data: [],
	height: 48,
	bottomMargin: 0,
	container: '#indicator',
	colorSetting: ["#33876b","#559559","#77a347","#98b236","#bac024","#dcce12"],
	stackMargin: 0,
	stackHeight: 6,
	textPositionEven: -4,
	textPositionOdd: -4,
	hoverButtonWidth: 200,
	stackMinWidth: 15,
	disableEvents: false,
	onSectionClick: function (obj) {
		console.log("Clicked Section Data",obj);
	},
	hoverText: function (obj) {
		return obj.value +" ("+obj.percent+"): " + obj.label;
	}
});
```

## Options and parameters
Parameter | Type | Default | Description
--- | --- | --- | ---
`container` | string | #indicator | ID or class of HTML container element (div)
`height` | int | 48 | total height of SVG container
`bottomMargin` | int | 0 | bottom margin after the stack bar element
`stackMargin` | int | 0 |	margin between each stack element
`stackHeight` | int | 6 |	height of stack bar (small value for thin bar)
`stackMinWidth` | int | 15 | minimal width of stack bar to show percentage value above (hide text if bar is very small)<br>this corresponds to the textsize<br>text { font-size: 11px; } 
`textPositionEven` | int | - 4 | The percentage text value for each stack bar can be positioned above or under the bar.<br>negative value for above<br>positive value for under<br>This value will change all even items.
`textPositionOdd` | int | - 4 | The percentage text value for each stack bar can be positioned above or under the bar.<br>negative value for above<br>positive value for under<br>This value will change all odd items.
`hoverButtonWidth` | int | 200 | minimal width of button element when mouse pointer hoovers over
`colorSetting` | array | ["#33876b", "#559559", "#77a347", "#98b236", "#bac024", "#dcce12", "#cccccc", "#b2b2b2", "#9a9a9a", "#808080", "#4a4a4a", "#121212"] | array of color definitions (HEX values)
`disableEvents` | boolean | false | set to true if you do not wish to enable any mouse interaction (clicking)<br>default: enabled events
`data` | array | [] | data array: [{"key": 0, label: "Element", "value": 1}]<br>object properties:<br>"key" (int): ID of current set<br>"label" (string): label of current set<br>"value" (int): value of current set 

## Events
Parameter | Description
--- | ---
`onSectionClick` | call back function for click event<br>object keys:<br>"key" (int): ID of clicked element<br>"label" (string): label of clicked element<br>"value" (int): value of clicked element<br>"percent" (string): percentage value of clicked element<br>"total" (int): total amount of all data 
`hoverText` | call back function for custom hover text format<br>expects string as return value<br>object keys:<br>"key" (int): ID of current element<br>"label" (string): label of current element<br>"value" (int): value of current element<br>"percent" (string): percentage value of current element<br>"total" (int): total amount of all data

## Methods
Parameter | Description
--- | ---
`update` | update graph<br>method name "update"<br>expects second parameter "data"<br>var data = []; $("#indicator").stackbars("update", data);



## Demo

See working demo on [developer.jpweiner.net](http://developer.jpweiner.net/stackbars.html).


## Credits

Built on top of [jQuery Boilerplate](http://jqueryboilerplate.com).

## License

[MIT License](http://zenorocha.mit-license.org/) © Zeno Rocha

