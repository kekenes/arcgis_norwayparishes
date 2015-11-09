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
     
    "esri/renderers/UniqueValueRenderer", 
    
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
    UniqueValueRenderer,
    SimpleLineSymbol, SimpleFillSymbol,
    QueryTask, Query,
    on
  ) {

    /**** Maps ****/
    var map1 = new Map({
      basemap: "topo"
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
    /*var baselyr = new ArcGISTiledLayer({
      url: "http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer"
    });

    map1.add(baselyr);*/

    var url = "http://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0";
    var features = null;

    var lyr = new FeatureLayer({
      url: url,
      opacity: 0.95
    });
    
    map1.add(lyr);

    var graphicsLayer = new GraphicsLayer();
    map1.add(graphicsLayer);

    var queryTask = new QueryTask({
      url: url
    });
    var query = new Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.where = "Country='United States' " +
      "Or Country='United Kingdom' " +
      "Or Country='Spain' " +
      "Or Country='Germany' " +
      "Or Country='France'";

    //When resolved, returns features and graphics that satisfy the query.
    queryTask.execute(query).then(function(results){
      console.log(results);
      features = results.features;
    }, function (err) {
      console.log(err);
    });

    var init2DExtent = new Extent({
      xmax: 19407422.51677575,
      xmin: -18162905.625944093,
      ymax: 12827633.823335513,
      ymin: -5859690.851819406,
      spatialReference: new SpatialReference({
        wkid: 102100
      })
    });

    view2D.then(function() {
      
      lyr.then(function() {
        var defaultSymbol = new SimpleFillSymbol({
          color: "#34495e"
        });
  
        var renderer = new UniqueValueRenderer(defaultSymbol, "Country");
        
        console.log(lyr);
    
        //add symbol for each possible value
        renderer.addValue("United States", new SimpleFillSymbol({color: "#95a5a6"}));
        renderer.addValue("United Kingdom", new SimpleFillSymbol({color: "#3498db"}));
        renderer.addValue("Spain", new SimpleFillSymbol({color: "#9b59b6"}));
        renderer.addValue("Germany", new SimpleFillSymbol({color: "#e74c3c"}));
        renderer.addValue("France", new SimpleFillSymbol({color: "#f1c40f"}));
        
        lyr.renderer = renderer;

        view2D.animateTo(init2DExtent);
      });

      var ele = document.getElementById("view2D");
      on(ele, "mousemove", showCoordinates);

      function showCoordinates(evt) {
        var point = view2D.toMap(evt.layerX, evt.layerY);
        graphicsLayer.clear();
        ele.style.cursor = "auto";

        for(var i=0; i<features.length; i++){
          var geometry = features[i].geometry;
          if(geometry.contains(point)){
            ele.style.cursor = "pointer";
            var sym = new SimpleFillSymbol({
              color: "#ecf0f1"
            });
            var graphic = new Graphic({
              geometry: geometry,
              symbol: sym
            });
            graphicsLayer.add(graphic);
          }
        }
      }

      view2D.on("click", function(evt){
        console.log(evt.mapPoint);

        for(var i=0; i<features.length; i++){
          var geometry = features[i].geometry;

          if(geometry.contains(evt.mapPoint)){
            view2D.animateTo(geometry.extent);
          }
        }
      });
    });



    /**** 3D ****/
    
    
    
    
    
    

  }
);