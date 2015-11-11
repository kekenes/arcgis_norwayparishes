/**
 * This module is used to provide layers
 */
 define([
	"dojo/Deferred",
	
	"esri/layers/FeatureLayer",
	 
	"esri/renderers/SimpleRenderer",
	
	"esri/symbols/SimpleLineSymbol", 
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleMarkerSymbol",
 ], function(
	Deferred,
	FeatureLayer,
	SimpleRenderer,
    SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol
 ) {
	 'use strict';
	 var layersManager = {};
	 
	 var createLayers = function(url) {
		var deferred = new Deferred(), 
			xhr = new XMLHttpRequest();
		
		xhr.open("GET", url, true); //Asynchronous request

		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var json = JSON.parse(xhr.responseText);
				console.log(json);
				deferred.resolve(_addLayers(json));
			} else {
				console.error(xhr.statusText);
			}
			}
		};
		xhr.onerror = function (e) {
			console.error(xhr.statusText);
			deferred.reject(e);
		};
		xhr.send();
	
		return deferred;
	 };
	 	 
	 var _addLayers = function(lyrs) {
		 var layers = [];
		 
		 lyrs.forEach(function(lyr) {
			var layer = null;
			
			if(lyr.type === "FeatureLayer") {
				layer = new FeatureLayer({
					id: lyr.name,
					url: lyr.url,
					visible: lyr.visible
				});
			}
			
			if(lyr.symbol) {
				var sym = null;
				if(lyr.symbol.type === "SimpleFillSymbol") {			
					sym = new SimpleFillSymbol({
						outline: new SimpleLineSymbol({
							width: 4.25,
							color: lyr.symbol.outline.color
						})
					});
				} else {
					sym = new SimpleMarkerSymbol({
						color: lyr.symbol.color
					});
				}
				
				layer.renderer = new SimpleRenderer({
					symbol: sym
				}); 
			} 
			
			layers.push(layer);				 
		 });
		 
		 return layers;
	 };
	 	 
	 layersManager.createLayers = createLayers;
	 
	 return layersManager;
 });