var map, mapdata;
require(["dijit/layout/BorderContainer", 
         "dijit/layout/ContentPane",
         "dijit/layout/AccordionContainer",
         "dijit/layout/AccordionPane",
         
         "Modules/MapData",
         
         "dojo/request",
         "dojo/dom-construct",
         "dojo/Deferred",
         "dojo/dom",
         "dojo/on", 
         "dojo/domReady!"],
        function(BorderContainer, ContentPane, AccordionContainer, AccordionPane, mapData, request, domConstruct, Deferred, dom, on){
    
var introduction = "<div id='intro'>Select a county to view all municipal and parish boundaries within"
				+ " its jurisdiction. Parish boundaries from multiple counties can be viewed simultaneously.</div>";

var legend = "<table id='legendStyle'>"
			+ "<tr><td><img src='IMG/County_Legend.jpg' height='12px' width='40px'></td><td>County Boundary</td></tr>"
			+ "<tr><td><img src='IMG/Muni_Legend.jpg' height='12px' width='40px'></td><td>Municipal Boundary</td></tr>"
			+ "<tr><td><img src='IMG/Parish_Legend.jpg' height='12px' width='40px'></td><td>Parish Boundary</td></tr>"
			+ "<tr><td><img src='IMG/Offices_Legend.jpg' height='18px' width='40px'></td><td>National Archives Regional Office</td></tr>"
			+ "</table><i>Click office location to view contact info</i>";
			
var menu = "<div id='centerMenu'>"
			+ "<button id='About' class='menuButton'>About</button>"
			+ "<br><button id='Acknowledgements' class='menuButton'>Acknowledgements</button>"
			+ "<br><button id='Resources' class='menuButton'>Research Helps</button>"
			+ "<br><button id='Contact' class='menuButton'>Contact</button>"
			+ "</div>";			    
/////////////CONTAINER ELEMENTS///////////////////////////////////
var bc = new BorderContainer({
    style: "height: 100%; width: 100%; padding: 0; margin: 0;", 
    gutters: true, 
    liveSplitters: true
});
    
 toolContainer = new AccordionContainer({
  splitter: true,
  region: "left",
  style: "width: 300px; padding: 0; margin: 0;"
});
bc.addChild(toolContainer);
    
selectPane = new AccordionPane({
   title: "Select Parish",
   style: "margin: 0; padding: 0;",    
   content: "<div class='tools'>" + introduction
            + "<br><b>County: </b>"
            + "<select id='countyDropdown'>"
            + "</select><br><br>"
            + "<b>Municipality: </b><select id='MunicipalityDropdown'>"
            + "<option value='null'></option></select><br><br>"
            + "<b>Parish:</b>&nbsp;&nbsp;<select id='ParishDropDown'>"
            + "<option value='null'></option>"
            + "</select>"
            + "<br><br><div id='centerButton'><button id='ClearButton' class='clearButton'>Clear Selection</button>"
            + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='offButton' class='clearButton'>Hide Popup</button></div>"
            + "<br>" + legend
            + "<br><br>" + menu
            + "</div>"
    
});
toolContainer.addChild(selectPane);
    
farmPane = new AccordionPane({
   title: "Select Farm",
   content: "<div class='tools'>Tool Content</div>",
   style: "margin: 0; padding: 0;"    
});
toolContainer.addChild(farmPane);
    
personPane = new AccordionPane({
   title: "Select Person",
   content: "<div class='tools'>Tool Content</div>",
   style: "margin: 0; padding: 0;"    
});
toolContainer.addChild(personPane);

var mapPane = new ContentPane({
  splitter: true,
  region: "center",
  style: "margin: 0; padding:0; overflow: hidden;",
  content: "<div id='map'></div><span id='results'>results content</span>"
});
    
bc.addChild(mapPane);
    
var headerPane = new ContentPane({
  region: "top",
  content: "<div id='header'>Norway's Parishes</div>",
  style: "margin: 0; padding: 0;"
});    
bc.addChild(headerPane);    
    
bc.placeAt(document.body);    
bc.startup();
    
var countyResultsContainer = new AccordionContainer({style: "height: 100%"}, "results");

//var countyOverview = new ContentPane();
//var countyWiki
//var countyFS
//var countyFarms

countyResultsContainer.addChild(new ContentPane({
  title: "Overview",
  content: "<div id='countyOverviewContent'>test content</div>"
}));
countyResultsContainer.addChild(new ContentPane({
  title: "Wikipedia",
  content: "<div id='countyWiki'></div>"
}));
countyResultsContainer.addChild(new ContentPane({
  title: "Family Search Wiki",
  content: "<div id='countyFS'></div>"
}));
countyResultsContainer.addChild(new ContentPane({
  title: "Farm List",
  content: "<div id='countyFarms'></div>"
}));
countyResultsContainer.startup();

////////////////////END CONTAINER ELEMENTS
    
/////////////////////TEST REGION///////////
    
  
// request("http://jyang.esri.com/proxy/proxy.ashx?http://en.wikipedia.org/wiki/Aust-Agder").then(function(data){
    // dom.byId('countyWiki').innerHTML = data;
	// console.log("wiki html: ", data);
                  // }, function(err){
    // console.error("ERROR: ", err);
// }, function(evt){
    // console.log("request evt: ", evt);                        
                            // });
 // $("#countyWiki").load("http://jyang.esri.com/proxy/proxy.ashx?http://en.wikipedia.org/wiki/Aust-Agder");
   
$.ajax({
    url: 'http://jyang.esri.com/proxy/proxy.ashx?http://en.wikipedia.org/wiki/Aust-Agder',
    dataType: 'html',
    success: function(html) {
        var div = $('table', $(html));
        $('#countyWiki').html(div);
    }
});


//////END TEST REGION/////////////////////
    
    
//Set map bounds to keep Norway centered on screen
var southWest = L.latLng(50.4, -4.0);
var northEast = L.latLng(80.0, 45.0);
var bounds = L.latLngBounds(southWest, northEast);    

map = L.map('map', {
center: [64.5,11.0],
zoom: 5,
minZoom: 4,
maxZoom: 18,
maxBounds: bounds    
});
///TILE LAYERS    
//Add ESRI Imagery to map
var satelliteLayer = L.tileLayer.provider('Esri.WorldImagery');
//Add Transportation tiled service to map
var transportationLayer = L.tileLayer.provider('Acetate.roads').setOpacity(0.6);
var OSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
//Add Norgeskart tiled topo service to map
var topoLayer = leafletUtils.SkTiles({layers: "topo2"});
//topoLayer.setZIndex(100);
var europeLayer = leafletUtils.SkTiles({layers: "europa"});
europeLayer.setOpacity(0.5);
var topoBase = L.layerGroup([europeLayer, topoLayer]).addTo(map);
var satelliteTransLayer = L.layerGroup([satelliteLayer, transportationLayer]);

//Set layer styles
var CountyStyle = {
	"color": "#4daf4a",
	"weight": 5,
	"opacity": 1,
	"fillOpacity": 0,
};

var ParishStyle = {
	"color": "#ff7f00",   //#e41a1c
	"weight": 4,
	"opacity": 1,
	"fillOpacity": 0,
};

var MuniStyle = {
	"color": "#377eb8",
	"weight": 5,
	"opacity": 1,
	"fillOpacity": 0
};

var SelectedStyle = {
	"color": "#000000",   //#FFFF00(Yellow)  #00CCFF(light blue)  #ffffb3
	"weight": 10,
	"opacity": 1,
	"fillOpacity": 0.14
};

var OfficeStyle = {
	"radius": 4,
	"fillColor": "800000",
	"weight": 1,
	"color": "#000000",
	"opacity": 1,
	"fillOpacity": 1
};
    
var Counties_layer = L.geoJson(County_data, {
	style: CountyStyle,
	onEachFeature: function(feature, layer){
			var CountyLayer = layer;
			return CountyLayer.bindLabel(feature.properties.COUNTY + " County", {noHide: true});
			}
}).addTo(map);

map.attributionControl.addAttribution("Counties, Municipalities, and Topographic layers provided by <a href='http://statkart.no' title='The National Mapping Authority of Norway'>Kartverket</a>");

////VECTOR LAYERS
var Municipalities_layer = L.layerGroup().addTo(map);
var parishes_layer = L.layerGroup().addTo(map);
var current_selection = L.layerGroup().addTo(map);
var selectedRegion;
var Offices_layer = L.geoJson(NA_Regional_Offices_data, {
	pointToLayer: function(feature, latlng){
			return L.circleMarker(latlng, OfficeStyle).bindLabel(feature.properties.NAME, {noHide: true});
			},
	onEachFeature: onEachOffice
			});    
    
////////////////SET MAP CONTROLS//////////////////////////////////////
    
var NavBar = L.control.navbar({position: 'topleft'});
map.addControl(NavBar);	
	
var osmGeocoder = new L.Control.OSMGeocoder({position: 'topleft'});
map.addControl(osmGeocoder); 
    
var baseLayers = {
	"Satellite Imagery": satelliteTransLayer,
	"Topographic Map": topoBase,
	"Open Street Map": OSM
};

var overlayLayers = {
	"Counties": Counties_layer,
	"Regional Offices": Offices_layer
};

var LayerControl = L.control.layers(baseLayers, overlayLayers, {position: 'topleft'}).addTo(map);    
////////////////END MAP CONTROLS///////////////////////////////////////       
    
mapdata = new mapData();
    
var parishDropdown = document.getElementById('ParishDropDown');    
var municipalityDropdown = document.getElementById('MunicipalityDropdown');
var countyDropdown = document.getElementById('countyDropdown'); 
    
map.on("load", setDropDown(countyDropdown, mapdata.countyList()));
    
console.log("map in initial js: ", map);
    
/////////////////////EVENT HANDLERS/////////////////////////  
on(countyDropdown, "change", function(){
    if(countyDropdown.value == '')
        clearDropdowns();
    var county = mapdata.countySelection(countyDropdown.value);
    loadData(county);
    selectedRegion = mapdata.getIndex(county);
    zoomToRegion(selectedRegion);
});

on(municipalityDropdown, "change", function(){
  var county = mapdata.countySelection(countyDropdown.value);
  var muni_name = municipalityDropdown.value;
  selectedRegion = mapdata.getIndex(county, muni_name, "municipality");
  zoomToRegion(selectedRegion);
  var newParList = mapdata.parishList(county, muni_name);
  setDropDown(parishDropdown, newParList);
});
    
on(parishDropdown, "change", function(){
  var county = mapdata.countySelection(countyDropdown.value);
  var par_name = parishDropdown.value;
  selectedRegion = mapdata.getIndex(county, par_name, "parish");
  zoomToRegion(selectedRegion);
});
///////////////////END EVENT HANDLERS///////////////////////////////
    
///////////////////LABELS//////////////////////////////////////////
    
function labelParishes(feature, layer) 
{
	var labelLayer = layer;
	return labelLayer.bindLabel(feature.properties.Par_NAME + " Parish", {noHide: true});
}

function labelMunicipalities(feature, layer)
{
	var labelLayer = layer;
	return labelLayer.bindLabel(feature.properties.MUNICIPALI + " Municipality", {noHide: true});
}


function onEachOffice(feature, layer)
{
	layer.on({
		click: function(){
		
		var officePopupContent = "<div align='center'><b>" + feature.properties.NAME + " Regional Office<br>of the National Archives</b>"
								+ "<br><img src='" + feature.properties.PHOTO + "' height='113px' width='150px'></div>"
								+ "<br><b>Address: </b>" + feature.properties.ADDRESS
								+ "<br><b>Phone: </b>" + feature.properties.PHONE
								+ "<br><b>Email: </b><a target='_blank' href='mailto:" + feature.properties.EMAIL + "'>" + feature.properties.EMAIL + "</a>";
		
			layer.bindPopup(officePopupContent);
		}
	});
}    
////////////////////END LABEL FUNCTIONS////////////////////////////////////
    
function setDropDown(dropdown, values){ 
    console.log("RESETTING ", dropdown, " DROPDOWN");
//    if((countyDropdown.value == '') && (dropdown != countyDropdown)){
//      parishDropdown.options.length = 0;
//      municipalityDropdown.options.length = 0;
//      return;
//    }
    
    dropdown.options.length = 0;  //reset dropdown options
    var iniOption = document.createElement('option');
	iniOption.text = "";
    if(dropdown == municipalityDropdown)
        iniOption.text = "ALL PARISHES"
    dropdown.add(iniOption);
    
    for(i in values){
      var option = document.createElement('option');
      option.text = values[i];
      dropdown.add(option);
    }
    return mapdata.countySelection(countyDropdown.value);
}
    
//arg must be the index of a county listed in references
function loadData(countyIndex){
    mapdata.references[countyIndex].count++;
    console.log(mapdata.references[countyIndex].name, " Counnty - count: ", mapdata.references[countyIndex].count);
    if(mapdata.references[countyIndex].count == 1){
        //Create parish data script
        var parishDataScript = document.createElement('script');
        parishDataScript.type = 'text/javascript';
        document.body.appendChild(parishDataScript);
        //Create municipal data script
        var muniDataScript = document.createElement('script');
        muniDataScript.type = 'text/javascript';
        document.body.appendChild(muniDataScript);  
      
    on(parishDataScript, "load", function(){
        if(mapdata.references[countyIndex].name == "Akershus"){
            mapdata.references[countyIndex].parish_data = Akershus_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Aust-Agder"){
            mapdata.references[countyIndex].parish_data = Aust_Agder_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Buskerud"){
            mapdata.references[countyIndex].parish_data = Buskerud_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Finnmark"){
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Hedmark"){
            mapdata.references[countyIndex].parish_data = Hedmark_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Hordaland"){
            mapdata.references[countyIndex].parish_data = Hordaland_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Møre og Romsdal"){
            mapdata.references[countyIndex].parish_data = More_og_Romsdal_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Nord-Trøndelag"){
            mapdata.references[countyIndex].parish_data = Nord_Trondelag_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Nordland"){
            mapdata.references[countyIndex].parish_data = Nordland_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Oppland"){
            mapdata.references[countyIndex].parish_data = Oppland_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Oslo"){
            mapdata.references[countyIndex].parish_data = Oslo_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Rogaland"){
            mapdata.references[countyIndex].parish_data = Rogaland_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Sogn og Fjordane"){
            mapdata.references[countyIndex].parish_data = Sogn_og_Fjordane_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Sør-Trøndelag"){
            mapdata.references[countyIndex].parish_data = Sor_Trondelag_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Telemark"){
            mapdata.references[countyIndex].parish_data = Telemark_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Troms"){
            mapdata.references[countyIndex].parish_data = Troms_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Vest-Agder"){
            mapdata.references[countyIndex].parish_data = Vest_Agder_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Vestfold"){
            mapdata.references[countyIndex].parish_data = Vestfold_parishes;
        }
        else if(mapdata.references[countyIndex].name == "Østfold"){
            mapdata.references[countyIndex].parish_data = Ostfold_parishes;
        }
        else {
          console.log("Parish Data Already Loaded. This message shouldn't appear. If it does, something is wrong.");
        }
        
        console.log("New parish data loaded");
        var parishLayer = L.geoJson(mapdata.references[countyIndex].parish_data, {
            style: ParishStyle,
            onEachFeature: labelParishes});         //parishLayer.addTo(map);
        parishes_layer.addLayer(parishLayer);
        LayerControl.addOverlay(parishes_layer, "Parishes");
       // map.fitBounds(parishLayer.getBounds());
        mapdata.references[countyIndex].parishLayer = parishLayer;
        
        setDropDown(parishDropdown, mapdata.parishList(countyIndex));
        });

    on(muniDataScript, "load", function(){
    //  if(mapdata.references[countyIndex].count == 1){
        if(mapdata.references[countyIndex].name == "Akershus"){
            mapdata.references[countyIndex].municipal_data = Akershus_muni; }
        else if(mapdata.references[countyIndex].name == "Aust-Agder"){
            mapdata.references[countyIndex].municipal_data = Aust_Agder_muni; }
        else if(mapdata.references[countyIndex].name == "Buskerud"){
            mapdata.references[countyIndex].municipal_data = Buskerud_muni; }
        else if(mapdata.references[countyIndex].name == "Finnmark"){
            mapdata.references[countyIndex].municipal_data = Finnmark_muni; }
        else if(mapdata.references[countyIndex].name == "Hedmark"){
            mapdata.references[countyIndex].municipal_data = Hedmark_muni; }
        else if(mapdata.references[countyIndex].name == "Hordaland"){
            mapdata.references[countyIndex].municipal_data = Hordaland_muni; }
        else if(mapdata.references[countyIndex].name == "Møre og Romsdal"){
            mapdata.references[countyIndex].municipal_data = More_og_Romsdal_muni; }
        else if(mapdata.references[countyIndex].name == "Nord-Trøndelag"){
            mapdata.references[countyIndex].municipal_data = Nord_Trondelag_muni; }
        else if(mapdata.references[countyIndex].name == "Nordland"){
            mapdata.references[countyIndex].municipal_data = Nordland_muni; }
        else if(mapdata.references[countyIndex].name == "Oppland"){
            mapdata.references[countyIndex].municipal_data = Oppland_muni; }
        else if(mapdata.references[countyIndex].name == "Oslo"){
            mapdata.references[countyIndex].municipal_data = Oslo_muni; }
        else if(mapdata.references[countyIndex].name == "Rogaland"){
            mapdata.references[countyIndex].municipal_data = Rogaland_muni; }
        else if(mapdata.references[countyIndex].name == "Sogn og Fjordane"){
            mapdata.references[countyIndex].municipal_data = Sogn_og_Fjordane_muni; }
        else if(mapdata.references[countyIndex].name == "Sør-Trøndelag"){
            mapdata.references[countyIndex].municipal_data = Sor_Trondelag_muni; }
        else if(mapdata.references[countyIndex].name == "Telemark"){
            mapdata.references[countyIndex].municipal_data = Telemark_muni; }
        else if(mapdata.references[countyIndex].name == "Troms"){
            mapdata.references[countyIndex].municipal_data = Troms_muni; }
        else if(mapdata.references[countyIndex].name == "Vest-Agder"){
            mapdata.references[countyIndex].municipal_data = Vest_Agder_muni; }
        else if(mapdata.references[countyIndex].name == "Vestfold"){
            mapdata.references[countyIndex].municipal_data = Vestfold_muni; }
        else if(mapdata.references[countyIndex].name == "Østfold"){
            mapdata.references[countyIndex].municipal_data = Ostfold_muni; }
        else {
          console.log("Municipal Data Already Loaded. This message shouldn't appear. If it does, something is wrong.");
        }
        
        console.log("New Municipal data loaded");                                                  
        var muniLayer = L.geoJson(mapdata.references[countyIndex].municipal_data, {
            style: MuniStyle,
            onEachFeature: labelMunicipalities});
       // muniLayer.addTo(map);
        Municipalities_layer.addLayer(muniLayer);
        LayerControl.addOverlay(Municipalities_layer, "Municipalities");
        mapdata.references[countyIndex].municipalLayer = muniLayer;
        
        setDropDown(municipalityDropdown, mapdata.municipalityList(countyIndex));
    });
        
    parishDataScript.src = "JS/Parishes/" + mapdata.references[countyIndex].parish_file;
    muniDataScript.src = "JS/Municipalities/" + mapdata.references[countyIndex].municipal_file;
        
    }    //REAL END OF GIANT IF STATEMENT
    else{
        map.fitBounds(mapdata.references[countyIndex].parishLayer.getBounds());
        setDropDown(municipalityDropdown, mapdata.municipalityList(countyIndex));
        setDropDown(parishDropdown, mapdata.parishList(countyIndex));
    }
    return countyIndex;
  }

function zoomToRegion(getIndexResult){
  var cIndex = getIndexResult.countyIndex;
  var rType = getIndexResult.regionType;
  var rName = getIndexResult.regionName;
  var rIndex = getIndexResult.regionNameIndex;
    
  current_selection.clearLayers();
    
  if(rType == "county"){
      for(k=0; k < County_data.features.length; k++){
        if(County_data.features[k].properties.COUNTY == rName){
          rIndex = k;
        }
      }
    selection_layer = L.geoJson(County_data.features[rIndex], {style: SelectedStyle}); 
  }
  if(rType == "municipality"){
    selection_layer = L.geoJson(mapdata.references[cIndex].municipal_data.features[rIndex], {style: SelectedStyle});
  }
  if(rType == "parish"){
    selection_layer = L.geoJson(mapdata.references[cIndex].parish_data.features[rIndex], {style: SelectedStyle});
  }
    
  console.log("Selection Layer: ", selection_layer); 
  current_selection.addLayer(selection_layer);
  map.fitBounds(selection_layer.getBounds());

}    

function clearAll()
{
	dom.byId('results').innerHTML = '';
	dom.byId('results').style.visibility = 'hidden';
    clearDropdowns();

} 
function clearDropdowns(){
    municipalityDropdown.options.length = 0;
    parishDropdown.options.length = 0;
    current_selection.clearLayers();
}
    
});