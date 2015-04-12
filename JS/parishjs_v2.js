var map;
require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/layers/WMTSLayer",
    "esri/layers/WMTSLayerInfo",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/config",
    
    "dijit/layout/BorderContainer", 
    "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer",
    "dijit/layout/AccordionPane",
         
    "dojo/request",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/on", 
    "dojo/domReady!"],
    function(
        Map,
        FeatureLayer,
        WMTSLayer,
        WMTSLayerInfo,
        ArcGISTiledMapServiceLayer,
        esriConfig,
         
        BorderContainer, 
        ContentPane, 
        AccordionContainer, 
        AccordionPane, 
         
        request, 
        domConstruct, 
        dom, 
        on){
    
  //////////CONFIG SETTINGS AND OPTIONS/////////////////////////////////////////
  esriConfig.defaults.io.proxyUrl = "/proxy/";
    
  ///////////////////LAYERS AND LAYER INFO///////////////////////////////////////  
  var countiesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/0");

  var euroInfo = new WMTSLayerInfo({
          identifier: "europa",
          tileMatrixSet: "EPSG:3857",  //3857, 4326, 900913, 32635, 32633, 32632
          format: "png"
        });
  var euroOptions = {
          serviceMode: "KVP",
          layerInfo: euroInfo
        };
        
  var topoInfo = new WMTSLayerInfo({
          identifier: "topo2",
          tileMatrixSet: "EPSG:3857",  //3857, 4326, 25832, 25833, 25835, 3035, 900913, 32635, 32633, 32632
          format: "png"
        });
  var topoOptions = {
          serviceMode: "KVP",
          layerInfo: topoInfo,
          opacity: 1
        };
  var norTopoLayer = new WMTSLayer("http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities", topoOptions);
        
//  var europeBaseLayer = new WMTSLayer("http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities", euroOptions);

  var streetLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer");
    
  var satelliteLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer", {
    opacity: 1
  });
    
  //////////////////////END LAYERS AND LAYER INFO///////////////////////////
    
  on(countiesLayer, "load", initMap);
  
  
  function initMap(){
      
    map = new Map("map", {
      extent: countiesLayer.fullExtent,
      basemap: "satellite"
    });
      
    console.log("map extent: ", map.extent);
      
    map.addLayers([norTopoLayer, countiesLayer]);  
      
  }  
  
  

    ///////////////////////////EVENTS/////////////
    
    on(dom.byId("toolsMinButton"), "click", function(){
      dom.byId("tools").style.height = "45px";
      dom.byId("toolsMinButton").style.visibility = "hidden";
      dom.byId("toolsMaxButton").style.visibility = "visible";
    });
    
    on(dom.byId("toolsMaxButton"), "click", function(){
      dom.byId("tools").style.height = "50%";
      dom.byId("toolsMinButton").style.visibility = "visible";
      dom.byId("toolsMaxButton").style.visibility = "hidden";
    });
  
  
   
});