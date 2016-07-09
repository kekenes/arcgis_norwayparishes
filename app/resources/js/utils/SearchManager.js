/**
* This module is used to provide data from a json file
*/
define([
  "dojo/_base/declare",
  
  "esri/widgets/Search",
  
  "esri/tasks/Locator",
  
  "./resources/js/utils/LayersManager.js",
], function (
  declare,
  Search,
  Locator,
  LayersManager
  ) {

  var searchManager = {};

  var startSearch = function (view, layers) {

    var search = new Search({
      activeSourceIndex: "all",
      view: view,
      enableButtonMode: true,
      enablePopup: false,
      enableSuggestions: true,
      enableSuggestionsMenu: true,
      expanded: false,
      maxResults: 5,
      maxSuggestions: 5,
      minCharacters: 1,
      showPopupOnSelect: false,
      sources: _createSearchSources(layers)
    }, "search");
    
    console.log(search);
    
    search.startup();
    
    search.on("select-result", function(evt) {
      console.log(evt);
    });

  };
  
  var _createSearchSources = function(layers) {
    var sources = [], 
    layersData = LayersManager.getLayersData();
    
    layersData.forEach(function(layerData, idx) {
      var searchData = layerData && layerData.search;
      
      if(searchData) {
        var source = {
          featureLayer: layers[idx],
          autoNavigate: true,
          displayField: searchData.displayField,
          exactMatch: false,
          enableHighlight: true,
          enablePopup: false,
          enableSuggestions: true,
          maxResults: 5,
          maxSuggestions: 3,
          minCharacters: 1,
          name: searchData.name,
          outFields: searchData.outFields,
          placeholder: searchData.placeholder,
          searchFields: searchData.searchFields,
          showPopupOnSelect: false
        };
        
        sources.push(source);
      }
    });
    
    var geocoder = {
        locator: new Locator("//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"),
        singleLineFieldName: "SingleLine",
        outFields: ["Addr_type"],
        name: "Addresses",
        localSearchOptions: {
          minScale: 300000,
          distance: 50000
        },
        placeholder: "Street address",
        maxResults: 5,
        minCharacters: 1,
        maxSuggestions: 2,
        autoNavigate: true
    }
    sources.push(geocoder);
    
    return sources;
  };
  
  searchManager.startSearch = startSearch;

  return searchManager;
});