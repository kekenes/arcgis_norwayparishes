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
     
    "esri/renderers/SimpleRenderer",
    
    "esri/symbols/SimpleLineSymbol", 
    "esri/symbols/SimpleFillSymbol",

    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",

    "dojo/on",
    "dojo/domReady!"
  ], function (
    Map, MapView, SceneView,
    Graphic,
    Extent, SpatialReference, webMercatorUtils,
    ArcGISTiledLayer, FeatureLayer, GraphicsLayer,
    SimpleRenderer,
    SimpleLineSymbol, SimpleFillSymbol,
    QueryTask, Query,
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

    
    /**** Layer ****/

    var countiesUrl = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/ArcGIS/rest/services/Norway_Parishes_4326_2/FeatureServer/0";

    var countiesLyr = new FeatureLayer({
      url: countiesUrl,
      opacity: 0.95
    });
    
    map1.add(countiesLyr);

    var graphicsLayer = new GraphicsLayer();
    map1.add(graphicsLayer);

    view2D.then(function() {
      countiesLyr.then(function() {

        var line = new SimpleLineSymbol({
          width: 4.25,
          color: [52, 152, 219,1.0]
        });

        var symbol = new SimpleFillSymbol({
          color: [52, 152, 219, 0.1],
          outline: line
        });

        var countiesRndr = new SimpleRenderer({
          symbol: symbol
        });

        countiesLyr.renderer = countiesRndr;

        view2D.animateTo(countiesLyr.fullExtent);
      });
    });



    /**** 3D ****/
    
    
    
    
    
    

  }
);