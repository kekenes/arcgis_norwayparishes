var map;
require([
    "esri/map",
    "esri/SpatialReference",
    "esri/layers/FeatureLayer",
    "esri/layers/WMTSLayer",
    "esri/layers/WMTSLayerInfo",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/LabelLayer",
    "esri/layers/GraphicsLayer",
    "esri/config",
    "esri/dijit/Legend",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/tasks/locator",
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "esri/graphicsUtils",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/Color",
    "esri/dijit/HomeButton",
    "esri/dijit/Scalebar",
    "esri/dijit/OverviewMap",
    "esri/dijit/Search",
    "dojo/i18n!esri/nls/jsapi",
    "esri/renderers/SimpleRenderer",
    
    "agsjs/dijit/TOC",
    "Modules/NorwayPlaces",
    
    "dojo/query",
    "dojo/Deferred",
    "dojo/_base/array",
    "dojo/request",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/on", 
    "dojo/domReady!"],
    function(
        Map,
        SpatialReference,
        FeatureLayer,
        WMTSLayer,
        WMTSLayerInfo,
        ArcGISTiledMapServiceLayer,
        LabelLayer,
        GraphicsLayer,
        esriConfig,
        Legend,
        Query,
        QueryTask,
        Locator,
        GeometryService,
        ProjectParameters,
        graphicsUtils,
        Graphic,
        Point,
        SimpleFillSymbol,
        SimpleLineSymbol,
        SimpleMarkerSymbol,
        TextSymbol,
        Font,
        Color,
        HomeButton,
        Scalebar,
        OverviewMap,
        Search,
        esriBundle,
        SimpleRenderer,
         
        TOC,
        NorwayPlaces,
          
        $,
        Deferred,
        array,
        request, 
        domConstruct, 
        dom, 
        on){
    
  //////////CONFIG SETTINGS AND OPTIONS/////////////////////////////////////////
//  esriConfig.defaults.io.proxyUrl = "/proxy/";
//  esriConfig.defaults.io.proxyUrl = "./proxy/PHP/proxy.php";
    esriConfig.defaults.io.proxyUrl = "./proxy/DotNet/proxy.ashx";
//    $("[data-toggle='tooltip']").tooltip();
    
  ///////////////////LAYERS AND LAYER INFO///////////////////////////////////////
//  var parishSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_FILL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([148,0,211]), 6), new Color([0,0,0,0]));
//  var municipalitySymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_FILL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([217,95,2]), 6), new Color([0,0,0,0]));
//  var countySymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_FILL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,100,0]), 6), new Color([0,0,0,0]));
//    var parishRenderer = new SimpleRenderer(parishSymbol);
//    var municipalityRenderer = new SimpleRenderer(municipalitySymbol);
//    var countyRenderer = new SimpleRenderer(countySymbol);
    
    var selectionLayer = new GraphicsLayer();
    
  //"http://services3.arcgis.com/KXH3vrrQAKwhcniG/ArcGIS/rest/services/Norway_Parishes_4326/FeatureServer/0"    
  var countiesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/ArcGIS/rest/services/Norway_Parishes_4326_2/FeatureServer/0", {
    outFields: ["*"]
  });
   
  //http://services3.arcgis.com/KXH3vrrQAKwhcniG/ArcGIS/rest/services/Norway_Parishes_4326/FeatureServer/1    
  var municipalitiesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/ArcGIS/rest/services/Norway_Parishes_4326_2/FeatureServer/1", {
    outFields: ["*"]
  });
    
  //http://services3.arcgis.com/KXH3vrrQAKwhcniG/ArcGIS/rest/services/Norway_Parishes_4326/FeatureServer/2    
  var parishesLayer = new FeatureLayer("http://services3.arcgis.com/KXH3vrrQAKwhcniG/ArcGIS/rest/services/Norway_Parishes_4326_2/FeatureServer/2", {
    outFields: ["*"]
  });

    //These renderers don't allow for on click events to work on layers
    //May have to republish services
//    countiesLayer.setRenderer(countyRenderer);
//    municipalitiesLayer.setRenderer(municipalityRenderer);
//    parishesLayer.setRenderer(parishRenderer);
    
    var parishFont = new Font("12pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, "Arial");
    var parishText = new TextSymbol("filler text", parishFont, new Color([148,0,211]));
    var parishTextRenderer = new SimpleRenderer(parishText);

//    var parishSatText = new TextSymbol("filler text", parishFont, new Color([0,0,0]));
//    var parishSatRenderer = new SimpleRenderer(parishSatText);
    
  var parishLabels = new LabelLayer({
    mode: "DYNAMIC"
  });
    parishLabels.addFeatureLayer(parishesLayer, parishTextRenderer, "{Par_NAME}");

//  var euroInfo = new WMTSLayerInfo({
//          identifier: "europa",
//          tileMatrixSet: "EPSG:3857",  //3857, 4326, 900913, 32635, 32633, 32632
//          format: "png"
//        });
//  var euroOptions = {
//          serviceMode: "KVP",
//          layerInfo: euroInfo
//        };
        
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
    opacity: 0.9
  });
    
  var topoLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer", {
    opacity: 0.4,
    displayLevels: [1,2,3,4,5,6,7]
  });    
    
  var propertiesLayer = new GraphicsLayer();
  var addressLayer = new GraphicsLayer();

    
  //////////////////////END LAYERS AND LAYER INFO///////////////////////////
    
    /////////////////////////POPUPs///////////////////////////////////  
 var infoHeight = "25px";
    
 function getParishByPoint(point){
    var queryTask = new QueryTask(parishesLayer.url);
    var parishQuery = new Query();
    parishQuery.geometry = point;
    parishQuery.returnGeometry = false;
    parishQuery.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
    queryTask.execute(parishQuery, function(result){
        console.log("getParishByPoint result: ", result);
        var parishName = result.features[0].attributes.Par_NAME;
        
    });
 }
    
 function setFarmInfo(info){
    infoHeight = "30%";
    animateInfoBox(infoHeight);
    var content = "";
    var propName = info.name;
    var county = info.county;
    var municipality = info.municipality;
    var type = info.type;
    var parish;
    var queryTask = new QueryTask(parishesLayer.url);
    var parishQuery = new Query();
    parishQuery.geometry = info.geom;
    parishQuery.returnGeometry = false;
    parishQuery.outFields = ["Par_NAME", "COUNTY", "MUNICIPALITY"];
    parishQuery.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
    queryTask.execute(parishQuery, function(result){
        console.log("getParishByPoint result: ", result);
        parish = result.features[0].attributes.Par_NAME;
        county = result.features[0].attributes.COUNTY;
        municipality = result.features[0].attributes.MUNICIPALITY;
        
        content = "<h4>" + propName + "</h4>"
        + "<i>" + type + "</i><br>"
        + parish + " Parish<br>"
        + municipality + ", " + county + " County<br><br>"
        + "<a href='#'><button type='button' id='addFarmInfo' class='btn btn-primary btn-sm' >View Propety Information</button></a><br>"
        + "<a href='#'><button type='button' id='farmParish' class='btn btn-primary btn-sm' >View " + parish + " Parish Records</button></a><br>";
        
        dom.byId("infoContent").innerHTML = content;
        
        on(dom.byId("farmParish"), "click", function(){
            setAllDropdowns({
                COUNTY: county,
                MUNICIPALITY: municipality,
                Par_NAME: parish
            });
        });
        
        on(dom.byId("addFarmInfo"), "click", function(){
            NorwayPlaces.getFactSheet(info.ssrId);
        });
    });
 }
    
 function setCountyInfo(info){
    infoHeight = "30%";
    animateInfoBox(infoHeight);
    console.log("set county info called: ", info);
    var countyName = info.COUNTY;
    var wikiURL = info.WIKI;
    var FSwiki = info.FS_WIKI;
    var oldName = info.OLD_COUNTY;   //not in FS
    var farmList = info.FARMS;      //not in FS
     
    var content = "<h4>" + countyName + " County</h4>"
    + "Known as <b>" + oldName + "</b> prior to 1919<br><br>"
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
    
 function getFarmList(county){
    var farmList;
    for(i = 0; i < old_county_data.length; i++){
        if(old_county_data[i].name === county){
            farmList = old_county_data[i].farms;
            console.log("FARM LIST FROM OLD COUNTY JSON: ", farmList);
            break;
        }
    }
    return farmList;
 }    
    
 function setParishInfo(info){
    infoHeight = "50%";
    animateInfoBox(infoHeight); 
     
     console.log("counties FARMS: ", countiesLayer);
     
    var parishName = info.Par_NAME;
    var municipalityName = info.MUNICIPALITY;
    var countyName = info.COUNTY;
    var photoURL = info.PHOTO;
    var photoOr = info.PHOTO_O;
    var FSwiki = info.FAM_SEARCH;
    var farmList = getFarmList(countyName);
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
     
     console.log("FARM LINK: ", info.FARMS);
     console.log("GETFARM LIST: ", getFarmList(countyName));
     
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
    + "<div class='photo'><img src='" + photoURL + "' height='" + photoHeight + "' width='" + photoWidth + "'><div class='photoCredit'><a target='_blank' href='http://kirkesok.no'>photo: kirkesok.no</a></div></div>"
    + "<a target='_blank' href='" + FSwiki + "'><button type='button' class='btn btn-primary btn-sm' >Genealogical Resources</button></a><br>"
    + "<a target='_blank' href='" + churchURL + "'><button type='button' class='btn btn-primary btn-sm' >Church History</button></a><br>"
    + "<a target='_blank' href='" + farmList + "'><button type='button' class='btn btn-primary btn-sm' > " + countyName + " County Farm List</button></a><br>"
    + "<b>Search Vital Records</b><br>";
     
     if(da1_url){
        content += "<a target='_blank' href='" + da1_url + "'><button type='button' class='btn btn-success btn-sm'>" + da1_name + "</button></a><br>";
     }
     if(da2_url){
        content += "<a target='_blank' href='" + da2_url + "'><button type='button' class='btn btn-success btn-sm'>" + da2_name + "</button></a><br>";
     }
     if(da3_url){
        content += "<a target='_blank' href='" + da3_url + "'><button type='button' class='btn btn-success btn-sm'>" + da3_name + "</button></a><br>";
     }
     if(da4_url){
        content += "<a target='_blank' href='" + da4_url + "'><button type='button' class='btn btn-success btn-sm'>" + da4_name + "</button></a><br>";
     }
     if(da5_url){
        content += "<a target='_blank' href='" + da5_url + "'><button type='button' class='btn btn-success btn-sm'>" + da5_name + "</button></a>";
     }
     
     dom.byId("infoContent").innerHTML = content;
//     dom.byId("infoContent").style.overflowY = "scroll";
 }
    
    function animateInfoBox(height){
        dom.byId("info").style.visibility = "visible";
        dom.byId("info").style.height = height;
        dom.byId("infoContent").style.visibility = "visible";
    }
    
    ////////////////////////END POPUPS//////////////////////////////////
    
  /////////////////////MAP AND LEGEND///////////////////////////////////////
  var loading = dom.byId("loading");
  on(countiesLayer, "load", initMap);
  var homeButton, scalebar, overviewMap;
  function initMap(){
      
    map = new Map("map", {
      extent: countiesLayer.fullExtent//,
//      basemap: "topo"
    });
      
    homeButton = new HomeButton({
        map: map
    }, "homeButton");
    homeButton.startup();
      
    overviewMap = new OverviewMap({
        map: map,
        attachTo: "top-left",
        baseLayer: topoLayer,
        expandFactor: 3,
        height: 400,
        width: 500
    });
    overviewMap.startup();
      
    console.log("map extent: ", map.extent);
      
    map.addLayer(satelliteLayer); 
    map.addLayer(topoLayer); 
    map.addLayer(norTopoLayer); 
    map.addLayer(streetLayer); 
      
    map.addLayers([selectionLayer, parishesLayer, parishLabels, municipalitiesLayer, countiesLayer, addressLayer, propertiesLayer]);
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
        
      scalebar = new Scalebar({
        map: map,
        attachTo: "bottom-center",
//        scalebarUnit: "dual",
        scalebarStyle: "ruler"
        });
      scalebar.startup();
        
    });
      
  }
   //PLAY WITH THIS FOR A WHILE 
  on(parishLabels, 'graphic-node-add', function (graphic) {
    graphic.node.style.textShadow = "1px 1px 1px white, 1px -1px 1px white, -1px 1px 1px white, -1px -1px 1px white";
  });
    
  on(document.getElementsByName("baseLayers")[1], "click", function(evt){
    if(dom.byId("radioSat").checked){
//        map.setBasemap("satellite");
        satelliteLayer.show();
        topoLayer.hide();
        norTopoLayer.hide();
//        parishLabels.setRenderer(parishSatRenderer);
//        parishLabels.redraw();
    }
  });
    
  on(document.getElementsByName("baseLayers")[0], "click", function(evt){
    if(dom.byId("radioTopo").checked){
//        map.setBasemap("topo");
        satelliteLayer.hide();
        topoLayer.show();
        norTopoLayer.show();
//        parishLabels.setRenderer(parishTextRenderer);
//        parishLabels.redraw();
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
    
  function calcOffset(){
    return (map.extent.getWidth() / map.width);
  }
  
  ////////////////////END MAP AND LEGEND///////////////////////////

    /////////////////////////SEARCH WIDGET////////////////////////////////
    
     esriBundle.widgets.Search.main.placeholder = "Search parish, city, county";
     console.log("esri bundle: ", esriBundle);
    
    var searchSources = [
        {  //COUNTIES LAYER
            featureLayer: countiesLayer,
            autoNavigate: true,
            displayField: "COUNTY",
            enableHighlight: true,
            enableInfoWindow: false,
            maxResults: 5,
            maxSuggestions: 5,
            minCharacters: 1,
            name: "Counties",
            outFields: ["COUNTY"],
            placeholder: "e.g. Aust-Agder",
            searchFields: ["COUNTY"],
            showInfoWindowOnSelect: false
        },
        {  //MUNICIPALITIES LAYER
            featureLayer: municipalitiesLayer,
            autoNavigate: true,
            displayField: "MUNICIPALITY",
            enableHighlight: true,
            enableInfoWindow: false,
            maxResults: 5,
            maxSuggestions: 5,
            minCharacters: 1,
            name: "Municipalities",
            outFields: ["MUNICIPALITY", "COUNTY"],
            placeholder: "e.g. Oslo",
            searchFields: ["MUNICIPALITY", "COUNTY"],
            showInfoWindowOnSelect: false
        },
        {  //PARISHES LAYER
            featureLayer: parishesLayer,
            autoNavigate: true,
            displayField: "Par_NAME",
            enableHighlight: true,
            enableInfoWindow: false,
            maxResults: 5,
            maxSuggestions: 5,
            minCharacters: 1,
            name: "Parishes",
            outFields: ["Par_NAME", "MUNICIPALITY", "COUNTY"],
            placeholder: "e.g. Tvedestrand",
            searchFields: ["Par_NAME", "MUNICIPALITY", "COUNTY"],
            showInfoWindowOnSelect: false
        },
        {  //Geocoder
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
    ];
    
    var search = new Search({
        activeSourceIndex: "all",
        map: map,
//        autoNavigate: false,
        enableButtonMode: false,
//        enableHighlight: false,
        enableInfoWindow: false,
        enableSuggestions: true,
        enableSuggestionsMenu: true,
        expanded: false,
//        graphicsLayer: selectionLayer,
//        highlightSymbol: selectSymbol,
        maxResults: 5,
        maxSuggestions: 5,
        minCharacters: 1,
        showInfoWindowOnSelect: false,
        sources: searchSources
    }, "searchWidget");
    search.startup();
    
    on(search, "select-result", function(evt){
        addressLayer.clear();
        var inExtent = null;
        console.log("Locator search result: ", evt);
        console.log("countiesLayer: ", countiesLayer);
        var geomType = evt.result.feature.geometry.type;
        if(geomType === "point")
            inExtent = NorwayPlaces.withinExtent(evt.result.feature.geometry, countiesLayer.fullExtent);
        
        if(geomType === "point" && inExtent){
            var queryTask = new QueryTask(parishesLayer.url);
            var searchQuery = new Query();
            searchQuery.geometry = evt.result.feature.geometry;
            searchQuery.returnGeometry = false;
            searchQuery.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
            searchQuery.outFields = ["Par_NAME", "COUNTY", "MUNICIPALITY"];
            queryTask.execute(searchQuery, function(queryResult){
                console.log("search query result after LOCATOR: ", queryResult);
                setAllDropdowns(queryResult.features[0].attributes);
                addressLayer.add(new Graphic(searchQuery.geometry, new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE, 15, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 1), new Color([52,250,237])
                )));
            });
        }
        else{
            if(!inExtent)
                return;
            if(geomType != "point")
                setAllDropdowns(evt.result.feature.attributes);
        }
    });
    
    on(search, "clear-search", function(evt){
        addressLayer.clear();
    });
    
    /////////////////////////END SEARCH WIDGET//////////////////////////////  
    
/////////////////////////TOOLS - DROPDOWN SETUP//////////////////////////////
    
    var countyDropdown = dom.byId("countyDropdown");
    var municipalityDropdown = dom.byId("municipalityDropdown");
    var parishDropdown = dom.byId("parishDropdown");
    
    function setDropdown(dropdown, county, municipality){
        var dfd = new Deferred();
        loading.style.visibility = "visible";
        
        console.log("set dropdown: ", dropdown, " county dropdown: ", countyDropdown);
        var dropQuery = new Query();
        var dropQueryTask = new QueryTask();
        var selectLayer, attribute;
        
        dropQuery.outFields = [ "COUNTY" , "MUNICIPALITY" , "Par_NAME" ];
        dropQuery.returnGeometry = false;
    
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
                
                if(i === (options.length - 1)){
                    loading.style.visibility = "hidden";
                    dfd.resolve(true);
                }
            });
            
            console.log("list: ", options);
        });
        return dfd.promise;
    }
    
    on(countiesLayer, "load", function(){
        console.log("on counties layer load.");
        setDropdown(countyDropdown);
    });
    
    on(countyDropdown, "change", function(evt){
        if(evt.target.value === ""){
           clearSelection();
           map.setExtent(homeButton.extent);
           return;
        }
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
    
    function setAllDropdowns(selectAtt){
        
        if(selectAtt.COUNTY && !selectAtt.MUNICIPALITY){
            selectRegion(countiesLayer, selectAtt.COUNTY);
            
            countyDropdown.value = selectAtt.COUNTY;
            setDropdown(municipalityDropdown, selectAtt.COUNTY);
            setDropdown(parishDropdown, selectAtt.COUNTY);
        }
        if(selectAtt.MUNICIPALITY && !selectAtt.Par_NAME){
            selectRegion(municipalitiesLayer, selectAtt.COUNTY, selectAtt.MUNICIPALITY);
            
            if(countyDropdown.value != selectAtt.COUNTY)
            {
                countyDropdown.value = selectAtt.COUNTY;
                setDropdown(municipalityDropdown, selectAtt.COUNTY).then(function(resolved){
                    if(resolved){
                        municipalityDropdown.value = selectAtt.MUNICIPALITY;
                        setDropdown(parishDropdown, selectAtt.COUNTY, selectAtt.MUNICIPALITY);
                    }
                    else
                        consle.error("Municipality dropdown not set! Promise needs to resolve.");
                });            
            }
            else{
                municipalityDropdown.value = selectAtt.MUNICIPALITY;
                setDropdown(parishDropdown, selectAtt.COUNTY, selectAtt.MUNICIPALITY);
            }
        }
        if(selectAtt.Par_NAME){
            selectRegion(parishesLayer, selectAtt.COUNTY, selectAtt.Par_NAME);
            
            if((municipalityDropdown.value != selectAtt.MUNICIPALITY) && (countyDropdown.value != selectAtt.COUNTY)){
                countyDropdown.value = selectAtt.COUNTY;
                setDropdown(municipalityDropdown, selectAtt.COUNTY).then(function(resolved){
                    if(resolved){
                        municipalityDropdown.value = selectAtt.MUNICIPALITY;
                        return setDropdown(parishDropdown, selectAtt.COUNTY, selectAtt.MUNICIPALITY);
                    }
                    else
                        consle.error("Municipality dropdown not set! Promise needs to resolve.");
                }).then(function(resolved){
                    if(resolved)
                        parishDropdown.value = selectAtt.Par_NAME;
                });         
            }
            else if((municipalityDropdown.value != selectAtt.MUNICIPALITY) && (countyDropdown.value == selectAtt.COUNTY)){
                municipalityDropdown.value = selectAtt.MUNICIPALITY;
                setDropdown(parishDropdown, selectAtt.COUNTY, selectAtt.MUNICIPALITY, selectAtt.Par_NAME).then(function(resolve){
                    parishDropdown.value = selectAtt.Par_NAME;
                });
            }
            else{
                parishDropdown.value = selectAtt.Par_NAME;
            }
        }
    }
    
    //////////////////////////SELECT REGIONS AND ZOOM////////////////////
    var selectSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 6), new Color([0,0,0,0.25]));
    
    function selectRegion(layer, county, name){
        var queryTask = new QueryTask(layer.url);

        var selectQuery = new Query();
        selectQuery.returnGeometry = true;
        selectQuery.outFields = ["*"];
        
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
        console.log("layer: ", layer);
        queryTask.execute(selectQuery, zoomTo);
    }
    
    function zoomTo(result){
        var selectedGeom = result.features[0].geometry;
        console.log("query task result: ", result);
        selectionLayer.clear();
        selectionLayer.add(new Graphic(selectedGeom, selectSymbol));
        var extent = graphicsUtils.graphicsExtent(result.features);
        map.setExtent(extent, true);
        console.log("zoom to result: ", result);
        var selectionInfo = result.features[0].attributes;
        
        //set content here!!!!!!!!!!!!!!!!!!!!!!!
        if(selectionInfo.COUNTY && !selectionInfo.MUNICIPALITY)
            setCountyInfo(selectionInfo);
        if(selectionInfo.MUNICIPALITY && !selectionInfo.Par_NAME)
            setMunicipalityInfo(selectionInfo);
        if(selectionInfo.Par_NAME)
            setParishInfo(selectionInfo);
    }
    
    on(countiesLayer, "click", function(evt){
        console.log("counties clicked!!!!!!!!!!!!");
        selectRegion(countiesLayer, evt.graphic.attributes.COUNTY);
        
        countyDropdown.value = evt.graphic.attributes.COUNTY;
        setDropdown(municipalityDropdown, evt.graphic.attributes.COUNTY);
        setDropdown(parishDropdown, evt.graphic.attributes.COUNTY);
    });
    on(municipalitiesLayer, "click", function(evt){
        console.log("munis clicked!!!!!!!!!!!!");
        setAllDropdowns(evt.graphic.attributes);
    });
    on(parishesLayer, "click", function(evt){
        console.log("parish click event: ", evt);
        setAllDropdowns(evt.graphic.attributes);
    });
    
    function clearSelection(){
        selectionLayer.clear();
        addressLayer.clear();
//        dom.byId("info").style.height = "25px";
        dom.byId("info").style.visibility = "hidden";
//        dom.byId("infoMinIcon").style.visibility = "hidden";
//        dom.byId("infoMaxIcon").style.visibility = "visible";
//        dom.byId("infoContent").style.visibility = "hidden";
        municipalityDropdown.length = 0;
        parishDropdown.length = 0;
        countyDropdown.value = "";
    }
    
    on(dom.byId('clearBtn'), "click", clearSelection);
    
    ////////////////////////////FARM SEARCH TOOLS///////////////////////////////

    NorwayPlaces.test();
                                                                                                                                                                    //145 100 15
    var farmSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 2), new Color([255,255,0]));
    var farmHighlightSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 24, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 2), new Color([255,0,0]));
    
    var placeSearchBtn = dom.byId("farmSearchBtn");
    var placeGeoCheckBox = dom.byId("useGeoSelection");
    var propName;
    
    on(placeSearchBtn, "click", function(){
        loading.style.visibility = "visible";
        propName = dom.byId("propTextBox").value;
        var geoFilter = null;
        
        if(propName.length < 1){
            alert("You must enter a property name to perform this operation.");
            loading.style.visibility = "hidden";
            return;
        }
        
        if(placeGeoCheckBox.checked && selectionLayer.graphics.length > 0)
            geoFilter = selectionLayer.graphics[0].geometry;
        
        NorwayPlaces.search(propName, geoFilter).then(function(properties){
            
            console.log("response layer: ", properties);
//            map.addLayer(responseLyr);
            
            dom.byId("results").style.height = "30%";
            dom.byId("results").style.visibility = "visible";
            dom.byId("resultsMinIcon").style.visibility = "visible";
            
//            var resultFeatures = responseLyr.graphics;
            
            return properties;
//            showSearchResults(responseLyr.graphics);
        }, function(rejected){
            console.log("search rejected!");
            loading.style.visibility = "hidden";
        }).then(showSearchResults, function(rejected){
            console.log("Rejected. Don't show results.");
        });
//        .then(addFeaturesToMap);  //hardcode for testing purposes
    });
    
    function showSearchResults(response){
        console.log("show search results called: ", response);
        propertiesLayer.clear();
        
        var noResultMessage = "<p><i>No properties could be identified by the name: <b>" + propName + "</b></i>. The following"
                    + " are suggestions for improving your search:</p><ol>"
                    + "<li>Check the spelling of the search entry to ensure it is correct, including the usage of Norwegain characters (&aelig;, &oslash;, &aring;). "
                    + "If necessary, <a target='_blank' href='https://familysearch.org/learn/wiki/en/Norway:_Typing_%C3%86,_%C3%98,_and_%C3%85'>"
                    + "activate the Norwegian keyboard</a> on your computer.</li><br>"
                    + "<li>If searching for farms, use <a target='_blank' href='http://www.dokpro.uio.no/rygh_ng/rygh_form.html'>Oluf Rygh's Farm Gazetteer</a>"
                    + " to find alternate spellings of the desired farm name.</li><br>"
                    + "<li>If necessary, uncheck the checkbox to remove geographic filtering to broaden the search.</li></ol>";
        
        if((response === 0) || (response.length === 0)){
            dom.byId("resultsContent").innerHTML = noResultMessage + "<div class='clearBtnCenter'><button onclick='clearPropSearch()' type='button' class='btn btn-default btn-sm'>Clear Search Results</button></div>";
            loading.style.visibility = "hidden";
            return;
        }
        
        dom.byId("resultsContent").innerHTML = "<span style='padding-left:25%'><b>" + response.length + "</b> properties found</span>"
            + "<ul class='list-group'>";
             
        array.forEach(response, function(item, i){
            console.log("show search results: ", i, ".) ", item);
            var id = item.ssrId;
            dom.byId("resultsContent").innerHTML += "<a href='#' onmouseout='removeHighlightProperty(" + id + ");' onmouseover='highlightProperty(" + id + ");' onclick='selectProperty(" + id + ");' class='list-group-item' id='" + id + "'>"
            + "<b>" + item.name + "</b><br>"
            + "<span style='padding: 15px;'><i>" + item.type + "</i></span><br>"
            + "<span style='padding: 15px;'>" + item.municipality + ", " + item.county + "</span>"
            + "</a>";
            
            var propFeature = new Graphic(item.geom, farmSymbol, item);
            console.log("new graphic: ", propFeature);
            propertiesLayer.add(propFeature);
        });
        dom.byId("resultsContent").innerHTML += "<div class='clearBtnCenter'><button onclick='clearPropSearch()' type='button' class='btn btn-default btn-sm'>Clear Search Results</button></div>";
        console.log("PROPERTIES LAYER GRAPHICS: ", propertiesLayer);
        map.setExtent(graphicsUtils.graphicsExtent(propertiesLayer.graphics), true);
        
        dom.byId("resultsContent").innerHTML += "</ul>";
        loading.style.visibility = "hidden";
        
        return response;
    }
    
    window.clearPropSearch = function (){
        dom.byId("resultsContent").innerHTML = "";
        dom.byId("results").style.visibility = "hidden";
//        dom.byId("resultsMaxIcon").style.visibility = "hidden";
        dom.byId("resultsMinIcon").style.visibility = "hidden";
        propertiesLayer.clear();
        dom.byId("propTextBox").value = "";
    }
//    
//    function addFeaturesToMap(items){
////        console.log("add features to map called: ", response);
//        
//        NorwayPlaces.getLayer(items).then(function(layer){
////            map.addLayer(layer);
//            var featureExtent = graphicsUtils.graphicsExtent(layer.graphics);
//            console.log("feature extent: ", featureExtent);
//            console.log("layer graphics: ", layer.graphics);
//            map.setExtent(featureExtent);
//        });
        //project points in here and add to map
        //zoom to extent of all features
        
//        var dfd = new Deferred();
        
        
//            var pointSymbol = new SimpleMarkerSymbol(SimpleLineSymbol.STYLE_CIRCLE, 7, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("red"), 0.5), new Color([0,255,0,1]));
//            var propLayer = new GraphicsLayer();
//        
//            var geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
//            var projectParams = new ProjectParameters();
//            projectParams.outSR = new SpatialReference({wkid: 3857});
//    
//            array.forEach(items, function(item, i){
//                var geom = new Point([item.x,item.y], new SpatialReference({wkid: item.wkid}));
//                var projGeom;
//                console.log("geometry: ", geom);
//                
//                projectParams.geometries = [geom];
//                geometryService.project(projectParams, function(result){
////                    var pointSymbol = new SimpleMarkerSymbol(SimpleLineSymbol.STYLE_CIRCLE, 7, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("red"), 0.5), new Color([0,255,0,1]));
//                    console.log("projection result: ", result);
//                    projGeom = result[0];
//                    
//                    var feature = new Graphic(projGeom, pointSymbol, item);
//                    propLayer.add(feature);
////                        features.push(feature);
//                });
//                
////                if(items.length === (i - 1)){
//////                    dfd.resolve(propLayer);
////                    map.addLayer(propLayer);
////                }
//            });
            
    
            

            
//                    console.log("feature: ", feature);
            

//         map.addLayer(propLayer);   
//            return dfd.promise;
//    }
    
    on(propertiesLayer, "click", function(evt){
        console.log("property: ", evt);
        selectProperty(evt.graphic.attributes.ssrId);
    });
    
    window.highlightProperty = function(propId){
        var propLayer = map.getLayer(map.graphicsLayerIds[map.graphicsLayerIds.length-1]);
//        var propLayer = map.getLayer("graphicsLayer9");
        var propFeatures = propLayer.graphics;
        
        array.forEach(propFeatures, function(item, i){
            if(item.attributes.ssrId === propId){
                console.log("A MATCH!", item);
                item.setSymbol(farmHighlightSymbol);
            }
        });
    };
    
    window.removeHighlightProperty = function(propId){
        var propLayer = map.getLayer(map.graphicsLayerIds[map.graphicsLayerIds.length-1]);
//        var propLayer = map.getLayer("graphicsLayer9");
        var propFeatures = propLayer.graphics;
        
        array.forEach(propFeatures, function(item, i){
            if(item.attributes.ssrId === propId){
                console.log("A MATCH!", item);
                item.setSymbol(farmSymbol);
            }
        });
    };
    
    window.selectProperty = function (propId){
        console.log("select property: ", propId);
        console.log("map layers: ", map.graphicsLayerIds);
        console.log("property layer???: ", map.getLayer("graphicsLayer9"));
        
        var propLayer = map.getLayer(map.graphicsLayerIds[map.graphicsLayerIds.length-1]);
//        var propLayer = map.getLayer("graphicsLayer9");
        var propFeatures = propLayer.graphics;
        
        array.forEach(propFeatures, function(item, i){
            if(item.attributes.ssrId === propId){
                console.log("A MATCH!", item);
                map.centerAndZoom(item.attributes.geom, 18);
                //SET GEOGRAPHIC INFO BOX HERE
                setFarmInfo(item.attributes);
            }
        });
    };
    
    ///////////////////////////LAYOUT EVENTS//////////////////////////////////
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
//          dom.byId("tools").style.overflowY = "initial";
          
          dom.byId("results").style.bottom = "60px";
      }
      else{
          dom.byId("tools").style.height = "50%";
          dom.byId("toolsMinIcon").style.visibility = "visible";
          dom.byId("toolsMaxIcon").style.visibility = "hidden";
          dom.byId("toolsContent").style.visibility = "visible";
//          dom.byId("tools").style.overflowY = "auto";
          
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
//          dom.byId("legend").style.overflowY = "initial";
          
          dom.byId("info").style.bottom = "75px";
      }
      else{
          dom.byId("legend").style.height = "35%";
          dom.byId("legendMinIcon").style.visibility = "visible";
          dom.byId("legendMaxIcon").style.visibility = "hidden";
          dom.byId("legendContent").style.visibility = "visible";
          dom.byId("legendContentBase").style.visibility = "visible";
//          dom.byId("legend").style.overflowY = "auto";
          
          dom.byId("info").style.bottom = "41%";
      }
    });
    
    on(dom.byId("infoHeader"), "click", function(){
        
      if(dom.byId("info").style.height == infoHeight){    
          dom.byId("info").style.height = "25px";
          dom.byId("infoMinIcon").style.visibility = "hidden";
          dom.byId("infoMaxIcon").style.visibility = "visible";
          dom.byId("infoContent").style.visibility = "hidden";
//          dom.byId("info").style.overflow = "initial";
      }
      else{
          dom.byId("info").style.height = infoHeight;
          dom.byId("infoMinIcon").style.visibility = "visible";
          dom.byId("infoMaxIcon").style.visibility = "hidden";
          dom.byId("infoContent").style.visibility = "visible";
//          dom.byId("info").style.overflowY = "auto";
      }
    });
    
    on(dom.byId("resultsHeader"), "click", function(){
        
      if(dom.byId("results").style.height == "25px"){    
          dom.byId("results").style.height = "30%";
          dom.byId("resultsMinIcon").style.visibility = "visible";
          dom.byId("resultsMaxIcon").style.visibility = "hidden";
          dom.byId("resultsContent").style.visibility = "visible";
//          dom.byId("results").style.overflowY = "auto";
      }
      else{
          dom.byId("results").style.height = "25px";
          dom.byId("resultsMinIcon").style.visibility = "hidden";
          dom.byId("resultsMaxIcon").style.visibility = "visible";
          dom.byId("resultsContent").style.visibility = "hidden";
//          dom.byId("results").style.overflowY = "initial";
      }
    });
   
});