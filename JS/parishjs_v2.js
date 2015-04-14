var map;
require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/layers/WMTSLayer",
    "esri/layers/WMTSLayerInfo",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/config",
    "esri/dijit/Legend",
    
    "dijit/layout/BorderContainer", 
    "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer",
    "dijit/layout/AccordionPane",
    
    "agsjs/dijit/TOC", 
         
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
        Legend,
         
        BorderContainer, 
        ContentPane, 
        AccordionContainer, 
        AccordionPane,
         
        TOC,
         
        request, 
        domConstruct, 
        dom, 
        on){
    
  //////////CONFIG SETTINGS AND OPTIONS/////////////////////////////////////////
  esriConfig.defaults.io.proxyUrl = "/proxy/";
    
  ///////////////////LAYERS AND LAYER INFO///////////////////////////////////////  
  var countiesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/0");
    
  var municipalitiesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/1");
    
  var parishesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/2");

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
    
  var topoLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer", {
    opacity: 0.4
  });    
    
  //////////////////////END LAYERS AND LAYER INFO///////////////////////////
    
  /////////////////////MAP AND LEGEND///////////////////////////////////////
    
  on(countiesLayer, "load", initMap);
  
  function initMap(){
      
    map = new Map("map", {
      extent: countiesLayer.fullExtent
    });
      
    console.log("map extent: ", map.extent);
      
    map.addLayers([topoLayer, norTopoLayer, parishesLayer, municipalitiesLayer, countiesLayer]);
      
    on(map, "layers-add-result", function(evt){
//        var legend = new Legend({
//          map: map
//        }, "legendContent");
//        
//        legend.startup();
        
        var toc = new TOC({
          map: map,
          layerInfos: [
              {
                layer: countiesLayer,
                title: "Counties"
              },
              {
                layer: municipalitiesLayer,
                title: "Municipalities"
              },
              {
                layer: parishesLayer,
                title: "Parishes"
              },
              {
                layer: norTopoLayer,
                title: "Norwegian Topographic Map",
                slider: true
              },
              {
                layer: streetLayer,
                title: "Roads",
                collapsed: true
              },
              {
                layer: satelliteLayer,
                title: "Satellite Imagery",
                collapsed: true
              },
              {
                layer: topoLayer,
                title: "World Topographic Map",
                collapsed: true
              }
              
          ]
        }, "legendContent");
        toc.startup();
    });
      
  }  
  
  ////////////////////END MAP AND LEGEND///////////////////////////

    ///////////////////////////EVENTS/////////////
    
    on(dom.byId("toolsHeader"), "click", function(){
        
      if(dom.byId("tools").style.height == "50%"){    
          dom.byId("tools").style.height = "25px";
          dom.byId("toolsMinIcon").style.visibility = "hidden";
          dom.byId("toolsMaxIcon").style.visibility = "visible";
      }
      else{
          dom.byId("tools").style.height = "50%";
          dom.byId("toolsMinIcon").style.visibility = "visible";
          dom.byId("toolsMaxIcon").style.visibility = "hidden";
      }
    });
    
    on(dom.byId("legendHeader"), "click", function(){
        
      if(dom.byId("legend").style.height == "50%"){    
          dom.byId("legend").style.height = "25px";
          dom.byId("legendMinIcon").style.visibility = "hidden";
          dom.byId("legendMaxIcon").style.visibility = "visible";
      }
      else{
          dom.byId("legend").style.height = "50%";
          dom.byId("legendMinIcon").style.visibility = "visible";
          dom.byId("legendMaxIcon").style.visibility = "hidden";
      }
    });
    
//    on(dom.byId("legendHeader"), "click", function(){
//      dom.byId("tools").style.height = "50%";
//      dom.byId("toolsMinIcon").style.visibility = "visible";
//      dom.byId("toolsMaxIcon").style.visibility = "hidden";
//    });
  
  
   
});