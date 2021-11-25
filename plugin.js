/*!
 * stackbars.js 1.0.0
 * https://github.com/jpweinerdev/stackbars.js
 *
 * @license MIT (https://github.com/jpweinerdev/stackbars.js/blob/master/LICENSE)
 *
 * @copyright 2021 http://developer.jpweiner.net/stackbars.html - A project by Jean-Pierre Weiner - Developer
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, d3, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "stackbars",
			defaults = {
				height: 48,
				bottomMargin: 0,
				container: '#indicator',
				colorSetting: ["#33876b","#559559","#77a347","#98b236","#bac024","#dcce12","#cccccc","#b2b2b2","#9a9a9a","#808080","#4a4a4a","#121212"],
				stackMargin: 0,
				stackHeight: 6,
				textPositionEven: -4,
				textPositionOdd: -4,
				hoverButtonWidth: 200,
				stackMinWidth: 15,
				disableEvents: false
			};
			

		//The actual plugin constructor
		function Plugin ( element, options ) {
			var _self = this;			
			this.element = element;
			//this.options = options;

			//jQuery has an extend method which merges the contents of two or
			//more objects, storing the result in the first object. The first object
			//is generally empty as we don't want to alter the default options for
			//future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			
			//public method
			this.update = function(data) {
				//this references the div not the plugin object!
				//_self = this object
				
				_self.settings.data = data;				
				_self.drawAndUpdate();

			}	
		
			this.init();
			
		}

		//Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			
			getPercentatage: function(item,total) {
				return Math.round(item*100/total)+'%';  
			},
			
			svg: {},
			g: {}, //container g 
			graphWidth: 800, //usually 100 % of container
			graphheight: 28, //svg height
			bottomPosition: 0, //of container g (all bars and text)
			color: {}, //d3 color function
			total: 0, //total count of all data
			
			setBounds: function() {
				var bounds = d3.select(this.settings.container).node().getBoundingClientRect();
				
				this.graphWidth = bounds.width;
				this.graphheight = this.settings.height;
				
				this.bottomPosition = this.settings.height - this.settings.stackHeight - this.settings.bottomMargin;				
			},
			
			
			initOnWindowResize: function() {
				var _this = this;
				
				$(window).resize(function(){
					if(_this.settings.data.length != 0) {
						
						_this.setBounds(); //reset bounds
						_this.svg.attr("width", _this.graphWidth); //resize svg					
						_this.drawAndUpdate(); //update graph
					}
				});
			},
			
			
			init: function() {

				//Place initialization logic here
				//You already have access to the DOM element and
				//the options via the instance, e.g. this.element
				//and this.settings
				//you can add more functions like the one below and
				//call them like the example below
				//this.yourOtherFunction( this.settings.propertyName );				
				
				var _this = this;				
				
				this.setBounds(); //use container div
				
				this.color = d3.scaleOrdinal(this.settings.colorSetting);
				
			
								
				this.svg = d3.select(this.settings.container).append("svg")
					.attr("width", this.graphWidth)
					.attr("height", this.graphheight);
				
				//container g
				this.g = this.svg.append("g")
					.attr("transform", "translate(0,"+this.bottomPosition+")");
						
				this.drawAndUpdate();
				
				this.initOnWindowResize();
						
			},
						
			drawAndUpdate: function() {
				var _this = this;
				
				var x, w, stack, rect, label, stackEnter;
				var total = 0;									
				var t = d3.transition().duration(750);
				
				var data = this.settings.data;				
				
				var infoOver = function(d) {

					
					
					var currentG = d3.select(this);
					var currentRect;					
					var allText = _this.g.selectAll("text");
					
					var totalWidth = _this.graphWidth;
					var xTranslate = x(d.base);
					
					
					d3.event.preventDefault();
					d3.event.stopPropagation();
					
					//make small boxes at the end translate from right corner
					if(xTranslate + _this.settings.hoverButtonWidth > totalWidth) {
						xTranslate = totalWidth - _this.settings.hoverButtonWidth;
					}
					
										
					
					allText.transition().duration(500)
						.attr("opacity",0);
						
						
					//transition current text to left
					currentG.select("text")
						.attr("opacity",0)
						.attr("text-anchor", "start")
						.text(hoverText)						
						.transition().duration(500)
							.attr("opacity",1)
							.attr("dx",0);
							
					
					currentG.transition().duration(500)
						.attr("transform", function(d) { return "translate("+xTranslate+","+_this.settings.stackHeight*-2+")"; });
					
					currentRect = currentG.select("rect")
						.transition().duration(500)
							.attr("width", function(d) { return x(d.value) > _this.settings.hoverButtonWidth ? x(d.value) : _this.settings.hoverButtonWidth })
							.attr("height", _this.settings.stackHeight*3);
				}
				
				var infoOut = function(d, i, n) {
					//var currentG = d3.select(this);
					var currentG = d3.select(n[i]); //from all nodes current index
					var currentRect;
					var allText = _this.g.selectAll("text");
										
					currentG.transition().duration(500)
						.attr("transform", function(d) { return "translate("+ x(d.base) +",0)" });
					
					currentRect = currentG.select("rect")
						.transition().duration(500)
							.attr("width", function(d) { return w(d); })  //d => w(d))
							.attr("height", _this.settings.stackHeight);
					
					//prepare transition for all
					allText
						.attr("opacity",0)
						.attr("text-anchor", "end");
					
					//restor percentage value of current text item				
					currentG.select("text").text(indicatorText);
					
					//transition text back to right
					allText
						.transition().duration(500)
							.attr("dx", function(d) { return x(d.value); })
							.attr("opacity",1);						
				}
				
				//function for public: generate public object
				var itemClick = function(d, i, n){
					var publicObj = {
						key: d.key, 
						label: d.label, 
						value: d.value,
						percent: _this.getPercentatage(d.value,total),
						total: total
					}
					
					_this.onSectionClick(publicObj);
				}
				
				//function for public: generate public object
				var hoverText = function(d){
					var publicObj = {
						key: d.key, 
						label: d.label, 
						value: d.value,
						percent: _this.getPercentatage(d.value,total),
						total: total
					}
					
					return _this.hoverText(publicObj);
				}
				
				//on append text element
				var indicatorText = function(d){
					
					//write percentage only if rect width is >15						
					//write percentage only if value greater than 2%					
					if(w(d) < _this.settings.stackMinWidth) {	
						return "";
					} else {
						return _this.getPercentatage(d.value,total);
					}					
				}
				
				
				this.setBounds(); //reset when resize happend and bar data was empty
				this.svg.attr("width", this.graphWidth); //resize svg
				
				
				//sort array
				data = data.sort(function(a, b) { return d3.descending(a.value, b.value); });				
				
				
				//preprocess data				
				data.forEach(function(d, i) {
					d.key = i; //important!
					d.base = total;
					total += d.value;					
				});
				

				x = d3.scaleLinear()
					.domain([0, d3.sum(data, function(d) { return d.value; })])
					.range([0, _this.graphWidth]);

				w = function(d) {
					var width = x(d.value) - _this.settings.stackMargin;
					return width < 0 ? 0 : width;
				}

				//[JOIN] stack
				stack = this.g.selectAll(".stack")
					.data(data, function(d) { return d.key }); //d => d.key);
						

				//[UPDATE] stack
				stack.transition(t)					
					.attr("transform", function(d) { return "translate("+x(d.base)+",0)"; })
						.on('end', function(d){ 
							var txt = _this.g.selectAll("text");							
							txt.transition().duration(500).attr("opacity", 1);						
						});

				rect = stack.select("rect");

				//[UPDATE] stack > rect
				rect.transition(t)					
					.attr("width", function(d) { return w(d); });

				label = stack.select("text");

				//[UPDATE] stack > text
				label
					.attr("opacity", 0)
						.transition(t)
							.attr("dx", function(d) { return x(d.value); })
							.attr("opacity", 0)
							.text(indicatorText);						

				//[ENTER] stack
				stackEnter = stack
					.enter().append("g")
						.attr("class", "stack")
						.attr("opacity", 0)
						.attr("transform", "translate(0,0)");		


				stackEnter
					.transition(t)
						.attr("opacity", 1)
						.attr("transform", function(d) { return "translate("+x(d.base)+",0)"; })
						.on('end', function(d){ 
							var txt = _this.g.selectAll("text");							
							txt.transition().duration(500).attr("opacity", 1);						
						});

				//[ENTER] stack > rect
				stackEnter.append("rect")
					.attr("x", 0) 
					.attr("y", 0)
					.attr("width", 0)
					.attr("height", this.settings.stackHeight)
					.attr("opacity", 0)
					.attr("fill", function(d){ return _this.color(d.key); })				
					.transition(t)
						.attr("opacity", 1)
						.attr("width", function(d) { return w(d); });










				//[ENTER] stack > text
				stackEnter.append("text")
					.attr("dx", 0)
					.attr("dy", function(d, i) { return i % 2 === 0 ? _this.settings.textPositionOdd : _this.settings.textPositionEven; })
					.attr("text-anchor", "end")
					.attr("opacity", 0)					
					.text(indicatorText)
					.transition(t)
						.attr("dx", function(d) { return x(d.value); }); 

				//[EXIT] stack
				stack
					.exit()
					.transition(t)
						.attr("opacity", 0)
						.attr("transform", function(d) { return "translate("+x(d.base)+",0)"; })
					.remove();
				
				//must be set for updated stack elements
				/*
				I'll add that if you want them to work more quickly, remove the mouseover and mousedown events from your Dom on touch only devices. iOS adds a ~200ms delay to wait for scroll events on elements with mouse events, even if you have added touch events as well. It was a really frustrating bug to squash and has improved the responsiveness of my app by loads.
				https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
				*/
				if(!this.settings.disableEvents) {
					if ('ontouchstart' in document.documentElement) {
						this.g.selectAll(".stack")
							.on('touchstart', infoOver)
							.on('touchend', function(d, i, n) {
								infoOut(d, i, n);
								itemClick(d, i, n);
							});							
					} else {
						this.g.selectAll(".stack")
							.on('mouseover', infoOver)
							.on('mouseout', function(d, i, n) {
								infoOut(d, i, n);
							})
							.on('click', itemClick);						
					}
				}
				

			},
			
			//eventhandler for section click
			//@param obj -> custom object from d data
			//public function
			onSectionClick: function (obj) {				
				if (typeof this.settings.onSectionClick === "function") {
					this.settings.onSectionClick(obj);
				}
			},
			
			//eventhandler for hoover text on mouse over
			//@param obj -> custom object from d data
			//return: string
			//public function
			hoverText: function (obj) {				
				if (typeof this.settings.hoverText === "function") {
					return this.settings.hoverText(obj);					
				}
			}			
			
		} );

		//A really lightweight plugin wrapper around the constructor,
		//preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			if (typeof arguments[0] === 'string') {
				var methodName = arguments[0];
				var args = Array.prototype.slice.call(arguments, 1);
				var returnVal;
				this.each(function() {
					if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
						returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
					// Allow instances to be destroyed via the 'destroy' method					
					} else if (methodName === 'destroy') {
							$.data(this, 'plugin_' + pluginName, null);
						} else {
							throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
						}
				});
				if (returnVal !== undefined){
					return returnVal;
				} else {
					return this;
				}
			} else if (typeof options === "object" || !options) {
				return this.each(function() {
					if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
					}
				});
			}

			
		};
		

} )( jQuery, window, document, d3 );