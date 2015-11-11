require(
  [
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",

    "esri/Graphic",

    "esri/geometry/Extent",
    "esri/geometry/SpatialReference",
    "esri/geometry/support/webMercatorUtils",
    
    "esri/layers/ArcGISTiledLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",

    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    
    "./resources/js/utils/LayersManager.js",

    "dojo/on",
    "dojo/domReady!"
  ], function (
    Map, MapView, SceneView,
    Graphic,
    Extent, SpatialReference, webMercatorUtils,
    ArcGISTiledLayer, FeatureLayer, GraphicsLayer,
    QueryTask, Query,
    LayersManager,
    on
  ) {

    /**** Maps ****/
    var map1 = new Map({
      basemap: "dark-gray"
    });

    var map2 = new Map({
      basemap: "satellite"
    });

    /**** Views ****/
    var view2D = new MapView({
      container: "view2D",
      map: map1
    });

    var view3D = new SceneView({
      container: "view3D",
      map: map2
    });

    /**** 2D ****/

    view2D.then(function() {
      
      /**** Layers ****/
      var lyrsData = "resources/data/layers.json";
      LayersManager.createLayers(lyrsData).then(function(layers) {
        map1.add(layers);
        
        /**** options layers ****/
        layers.forEach(function(layer) {
          var layerElm = document.getElementById(layer.id);
          
          if(layer.visible) {
            layerElm.checked = true;
          } else {
            layerElm.checked = false;
          }
          
          on(layerElm, "change", function() {
            if(layerElm.checked) {
              layer.visible = true;
            } else {
              layer.visible = false;
            }
          });
        })
      });
  
      var graphicsLayer = new GraphicsLayer();
      map1.add(graphicsLayer);
      
    });

    /**** options basemap ****/
    var basemapElm = document.getElementById("basemap");
    on(basemapElm, "change", function() {
      map1.basemap = basemapElm.value;
    });

    /**** 3D ****/
    
    
    
    
    
    

  }
);