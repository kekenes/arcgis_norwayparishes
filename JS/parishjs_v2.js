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
    
    /////////////////////////POPUPs///////////////////////////////////
 function setCountyInfo(info){
    var countyName = info.COUNTY;
    var wikiURL = info.WIKI;
    var FSwiki = info.FS_WIKI;
    var oldName = info.OLD_COUNTY;   //not in FS
    var farmList = info.FARMS;      //not in FS
 }
    
 function setMunicipalityInfo(info){
    var municipalityName = info.MUNICIPALITY;
    var countyName = info.COUNTY;
 }

 function setParishInfo(info){
    var parishName = info.PAR_NAME;
    var municipalityName = info.MUNICIPALITY;
    var countyName = info.COUNTY;
    var photoURL = info.PHOTO;
    var photoOr = info.PHOTO_O;
    var FSwiki = info.FAM_SEARCH;
    var farmList = info.FARMS;
    var churchURL = info.CHURCH;
    var da1_url = info.DA_1 || null;
    var da1_name = info.DA_1_NAME || null;
    var da2_url = info.DA_2 || null;
    var da2_name = info.DA_2_NAME || null;
    var da3_url = info.DA_3 || null;
    var da3_name = info.DA_3_NAME || null;
    var da4_url = info.DA_4 || null;
    var da4_name = info.DA_4_NAME || null;
    var da5_url = info.DA_5 || null;
    var da5_name = info.DA_5_NAME || null;
 }
    
    ////////////////////////END POPUPS//////////////////////////////////
    
  /////////////////////MAP AND LEGEND///////////////////////////////////////
    
  on(countiesLayer, "load", initMap);
  
  function initMap(){
      
    map = new Map("map", {
      extent: countiesLayer.fullExtent//,
//      basemap: "topo"
    });
      
    console.log("map extent: ", map.extent);
      
    map.addLayers([satelliteLayer, topoLayer, norTopoLayer, streetLayer, parishesLayer, municipalitiesLayer, countiesLayer]);
      satelliteLayer.hide();
      streetLayer.hide();
      
    on(map, "layers-add-result", function(evt){

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
              }              
          ]
        }, "legendContent");
        toc.startup();
    });
      
  }
    
  on(document.getElementsByName("baseLayers")[1], "click", function(evt){
    if(dom.byId("radioSat").checked){
//        map.setBasemap("satellite");
        satelliteLayer.show();
        streetLayer.show();
        topoLayer.hide();
        norTopoLayer.hide();
    }
  });
    
  on(document.getElementsByName("baseLayers")[0], "click", function(evt){
    if(dom.byId("radioTopo").checked){
//        map.setBasemap("topo");
        satelliteLayer.hide();
        streetLayer.hide();
        topoLayer.show();
        norTopoLayer.show();
    }
  });
    
  on(dom.byId("streetCheck"), "click", function(evt){
    if(dom.byId("streetCheck").checked){
        streetLayer.show();
    }
    else{
        streetLayer.hide();
    }
  });    
    
  
  
  ////////////////////END MAP AND LEGEND///////////////////////////

    ///////////////////////////EVENTS/////////////
    dom.byId("legend").style.height = "35%";
    dom.byId("tools").style.height = "50%";
    
    on(dom.byId("toolsHeader"), "click", function(){
        
      if(dom.byId("tools").style.height == "50%"){  
          dom.byId("tools").style.height = "25px";
          dom.byId("toolsMinIcon").style.visibility = "hidden";
          dom.byId("toolsMaxIcon").style.visibility = "visible";
          dom.byId("toolsContent").style.visibility = "hidden";
      }
      else{
          dom.byId("tools").style.height = "50%";
          dom.byId("toolsMinIcon").style.visibility = "visible";
          dom.byId("toolsMaxIcon").style.visibility = "hidden";
          dom.byId("toolsContent").style.visibility = "visible";
      }
    });
    
    on(dom.byId("legendHeader"), "click", function(){
        
      if(dom.byId("legend").style.height == "35%"){    
          dom.byId("legend").style.height = "25px";
          dom.byId("legendMinIcon").style.visibility = "hidden";
          dom.byId("legendMaxIcon").style.visibility = "visible";
          dom.byId("legendContent").style.visibility = "hidden";
          dom.byId("legendContentBase").style.visibility = "hidden";
          
      }
      else{
          dom.byId("legend").style.height = "35%";
          dom.byId("legendMinIcon").style.visibility = "visible";
          dom.byId("legendMaxIcon").style.visibility = "hidden";
          dom.byId("legendContent").style.visibility = "visible";
          dom.byId("legendContentBase").style.visibility = "visible";
      }
    });
   
});