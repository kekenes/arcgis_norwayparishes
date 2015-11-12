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
	
	"./resources/js/utils/DataProvider.js"
], function(
	Deferred,
	FeatureLayer,
	SimpleRenderer,
	SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol,
	DataProvider
) {
	'use strict';
	var layersManager = {}, layers = [], layersData = null;
	
	var getLayersData = function(url) {
		
		if(url) {
			var deferred = new Deferred();
		
			DataProvider.getJsonData(url, true).then(function(json){
				layersData = json;
				deferred.resolve(layersData);
			});
			
			return deferred;
		} else {
			return layersData;
		}
		
	};
	
	var getLayers = function() {
		return layers;			
	};
	
	var createLayers = function(url) {
		
		var deferred = new Deferred();
		
		getLayersData(url).then(function(json){
			deferred.resolve(_addLayers(json));
		});
		
		return deferred;
	};
		
	var _addLayers = function(lyrs) {
		
		lyrs.forEach(function(lyr) {
			var layer = null;
			
			if(lyr.type === "FeatureLayer") {
				layer = new FeatureLayer({
					id: lyr.name,
					url: lyr.url,
					outFields: ["*"],
					visible: lyr.visible
				});
			}
			
			if(lyr.symbol) {
				var sym = null;
				if(lyr.symbol.type === "SimpleFillSymbol") {			
					sym = new SimpleFillSymbol({
						color: [0,0,0,0],
						outline: new SimpleLineSymbol({
							width: 3.5,
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
		
	layersManager.getLayersData = getLayersData;
	layersManager.getLayers = getLayers;
	layersManager.createLayers = createLayers;		
	
	return layersManager;
});