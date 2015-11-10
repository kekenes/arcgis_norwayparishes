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
    "esri/symbols/SimpleMarkerSymbol",

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
    SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol,
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
    var municipalitiesUrl = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/ArcGIS/rest/services/Norway_Parishes_4326_2/FeatureServer/1";
    var parishesUrl = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/ArcGIS/rest/services/Norway_Parishes_4326_2/FeatureServer/2";
    var officesUrl = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/NA_Regional_Offices_2/FeatureServer/0";
    
    var countiesLyr = new FeatureLayer({
      url: countiesUrl,
      opacity: 0.95
    });
    
    var municipalitiesLyr = new FeatureLayer({
      url: municipalitiesUrl,
      opacity: 0.95
    });
    
    var parishesLyr = new FeatureLayer({
      url: parishesUrl,
      opacity: 0.95
    });
    
    var officesLyr = new FeatureLayer({
      url: officesUrl,
      opacity: 0.95
    });
    
    map1.add([officesLyr, parishesLyr, municipalitiesLyr, countiesLyr]);

    var graphicsLayer = new GraphicsLayer();
    map1.add(graphicsLayer);

    view2D.then(function() {
      
      //counties
      countiesLyr.then(function() {
        view2D.animateTo(countiesLyr.fullExtent);

        var countiesLine = new SimpleLineSymbol({
          width: 4.25,
          color: [230, 126, 34,1.0]
        });

        var countiesSymbol = new SimpleFillSymbol({
          color: [52, 152, 219, 0.1],
          outline: countiesLine
        });

        var countiesRndr = new SimpleRenderer({
          symbol: countiesSymbol
        });

        countiesLyr.renderer = countiesRndr;
      });
      
      //muncipalities
      municipalitiesLyr.then(function() {

        var muncipalitiesLine = new SimpleLineSymbol({
          width: 4.25,
          color: [52, 152, 219,1.0]
        });

        var muncipalitiesSymbol = new SimpleFillSymbol({
          color: [52, 152, 219, 0.1],
          outline: muncipalitiesLine
        });

        var muncipalitiesRndr = new SimpleRenderer({
          symbol: muncipalitiesSymbol
        });

        municipalitiesLyr.renderer = muncipalitiesRndr;
      });
      
      //parishes
      parishesLyr.then(function() {

        var parishesLine = new SimpleLineSymbol({
          width: 4.25,
          color: [241, 196, 15,1.0]
        });

        var parishesSymbol = new SimpleFillSymbol({
          color: [52, 152, 219, 0.1],
          outline: parishesLine
        });

        var parishesRndr = new SimpleRenderer({
          symbol: parishesSymbol
        });

        parishesLyr.renderer = parishesRndr;
      });
      
      //offices
      officesLyr.then(function() {

        var officesSymbol = new SimpleMarkerSymbol({
          color: [46, 204, 113,1.0]
        });

        var officesRndr = new SimpleRenderer({
          symbol: officesSymbol
        });

        officesLyr.renderer = officesRndr;
      });
    });

    var basemapElm = document.getElementById("basemap");
    on(basemapElm, "change", function() {
      map1.basemap = basemapElm.value;
    });

    /**** 3D ****/
    
    
    
    
    
    

  }
);