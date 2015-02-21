require(["dijit/layout/BorderContainer", 
         "dijit/layout/ContentPane",
         "dijit/layout/AccordionContainer",
         "dijit/layout/AccordionPane",
         
         "Modules/MapData",
         "dojo/dom-construct", 
         "dojo/on", 
         "dojo/domReady!"],
        function(BorderContainer, ContentPane, AccordionContainer, AccordionPane, mapData, domConstruct, on){
    
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
								+ "<option value='null' selected></option>"
								+ "</select><br><br>"
								+ "<b>Municipality: </b><select id='MunicipalityDropdown'>"
								+ "<option value='null'></option></select><br><br>"
								+ "<b>Parish:</b>&nbsp;&nbsp;<select id='ParishDropDown'>"
								+ "<option value='null'></option>"
								+ "</select>"
								+ "<br><br><div id='centerButton'><button id='ClearButton' class='clearButton'>Clear Selection</button>"
								+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='offButton' class='clearButton'>Hide Popup</button></div>"
								+ "<br>" + legend
								/*+ "<br><b>Labels:</b>"
								+ "<br><input type='checkbox' id='countyLabels'> Counties&nbsp;&nbsp;"
								+ "<input type='checkbox' id='MunicipalityLabels'> Municipalities&nbsp;&nbsp;"
								+ "<input type='checkbox' id='ParishLabels'> Parishes"*/
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
//var norwayCountiesLayerURL = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/0";
//var norwayMuniLayerURL = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/1";
//var norwayParishesURL = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/2";
    

//Set map bounds to keep Norway centered on screen
var southWest = L.latLng(50.4, -4.0);
var northEast = L.latLng(80.0, 45.0);
var bounds = L.latLngBounds(southWest, northEast);    

var map = L.map('map', {
center: [64.5,11.0],
zoom: 5,
minZoom: 4,
maxZoom: 18,
maxBounds: bounds    
});
    
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


var Municipalities_layer = L.layerGroup().addTo(map);
var parishes_layer = L.layerGroup().addTo(map);
    
var mapdata = new mapData();
    
    console.log("map data: ", mapdata.references);
    console.log("county list: ", mapdata.countyList());
    
var parishDropdown = document.getElementById('ParishDropDown');    
var municipalityDropdown = document.getElementById('MunicipalityDropdown');
var countyDropdown = document.getElementById('countyDropdown'); 
    
map.on("load", setDropDown(countyDropdown, mapdata.countyList()));
    
console.log("map in initial js: ", map);

on(countyDropdown, "change", function(){
   console.log("dropdown selection: ", countyDropdown.value);
   var index = mapdata.countySelection(countyDropdown.value);
   console.log("index: ", index, typeof index);
   loadData(Number(index));
});
    
function setDropDown(dropdown, values){
    
    if((countyDropdown.value == 'null') && (dropdown != countyDropdown)){
      parishDropdown.options.length = 0;
      municipalityDropdown.options.length = 0;
      return;
    }
    
    dropdown.options.length = 0;
    var iniOption = document.createElement('option');
	iniOption.text = "";
    if(dropdown != countyDropdown)
	  dropdown.add(iniOption);
    
    for(i in values){
      var option = document.createElement('option');
      option.text = values[i];
      dropdown.add(option);
    }
}
//CONTINUE BY FIXING UP THIS SECTION!!!!!!!!!!!!!!!!!!!!!!!    
//arg must be the index of a county listed in references
function loadData(countyIndex){
    mapdata.references[countyIndex].count++;

    var dataScript = document.createElement('script');
    dataScript.type = 'text/javascript';
    document.body.appendChild(dataScript);
    console.log(mapdata.references[countyIndex].name, " count = ", mapdata.references[countyIndex].count, " datascript: ", dataScript);
      
    on(dataScript, "load", function(){
    if(mapdata.references[countyIndex].count == 1){
        if(mapdata.references[countyIndex].name == "Akershus")
            mapdata.references[countyIndex].parish_data = Akershus_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
        else if(mapdata.references[countyIndex].name == "Finnmark")
            mapdata.references[countyIndex].parish_data = Finnmark_parishes;
    }

    var parishLayer = L.geoJson(mapdata.references[countyIndex].parish_data, {style: ParishStyle});
        
    if(mapdata.references[countyIndex].count == 1)
    {
        parishLayer.addTo(map);
        parishes_layer.addLayer(parishLayer);
    }
    map.fitBounds(parishLayer.getBounds());
    });
    dataScript.src = "JS/Parishes/" + mapdata.references[countyIndex].parish_file;
        
  }    
    
});