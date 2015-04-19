var map;
require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/layers/WMTSLayer",
    "esri/layers/WMTSLayerInfo",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/config",
    "esri/dijit/Legend",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/graphicsUtils",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/Color",
    
    "agsjs/dijit/TOC", 
     
    "dojo/_base/array",
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
        Query,
        QueryTask,
        graphicsUtils,
        SimpleFillSymbol,
        SimpleLineSymbol,
        SimpleMarkerSymbol,
        Color,
         
        TOC,
         
        array,
        request, 
        domConstruct, 
        dom, 
        on){
    
  //////////CONFIG SETTINGS AND OPTIONS/////////////////////////////////////////
  esriConfig.defaults.io.proxyUrl = "/proxy/";
    
  ///////////////////LAYERS AND LAYER INFO///////////////////////////////////////  
  var countiesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/0", {
    outFields: ["*"]
  });
    
  var municipalitiesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/1", {
    outFields: ["*"]
  });
    
  var parishesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/2", {
    outFields: ["*"]
  });

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
    
 var infoHeight = "25px";
    
 function setCountyInfo(info){
    infoHeight = "25%";
    animateInfoBox(infoHeight);
    console.log("set county info called: ", info);
    var countyName = info.COUNTY;
    var wikiURL = info.WIKI;
    var FSwiki = info.FS_WIKI;
    var oldName = info.OLD_COUNTY;   //not in FS
    var farmList = info.FARMS;      //not in FS
     
    var content = "<h4>" + countyName + " County</h4>"
    + "Known as " + oldName + " prior to 1919<br><br>"
    + "<a target='_blank' href='" + wikiURL + "'><button type='button' class='btn btn-primary btn-sm' >General Information</button></a><br>"
    + "<a target='_blank' href='" + FSwiki + "'><button type='button' class='btn btn-primary btn-sm' >Genealogical Resources</button></a><br>"
    + "<a target='_blank' href='" + farmList + "'><button type='button' class='btn btn-primary btn-sm' >Farm List</button></a><br><br>";
     
    dom.byId("infoContent").innerHTML = content;
 }
    
 function setMunicipalityInfo(info){
    infoHeight = "20%";
    animateInfoBox(infoHeight);
    var municipalityName = info.MUNICIPALITY;
    var countyName = info.COUNTY;
    var wikiURL = "http://en.wikipedia.org/wiki/" + municipalityName;
     
    var content = "<h4>" + municipalityName + " Municipality</h4>"
    + "<p>" + countyName + " County</p>"
    + "<a target='_blank' href='" + wikiURL + "'><button type='button' class='btn btn-primary btn-sm' >General Information</button></a><br><br>";
     
    dom.byId("infoContent").innerHTML = content;
 }  
    
 function setParishInfo(info){
    infoHeight = "50%";
    animateInfoBox(infoHeight); 
     
    var parishName = info.Par_NAME;
    var municipalityName = info.MUNICIPALITY;
    var countyName = info.COUNTY;
    var photoURL = info.PHOTO;
    var photoOr = info.PHOTO_O;
    var FSwiki = info.FAM_SEARCH;
    var farmList = info.FARMS;
    var churchURL = info.CHURCH;
    var da1_url = info.DA_1;
    var da1_name = info.DA_1_NAME;
    var da2_url = info.DA_2;
    var da2_name = info.DA_2_NAME;
    var da3_url = info.DA_3;
    var da3_name = info.DA_3_NAME;
    var da4_url = info.DA_4;
    var da4_name = info.DA_4_NAME;
    var da5_url = info.DA_5;
    var da5_name = info.DA_5_NAME;
     
    var photoWidth, photoHeight;
     
    if(photoOr == "L"){
        photoHeight = "150";
        photoWidth = "200";
    }
    if(photoOr == "P"){
        photoWidth = "150";
        photoHeight = "200";
    }
     
    var content = "<h4>" + parishName + " Parish</h4>"
    + "<p>" + municipalityName + ", " + countyName + " County</p>"
    + "<img src='" + photoURL + "' height='" + photoHeight + "' width='" + photoWidth + "'><br>"
    + "<a target='_blank' href='" + FSwiki + "'><button type='button' class='btn btn-primary btn-sm' >Genealogical Resources</button></a><br>"
    + "<a target='_blank' href='" + churchURL + "'><button type='button' class='btn btn-primary btn-sm' >Church History</button></a><br>"
    + "<a target='_blank' href='" + farmList + "'><button type='button' class='btn btn-primary btn-sm' > " + countyName + " County Farm List</button></a><br>";
     
     if(da1_url){
        content += "<a target='_blank' href='" + da1_url + "'><button type='button' class='btn btn-primary btn-sm'>" + da1_name + "</button></a><br>";
     }
     if(da2_url){
        content += "<a target='_blank' href='" + da2_url + "'><button type='button' class='btn btn-primary btn-sm'>" + da2_name + "</button></a><br>";
     }
     if(da3_url){
        content += "<a target='_blank' href='" + da3_url + "'><button type='button' class='btn btn-primary btn-sm'>" + da3_name + "</button></a><br>";
     }
     if(da4_url){
        content += "<a target='_blank' href='" + da4_url + "'><button type='button' class='btn btn-primary btn-sm'>" + da4_name + "</button></a><br>";
     }
     if(da5_url){
        content += "<a target='_blank' href='" + da5_url + "'><button type='button' class='btn btn-primary btn-sm'>" + da5_name + "</button></a>";
     }
     
     dom.byId("infoContent").innerHTML = content;
 }
    
    function animateInfoBox(height){
        dom.byId("info").style.visibility = "visible";
        dom.byId("info").style.height = height;
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
        topoLayer.hide();
        norTopoLayer.hide();
    }
  });
    
  on(document.getElementsByName("baseLayers")[0], "click", function(evt){
    if(dom.byId("radioTopo").checked){
//        map.setBasemap("topo");
        satelliteLayer.hide();
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
    
    
/////////////////////////TOOLS - DROPDOWN SETUP//////////////////////////////
    
    var countyDropdown = dom.byId("countyDropdown");
    var municipalityDropdown = dom.byId("municipalityDropdown");
    var parishDropdown = dom.byId("parishDropdown");
    
    function setDropdown(dropdown, county, municipality){
        
        console.log("set dropdown: ", dropdown, " county dropdown: ", countyDropdown);
        var dropQuery = new Query();
        var dropQueryTask = new QueryTask();
        var selectLayer, attribute;
        
        dropQuery.outFields = [ "COUNTY" , "MUNICIPALITY" , "Par_NAME" ];
        dropQuery.returnGeometry = true;
    
        if(dropdown === countyDropdown){
            console.log("county where set!!!", municipalitiesLayer);
            dropQuery.where = "1=1";
            selectLayer = countiesLayer;  //apply this to counties layer
            attribute = "county";
        }
        if(dropdown === municipalityDropdown){
            dropQuery.where = "COUNTY = '" + county + "'";
            selectLayer = municipalitiesLayer;  //apply this query to municipalities
            attribute = "municipality";
        }
        if((dropdown === parishDropdown) && (!municipality)){
            dropQuery.where = "COUNTY = '" + county + "'";  
            selectLayer = parishesLayer;    //apply this query to parishes
            attribute = "parish";
        }
        if((dropdown === parishDropdown) && (municipality)){
            dropQuery.where = "COUNTY = '" + county + "' AND MUNICIPALITY = '" + municipality + "'";
            selectLayer = parishesLayer;  //apply this query to parishes
            attribute = "parish";
        }
        
        selectLayer.queryFeatures(dropQuery, function(results){   //execute query
            dropdown.options.length = 0;
            var options = [];
            console.log("results: ", results);
            var features = results.features;
            array.forEach(features, function(item, i){
                if(attribute === "county")
                    options.push(item.attributes.COUNTY);
                if(attribute === "municipality")
                    options.push(item.attributes.MUNICIPALITY);
                if(attribute === "parish")
                    options.push(item.attributes.Par_NAME);
            });
            options.sort();   //alphabetize
            array.forEach(options, function(item, i){
                if(i==0){
                    var initOption = domConstruct.create("option");
                    initOption.text = "";
                    dropdown.add(initOption);
                }
                var option = domConstruct.create("option");
                option.text = item;
                dropdown.add(option);    
            });
            console.log("list: ", options);
        });
    }
    
    on(countiesLayer, "load", function(){
        console.log("on counties layer load.");
        setDropdown(countyDropdown);
    });
    
    on(countyDropdown, "change", function(evt){
        console.log("county dropdown selection made.", evt.target.value);
        selectRegion(countiesLayer, evt.target.value);
        setDropdown(municipalityDropdown, evt.target.value);
        setDropdown(parishDropdown, evt.target.value);
    });
    
    on(municipalityDropdown, "change", function(evt){
        console.log("municipality dropdown selection made: ", evt.target.value);
        console.log("county val: ", countyDropdown.value);
        selectRegion(municipalitiesLayer, countyDropdown.value, evt.target.value);
        setDropdown(parishDropdown, countyDropdown.value, evt.target.value);
    });
    
    on(parishDropdown, "change", function(evt){
        selectRegion(parishesLayer, countyDropdown.value, evt.target.value);
    });
    
    //////////////////////////SELECT REGIONS AND ZOOM////////////////////
    var selectSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 10), new Color([0,0,0,0.25]));
    
    parishesLayer.setSelectionSymbol(selectSymbol);
    municipalitiesLayer.setSelectionSymbol(selectSymbol);
    countiesLayer.setSelectionSymbol(selectSymbol);
    
    
    function selectRegion(layer, county, name){
        countiesLayer.clearSelection();
        municipalitiesLayer.clearSelection();
        parishesLayer.clearSelection();
        
        var selectQuery = new Query();
        selectQuery.returnGeometry = true;
        selectQuery.outFields = ["COUNTY", "MUNICIPALITY", "Par_NAME"];
        
        if(layer === parishesLayer){
            selectQuery.where = "COUNTY = '" + county + "' AND Par_NAME = '" + name + "'";
        }
        if(layer === municipalitiesLayer){
            selectQuery.where = "COUNTY = '" + county + "' AND MUNICIPALITY = '" + name + "'";
        }
        if(layer === countiesLayer){
            selectQuery.where = "COUNTY = '" + county + "'";
        }
        console.log("where statement: ", selectQuery.where);
        console.log("layer: ", layer.graphics);
        layer.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, zoomTo);
        
    }
    
    function zoomTo(result){
        var extent = graphicsUtils.graphicsExtent(result);
        map.setExtent(extent);
        console.log("zoom to result: ", result);
        var selectionInfo = result[0].attributes;
        
        //set content here!!!!!!!!!!!!!!!!!!!!!!!
        if(selectionInfo.COUNTY && !selectionInfo.MUNICIPALITY)
            setCountyInfo(selectionInfo);
        if(selectionInfo.MUNICIPALITY && !selectionInfo.Par_NAME)
            setMunicipalityInfo(selectionInfo);
        if(selectionInfo.Par_NAME)
            setParishInfo(selectionInfo);
    }
    
    on(countiesLayer, "click", function(evt){
        selectRegion(countiesLayer, evt.graphic.attributes.COUNTY);
        
        countyDropdown.value = evt.graphic.attributes.COUNTY;
        setDropdown(municipalityDropdown, evt.graphic.attributes.COUNTY);
        setDropdown(parishDropdown, evt.graphic.attributes.COUNTY);
    });
    on(municipalitiesLayer, "click", function(evt){
        selectRegion(municipalitiesLayer, evt.graphic.attributes.COUNTY, evt.graphic.attributes.MUNICIPALITY);
        
        if(countyDropdown.value != evt.graphic.attributes.COUNTY)
        {
            countyDropdown.value = evt.graphic.attributes.COUNTY;
            setDropdown(municipalityDropdown, evt.graphic.attributes.COUNTY);
            municipalityDropdown.value = evt.graphic.attributes.MUNICIPALITY;
            setDropdown(parishDropdown, evt.graphic.attributes.COUNTY, evt.graphic.attributes.MUNICIPALITY);
            
        }
        else{
            municipalityDropdown.value = evt.graphic.attributes.MUNICIPALITY;
            setDropdown(parishDropdown, evt.graphic.attributes.COUNTY, evt.graphic.attributes.MUNICIPALITY);
        }
        
    });
    on(parishesLayer, "click", function(evt){
        console.log("parish click event: ", evt);
        selectRegion(parishesLayer, evt.graphic.attributes.COUNTY, evt.graphic.attributes.Par_NAME);
        
        if((municipalityDropdown.value != evt.graphic.attributes.MUNICIPALITY) && (countyDropdown.value != evt.graphic.attributes.COUNTY)){
            countyDropdown.value = evt.graphic.attributes.COUNTY;
            setDropdown(municipalityDropdown, evt.graphic.attributes.COUNTY);
            municipalityDropdown.value = evt.graphic.attributes.MUNICIPALITY;
            setDropdown(parishDropdown, evt.graphic.attributes.COUNTY, evt.graphic.attributes.MUNICIPALITY);
            parishDropdown.value = evt.graphic.attributes.Par_NAME;
        }
        else if((municipalityDropdown.value != evt.graphic.attributes.MUNICIPALITY) && (countyDropdown.value == evt.graphic.attributes.COUNTY)){
            municipalityDropdown.value = evt.graphic.attributes.MUNICIPALITY;
            setDropdown(parishDropdown, evt.graphic.attributes.COUNTY, evt.graphic.attributes.MUNICIPALITY);
            parishDropdown.value = evt.graphic.attributes.Par_NAME;
        }
        else{
            parishDropdown.value = evt.graphic.attributes.Par_NAME;
        }
    });
    
    ////////////////////////////FARM SEARCH TOOLS///////////////////////////////

    ///////////////////////////EVENTS/////////////
    dom.byId("legend").style.height = "35%";
    dom.byId("tools").style.height = "50%";
    dom.byId("info").style.height = "25px";
    dom.byId("results").style.height = "25px";
    
    on(dom.byId("toolsHeader"), "click", function(){
        
      if(dom.byId("tools").style.height == "50%"){  
          dom.byId("tools").style.height = "25px";
          dom.byId("toolsMinIcon").style.visibility = "hidden";
          dom.byId("toolsMaxIcon").style.visibility = "visible";
          dom.byId("toolsContent").style.visibility = "hidden";
          
          dom.byId("results").style.bottom = "60px";
      }
      else{
          dom.byId("tools").style.height = "50%";
          dom.byId("toolsMinIcon").style.visibility = "visible";
          dom.byId("toolsMaxIcon").style.visibility = "hidden";
          dom.byId("toolsContent").style.visibility = "visible";
          
          dom.byId("results").style.bottom = "55%";
      }
    });
    
    on(dom.byId("legendHeader"), "click", function(){
        
      if(dom.byId("legend").style.height == "35%"){    
          dom.byId("legend").style.height = "25px";
          dom.byId("legendMinIcon").style.visibility = "hidden";
          dom.byId("legendMaxIcon").style.visibility = "visible";
          dom.byId("legendContent").style.visibility = "hidden";
          dom.byId("legendContentBase").style.visibility = "hidden";
          
          dom.byId("info").style.bottom = "75px";
      }
      else{
          dom.byId("legend").style.height = "35%";
          dom.byId("legendMinIcon").style.visibility = "visible";
          dom.byId("legendMaxIcon").style.visibility = "hidden";
          dom.byId("legendContent").style.visibility = "visible";
          dom.byId("legendContentBase").style.visibility = "visible";
          
          dom.byId("info").style.bottom = "41%";
      }
    });
    
    on(dom.byId("infoHeader"), "click", function(){
        
      if(dom.byId("info").style.height == infoHeight){    
          dom.byId("info").style.height = "25px";
          dom.byId("infoMinIcon").style.visibility = "hidden";
          dom.byId("infoMaxIcon").style.visibility = "visible";
          dom.byId("infoContent").style.visibility = "hidden";
      }
      else{
          dom.byId("info").style.height = infoHeight;
          dom.byId("infoMinIcon").style.visibility = "visible";
          dom.byId("infoMaxIcon").style.visibility = "hidden";
          dom.byId("infoContent").style.visibility = "visible";
      }
    });
    
    on(dom.byId("resultsHeader"), "click", function(){
        
      if(dom.byId("results").style.height == "25px"){    
          dom.byId("results").style.height = "35%";
          dom.byId("resultsMinIcon").style.visibility = "visible";
          dom.byId("resultsMaxIcon").style.visibility = "hidden";
          dom.byId("resultsContent").style.visibility = "visible";
      }
      else{
          dom.byId("results").style.height = "25px";
          dom.byId("resultsMinIcon").style.visibility = "hidden";
          dom.byId("resultsMaxIcon").style.visibility = "visible";
          dom.byId("resultsContent").style.visibility = "hidden";
      }
    });
   
});