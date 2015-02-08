require([
"dijit/layout/BorderContainer", "dijit/layout/ContentPane",
"dojo/store/util/SimpleQueryEngine", "dijit/form/Select", 
"dojo/dom-construct", "dojo/on", "dojo/dom", "dojo/domReady!"
],
function(BorderContainer, ContentPane, SimpleQueryEngine, Select, domConstruct, on, dom){

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
			
/*var menu2 = "<table id='newMenu'><tr><td><h1>Norway's Parishes</h1></td>"
			+ "<td><button id='About' class='menuButton'>About</button></td>"
			+ "<td><button id='Acknowledgements' class='menuButton'>Acknowledgements</button></td>"
			+ "<td><button id='Resources' class='menuButton'>Research Helps</button></td>"
			+ "<td><button id='Contact' class='menuButton'>Contact</button></td>"
			+ "</tr></table>";	*/		

var bc = new BorderContainer({style: "height: 100%; width: 100%"});
/*var topPane = new ContentPane({region: "top", style: "width: 100%; border-style: ridge"
								+ "border-width: 4px; border-color: #7A2900;"
								+ "background-color:#FFE6B2;",
								content: menu2});*/
var leftPane = new ContentPane ({region: "left", style: "width: 300px; border-style: ridge;"
								+ "border-width: 4px; border-color: #7A2900;"
								+ "background-color:#FFE6B2;",
								content: "<div id='leftPanel'><h1>Norway's Parishes</h1>"
								+ introduction
								+ "<br><b>County: </b>"
								+ "<select id='CountyDropDown'>"
								+ "<option value='null' selected></option>"
								+ "<option value='Akershus'>Akershus</option>"
								+ "<option value='Aust-Agder'>Aust-Agder</option>"
								+ "<option value='Buskerud'>Buskerud</option>"
								+ "<option value='Finnmark'>Finnmark</option>"
								+ "<option value='Hedmark'>Hedmark</option>"
								+ "<option value='Hordaland'>Hordaland</option>"
								+ "<option value='Møre og Romsdal'>M&oslash;re og Romsdal</option>"
								+ "<option value='Nord-Trøndelag'>Nord-Tr&oslash;ndelag</option>"
								+ "<option value='Nordland'>Nordland</option>"
								+ "<option value='Oppland'>Oppland</option>"
								+ "<option value='Oslo'>Oslo</option>"
								+ "<option value='Rogaland'>Rogaland</option>"
								+ "<option value='Sogn og Fjordane'>Sogn og Fjordane</option>"
								+ "<option value='Sør-Trøndelag'>S&oslash;r-Tr&oslash;ndelag</option>"
								+ "<option value='Telemark'>Telemark</option>"
								+ "<option value='Troms'>Troms</option>"
								+ "<option value='Vest-Agder'>Vest-Agder</option>"
								+ "<option value='Vestfold'>Vestfold</option>"
								+ "<option value='Østfold'>&Oslash;stfold</option>"
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

bc.addChild(leftPane);
var centerPane = new ContentPane ({region: "center", content: "<div id='map'></div><span id='results'></span>"});
bc.addChild(centerPane);
//bc.addChild(topPane);

bc.placeAt(document.body);
bc.startup();

//Set map bounds to keep Norway centered on screen
var southWest = L.latLng(50.4, -4.0);
var northEast = L.latLng(80.0, 45.0);
var bounds = L.latLngBounds(southWest, northEast);

//Set up Map
var map = L.map('map', {
center: [64.5,11.0],
zoom: 5,
minZoom: 4,
maxZoom: 18,
maxBounds: bounds,
//crs: L.CRS.SRID4326
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

var Offices_layer = L.geoJson(NA_Regional_Offices_data, {
	pointToLayer: function(feature, latlng){
			return L.circleMarker(latlng, OfficeStyle).bindLabel(feature.properties.NAME, {noHide: true});
			},
	onEachFeature: onEachOffice
			});

var loaded = 0;
var AkershusCount = 0, Aust_AgderCount = 0, BuskerudCount = 0, FinnmarkCount = 0, HedmarkCount = 0,
	HordalandCount = 0, More_og_RomsdalCount = 0, Nord_TrondelagCount = 0, NordlandCount = 0,
	OpplandCount = 0, OsloCount = 0, RogalandCount = 0, Sogn_og_FjordaneCount = 0, TromsCount = 0,
	Sor_TrondelagCount = 0, TelemarkCount = 0, Vest_AgderCount = 0, VestfoldCount = 0, OstfoldCount = 0;

var NavBar = L.control.navbar({position: 'topleft'});
map.addControl(NavBar);	
	
var osmGeocoder = new L.Control.OSMGeocoder({position: 'topleft'});
map.addControl(osmGeocoder);	

var co_data_properties;  //Global variable to store attribute data for counties	
var parish_data_properties = "";  //Global variable to store attribute data for parishes
var municipality_data_properties = "";

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

function loadJSfile()
{
	var psrc = '';
	var msrc = '';
	
	if(map.hasLayer(parishes_layer)== false)
		parishes_layer.addTo(map);
	if(map.hasLayer(Municipalities_layer) == false)
		Municipalities_layer.addTo(map);
			
	if(dom.byId('CountyDropDown').value == 'Akershus')
	{
		++AkershusCount;
		psrc = 'JS/Parishes/Akershus.js';

		var AkershusData = document.createElement('script');
		AkershusData.type = 'text/javascript';
		
		document.body.appendChild(AkershusData);

		console.log(AkershusCount);
		
		AkershusData.onload = function(){
		
		var Akershus_parish_layer = L.geoJson(Akershus_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Akershus_parishes;
		if(AkershusCount == 1)
		{		
			Akershus_parish_layer.addTo(map);	
			parishes_layer.addLayer(Akershus_parish_layer);	
		}
		
			
		setParishDropdown();    //Populate Parish dropdown list
		
		}
		
		AkershusData.src = psrc;	

		//Municipality JS file
		msrc = 'JS/Municipalities/Akershus.js';

		var AkershusMuniData = document.createElement('script');
		AkershusMuniData.type = 'text/javascript';

		document.body.appendChild(AkershusMuniData);
		
		AkershusMuniData.onload = function(){
		
		var Akershus_muni_layer = L.geoJson(Akershus_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Akershus_muni;
		if(AkershusCount == 1)
		{		
			Akershus_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Akershus_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		AkershusMuniData.src = msrc;

	}
	if(dom.byId('CountyDropDown').value == 'Aust-Agder')
	{
		++Aust_AgderCount;
		psrc = 'JS/Parishes/Aust_Agder.js';
		
		var Aust_AgderData = document.createElement('script');
		Aust_AgderData.type = 'text/javascript';

		document.body.appendChild(Aust_AgderData);

		console.log(Aust_AgderCount);
		
		Aust_AgderData.onload = function(){
		var Aust_Agder_parish_layer = L.geoJson(Aust_Agder_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Aust_Agder_parishes;

		if(Aust_AgderCount == 1)
		{		
			Aust_Agder_parish_layer.addTo(map);
			parishes_layer.addLayer(Aust_Agder_parish_layer);
		}
		map.fitBounds(Aust_Agder_parish_layer.getBounds());		
		
		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		Aust_AgderData.src = psrc;
		
				//Municipality JS file
		msrc = 'JS/Municipalities/Aust_Agder.js';

		var Aust_AgderMuniData = document.createElement('script');
		Aust_AgderMuniData.type = 'text/javascript';

		document.body.appendChild(Aust_AgderMuniData);
		
		Aust_AgderMuniData.onload = function(){
		
		var Aust_Agder_muni_layer = L.geoJson(Aust_Agder_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Aust_Agder_muni;
		if(Aust_AgderCount == 1)
		{		
			Aust_Agder_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Aust_Agder_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		Aust_AgderMuniData.src = msrc;
	}
	if(dom.byId('CountyDropDown').value == 'Buskerud')
	{
		++BuskerudCount;
		psrc = 'JS/Parishes/Buskerud.js';
		
		var BuskerudData = document.createElement('script');
		BuskerudData.type = 'text/javascript';

		document.body.appendChild(BuskerudData);

		console.log(BuskerudCount);
		
		BuskerudData.onload = function(){
		var Buskerud_parish_layer = L.geoJson(Buskerud_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Buskerud_parishes;		

		if(BuskerudCount == 1)
		{
			Buskerud_parish_layer.addTo(map);
			parishes_layer.addLayer(Buskerud_parish_layer);	
		}
		map.fitBounds(Buskerud_parish_layer.getBounds());		

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		BuskerudData.src = psrc;

				//Municipality JS file
		msrc = 'JS/Municipalities/Buskerud.js';

		var BuskerudMuniData = document.createElement('script');
		BuskerudMuniData.type = 'text/javascript';

		document.body.appendChild(BuskerudMuniData);
		
		BuskerudMuniData.onload = function(){
		
		var Buskerud_muni_layer = L.geoJson(Buskerud_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Buskerud_muni;
		if(BuskerudCount == 1)
		{		
			Buskerud_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Buskerud_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		BuskerudMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Finnmark')
	{
		++FinnmarkCount;
		psrc = 'JS/Parishes/Finnmark.js';
		
		var FinnmarkData = document.createElement('script');
		FinnmarkData.type = 'text/javascript';

		document.body.appendChild(FinnmarkData);

		console.log(FinnmarkCount);
		
		FinnmarkData.onload = function(){
		var Finnmark_parish_layer = L.geoJson(Finnmark_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Finnmark_parishes;		

		if(FinnmarkCount == 1)
		{		
			Finnmark_parish_layer.addTo(map);
			parishes_layer.addLayer(Finnmark_parish_layer);
		}
		map.fitBounds(Finnmark_parish_layer.getBounds());

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		FinnmarkData.src = psrc;
		
						//Municipality JS file
		msrc = 'JS/Municipalities/Finnmark.js';

		var FinnmarkMuniData = document.createElement('script');
		FinnmarkMuniData.type = 'text/javascript';

		document.body.appendChild(FinnmarkMuniData);
		
		FinnmarkMuniData.onload = function(){
		
		var Finnmark_muni_layer = L.geoJson(Finnmark_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Finnmark_muni;
		if(FinnmarkCount == 1)
		{		
			Finnmark_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Finnmark_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		FinnmarkMuniData.src = msrc;
	}
	if(dom.byId('CountyDropDown').value == 'Hedmark')
	{
		++HedmarkCount;
		psrc = 'JS/Parishes/Hedmark.js';
		
		var HedmarkData = document.createElement('script');
		HedmarkData.type = 'text/javascript';

		document.body.appendChild(HedmarkData);

		console.log(HedmarkCount);
		
		HedmarkData.onload = function(){
		var Hedmark_parish_layer = L.geoJson(Hedmark_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Hedmark_parishes;		

		if(HedmarkCount == 1)
		{			
			Hedmark_parish_layer.addTo(map);
			parishes_layer.addLayer(Hedmark_parish_layer);
		}
		map.fitBounds(Hedmark_parish_layer.getBounds());	

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		HedmarkData.src = psrc;
		
						//Municipality JS file
		msrc = 'JS/Municipalities/Hedmark.js';

		var HedmarkMuniData = document.createElement('script');
		HedmarkMuniData.type = 'text/javascript';

		document.body.appendChild(HedmarkMuniData);
		
		HedmarkMuniData.onload = function(){
		
		var Hedmark_muni_layer = L.geoJson(Hedmark_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Hedmark_muni;
		if(HedmarkCount == 1)
		{		
			Hedmark_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Hedmark_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		HedmarkMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Hordaland')
	{
		++HordalandCount;
		psrc = 'JS/Parishes/Hordaland.js';
		
		var HordalandData = document.createElement('script');
		HordalandData.type = 'text/javascript';

		document.body.appendChild(HordalandData);

		console.log(HordalandCount);
		
		HordalandData.onload = function(){
		var Hordaland_parish_layer = L.geoJson(Hordaland_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Hordaland_parishes;		

		if(HordalandCount == 1)
		{		
			Hordaland_parish_layer.addTo(map);
			parishes_layer.addLayer(Hordaland_parish_layer);
		}
		map.fitBounds(Hordaland_parish_layer.getBounds());		
		
		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		HordalandData.src = psrc;
		
		//Municipality JS file
		msrc = 'JS/Municipalities/Hordaland.js';

		var HordalandMuniData = document.createElement('script');
		HordalandMuniData.type = 'text/javascript';

		document.body.appendChild(HordalandMuniData);
		
		HordalandMuniData.onload = function(){
		
		var Hordaland_muni_layer = L.geoJson(Hordaland_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Hordaland_muni;
		if(HordalandCount == 1)
		{		
			Hordaland_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Hordaland_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		HordalandMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Møre og Romsdal')
	{
		++More_og_RomsdalCount;
		psrc = 'JS/Parishes/More_og_Romsdal.js';
		
		var More_og_RomsdalData = document.createElement('script');
		More_og_RomsdalData.type = 'text/javascript';

		document.body.appendChild(More_og_RomsdalData);

		console.log(More_og_RomsdalCount);
		
		More_og_RomsdalData.onload = function(){
		var More_og_Romsdal_parish_layer = L.geoJson(More_og_Romsdal_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = More_og_Romsdal_parishes;		

		if(More_og_RomsdalCount == 1)
		{		
			More_og_Romsdal_parish_layer.addTo(map);
			parishes_layer.addLayer(More_og_Romsdal_parish_layer);	
		}
		map.fitBounds(More_og_Romsdal_parish_layer.getBounds());

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		More_og_RomsdalData.src = psrc;

		//Municipality JS file
		msrc = 'JS/Municipalities/More_og_Romsdal.js';

		var More_og_RomsdalMuniData = document.createElement('script');
		More_og_RomsdalMuniData.type = 'text/javascript';

		document.body.appendChild(More_og_RomsdalMuniData);
		
		More_og_RomsdalMuniData.onload = function(){
		
		var More_og_Romsdal_muni_layer = L.geoJson(More_og_Romsdal_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = More_og_Romsdal_muni;
		if(More_og_RomsdalCount == 1)
		{		
			More_og_Romsdal_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(More_og_Romsdal_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		More_og_RomsdalMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Nord-Trøndelag')
	{
		++Nord_TrondelagCount;
		psrc = 'JS/Parishes/Nord_Trondelag.js';
		
		var Nord_TrondelagData = document.createElement('script');
		Nord_TrondelagData.type = 'text/javascript';

		document.body.appendChild(Nord_TrondelagData);

		console.log(Nord_TrondelagCount);
		
		Nord_TrondelagData.onload = function(){
		var Nord_Trondelag_parish_layer = L.geoJson(Nord_Trondelag_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Nord_Trondelag_parishes;		

		if(Nord_TrondelagCount == 1)
		{		
			Nord_Trondelag_parish_layer.addTo(map);
			parishes_layer.addLayer(Nord_Trondelag_parish_layer);
		}
		map.fitBounds(Nord_Trondelag_parish_layer.getBounds());	

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		Nord_TrondelagData.src = psrc;

		//Municipality JS file
		msrc = 'JS/Municipalities/Nord_Trondelag.js';

		var Nord_TrondelagMuniData = document.createElement('script');
		Nord_TrondelagMuniData.type = 'text/javascript';

		document.body.appendChild(Nord_TrondelagMuniData);
		
		Nord_TrondelagMuniData.onload = function(){
		
		var Nord_Trondelag_muni_layer = L.geoJson(Nord_Trondelag_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Nord_Trondelag_muni;
		if(Nord_TrondelagCount == 1)
		{		
			Nord_Trondelag_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Nord_Trondelag_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		Nord_TrondelagMuniData.src = msrc;			
	}
	if(dom.byId('CountyDropDown').value == 'Nordland')
	{
		++NordlandCount;
		psrc = 'JS/Parishes/Nordland.js';
		
		var NordlandData = document.createElement('script');
		NordlandData.type = 'text/javascript';

		document.body.appendChild(NordlandData);

		console.log(NordlandCount);
		
		NordlandData.onload = function(){
		var Nordland_parish_layer = L.geoJson(Nordland_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Nordland_parishes;		

		if(NordlandCount == 1)
		{		
			Nordland_parish_layer.addTo(map);
			parishes_layer.addLayer(Nordland_parish_layer);	
		}
		map.fitBounds(Nordland_parish_layer.getBounds());

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		NordlandData.src = psrc;

		//Municipality JS file
		msrc = 'JS/Municipalities/Nordland.js';

		var NordlandMuniData = document.createElement('script');
		NordlandMuniData.type = 'text/javascript';

		document.body.appendChild(NordlandMuniData);
		
		NordlandMuniData.onload = function(){
		
		var Nordland_muni_layer = L.geoJson(Nordland_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Nordland_muni;
		if(NordlandCount == 1)
		{		
			Nordland_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Nordland_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		NordlandMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Oppland')
	{
		++OpplandCount;
		psrc = 'JS/Parishes/Oppland.js';
		
		var OpplandData = document.createElement('script');
		OpplandData.type = 'text/javascript';

		document.body.appendChild(OpplandData);

		console.log(OpplandCount);
		
		OpplandData.onload = function(){
		var Oppland_parish_layer = L.geoJson(Oppland_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Oppland_parishes;		

		if(OpplandCount == 1)
		{		
			Oppland_parish_layer.addTo(map);
			parishes_layer.addLayer(Oppland_parish_layer);	
		}
		map.fitBounds(Oppland_parish_layer.getBounds());	

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		OpplandData.src = psrc;		
		
		//Municipality JS file
		msrc = 'JS/Municipalities/Oppland.js';

		var OpplandMuniData = document.createElement('script');
		OpplandMuniData.type = 'text/javascript';

		document.body.appendChild(OpplandMuniData);
		
		OpplandMuniData.onload = function(){
		
		var Oppland_muni_layer = L.geoJson(Oppland_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Oppland_muni;
		if(OpplandCount == 1)
		{		
			Oppland_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Oppland_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		OpplandMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Oslo')
	{
		++OsloCount;
		psrc = 'JS/Parishes/Oslo.js';
		
		var OsloData = document.createElement('script');
		OsloData.type = 'text/javascript';

		document.body.appendChild(OsloData);

		console.log(OsloCount);
		
		OsloData.onload = function(){
		var Oslo_parish_layer = L.geoJson(Oslo_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Oslo_parishes;

		if(OsloCount == 1)
		{		
			Oslo_parish_layer.addTo(map);
			parishes_layer.addLayer(Oslo_parish_layer);	
		}
		map.fitBounds(Oslo_parish_layer.getBounds());	

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		OsloData.src = psrc;	

		//Municipality JS file
		msrc = 'JS/Municipalities/Oslo.js';

		var OsloMuniData = document.createElement('script');
		OsloMuniData.type = 'text/javascript';

		document.body.appendChild(OsloMuniData);
		
		OsloMuniData.onload = function(){
		
		var Oslo_muni_layer = L.geoJson(Oslo_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Oslo_muni;
		if(OsloCount == 1)
		{		
			Oslo_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Oslo_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		OsloMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Rogaland')
	{
		++RogalandCount;
		psrc = 'JS/Parishes/Rogaland.js';
		
		var RogalandData = document.createElement('script');
		RogalandData.type = 'text/javascript';

		document.body.appendChild(RogalandData);

		console.log(RogalandCount);
		
		RogalandData.onload = function(){
		var Rogaland_parish_layer = L.geoJson(Rogaland_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Rogaland_parishes;

		if(RogalandCount == 1)
		{		
			Rogaland_parish_layer.addTo(map);
			parishes_layer.addLayer(Rogaland_parish_layer);	
		}
		map.fitBounds(Rogaland_parish_layer.getBounds());	

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		RogalandData.src = psrc;

		//Municipality JS file
		msrc = 'JS/Municipalities/Rogaland.js';

		var RogalandMuniData = document.createElement('script');
		RogalandMuniData.type = 'text/javascript';

		document.body.appendChild(RogalandMuniData);
		
		RogalandMuniData.onload = function(){
		
		var Rogaland_muni_layer = L.geoJson(Rogaland_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Rogaland_muni;
		if(RogalandCount == 1)
		{		
			Rogaland_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Rogaland_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		RogalandMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Sogn og Fjordane')
	{
		++Sogn_og_FjordaneCount;
		psrc = 'JS/Parishes/Sogn_og_Fjordane.js';
		
		var Sogn_og_FjordaneData = document.createElement('script');
		Sogn_og_FjordaneData.type = 'text/javascript';

		document.body.appendChild(Sogn_og_FjordaneData);

		console.log(Sogn_og_FjordaneCount);
		
		Sogn_og_FjordaneData.onload = function(){
		var Sogn_og_Fjordane_parish_layer = L.geoJson(Sogn_og_Fjordane_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Sogn_og_Fjordane_parishes;

		if(Sogn_og_FjordaneCount == 1)
		{			
			Sogn_og_Fjordane_parish_layer.addTo(map);
			parishes_layer.addLayer(Sogn_og_Fjordane_parish_layer);	
		}
		
		map.fitBounds(Sogn_og_Fjordane_parish_layer.getBounds());

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		Sogn_og_FjordaneData.src = psrc;	

		//Municipality JS file
		msrc = 'JS/Municipalities/Sogn_og_Fjordane.js';

		var Sogn_og_FjordaneMuniData = document.createElement('script');
		Sogn_og_FjordaneMuniData.type = 'text/javascript';

		document.body.appendChild(Sogn_og_FjordaneMuniData);
		
		Sogn_og_FjordaneMuniData.onload = function(){
		
		var Sogn_og_Fjordane_muni_layer = L.geoJson(Sogn_og_Fjordane_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Sogn_og_Fjordane_muni;
		if(Sogn_og_FjordaneCount == 1)
		{		
			Sogn_og_Fjordane_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Sogn_og_Fjordane_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		Sogn_og_FjordaneMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Sør-Trøndelag')
	{
		++Sor_TrondelagCount;
		psrc = 'JS/Parishes/Sor_Trondelag.js';
		
		var Sor_TrondelagData = document.createElement('script');
		Sor_TrondelagData.type = 'text/javascript';

		document.body.appendChild(Sor_TrondelagData);

		console.log(Sor_TrondelagCount);
		
		Sor_TrondelagData.onload = function(){
		var Sor_Trondelag_parish_layer = L.geoJson(Sor_Trondelag_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Sor_Trondelag_parishes;

		if(Sor_TrondelagCount == 1)
		{		
			Sor_Trondelag_parish_layer.addTo(map);
			parishes_layer.addLayer(Sor_Trondelag_parish_layer);
		}
		
		map.fitBounds(Sor_Trondelag_parish_layer.getBounds());

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		Sor_TrondelagData.src = psrc;

		//Municipality JS file
		msrc = 'JS/Municipalities/Sor_Trondelag.js';

		var Sor_TrondelagMuniData = document.createElement('script');
		Sor_TrondelagMuniData.type = 'text/javascript';

		document.body.appendChild(Sor_TrondelagMuniData);
		
		Sor_TrondelagMuniData.onload = function(){
		
		var Sor_Trondelag_muni_layer = L.geoJson(Sor_Trondelag_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Sor_Trondelag_muni;
		if(Sor_TrondelagCount == 1)
		{		
			Sor_Trondelag_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Sor_Trondelag_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		Sor_TrondelagMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Telemark')
	{
		++TelemarkCount;
		psrc = 'JS/Parishes/Telemark.js';
		
		var TelemarkData = document.createElement('script');
		TelemarkData.type = 'text/javascript';

		document.body.appendChild(TelemarkData);

		console.log(TelemarkCount);
		
		TelemarkData.onload = function(){
		var Telemark_parish_layer = L.geoJson(Telemark_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Telemark_parishes;

		if(TelemarkCount == 1)
		{		
			Telemark_parish_layer.addTo(map);
			parishes_layer.addLayer(Telemark_parish_layer);		
		}
		map.fitBounds(Telemark_parish_layer.getBounds());	

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		TelemarkData.src = psrc;

		//Municipality JS file
		msrc = 'JS/Municipalities/Telemark.js';

		var TelemarkMuniData = document.createElement('script');
		TelemarkMuniData.type = 'text/javascript';

		document.body.appendChild(TelemarkMuniData);
		
		TelemarkMuniData.onload = function(){
		
		var Telemark_muni_layer = L.geoJson(Telemark_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Telemark_muni;
		if(TelemarkCount == 1)
		{		
			Telemark_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Telemark_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		TelemarkMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Troms')
	{
		++TromsCount;
		psrc = 'JS/Parishes/Troms.js';
		
		var TromsData = document.createElement('script');
		TromsData.type = 'text/javascript';

		document.body.appendChild(TromsData);

		console.log(TromsCount);
		
		TromsData.onload = function(){
		var Troms_parish_layer = L.geoJson(Troms_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Troms_parishes;

		if(TromsCount == 1)
		{		
			Troms_parish_layer.addTo(map);
			parishes_layer.addLayer(Troms_parish_layer);
		}
		map.fitBounds(Troms_parish_layer.getBounds());	

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		TromsData.src = psrc;

		//Municipality JS file
		msrc = 'JS/Municipalities/Troms.js';

		var TromsMuniData = document.createElement('script');
		TromsMuniData.type = 'text/javascript';

		document.body.appendChild(TromsMuniData);
		
		TromsMuniData.onload = function(){
		
		var Troms_muni_layer = L.geoJson(Troms_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Troms_muni;
		if(TromsCount == 1)
		{		
			Troms_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Troms_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		TromsMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Vest-Agder')
	{
		++Vest_AgderCount;
		psrc = 'JS/Parishes/Vest_Agder.js';
		
		var Vest_AgderData = document.createElement('script');
		Vest_AgderData.type = 'text/javascript';

		document.body.appendChild(Vest_AgderData);

		console.log(Vest_AgderCount);
		
		Vest_AgderData.onload = function(){
		var Vest_Agder_parish_layer = L.geoJson(Vest_Agder_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Vest_Agder_parishes;

		if(Vest_AgderCount == 1)
		{		
			Vest_Agder_parish_layer.addTo(map);
			parishes_layer.addLayer(Vest_Agder_parish_layer);
		}
		map.fitBounds(Vest_Agder_parish_layer.getBounds());		
		
		setParishDropdown();    //Populate Parish dropdown list
		}
		
		Vest_AgderData.src = psrc;

		//Municipality JS file
		msrc = 'JS/Municipalities/Vest_Agder.js';

		var Vest_AgderMuniData = document.createElement('script');
		Vest_AgderMuniData.type = 'text/javascript';

		document.body.appendChild(Vest_AgderMuniData);
		
		Vest_AgderMuniData.onload = function(){
		
		var Vest_Agder_muni_layer = L.geoJson(Vest_Agder_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Vest_Agder_muni;
		if(Vest_AgderCount == 1)
		{		
			Vest_Agder_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Vest_Agder_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		Vest_AgderMuniData.src = msrc;			
	}
	if(dom.byId('CountyDropDown').value == 'Vestfold')
	{
		++VestfoldCount;
		psrc = 'JS/Parishes/Vestfold.js';
		
		var VestfoldData = document.createElement('script');
		VestfoldData.type = 'text/javascript';

		document.body.appendChild(VestfoldData);

		console.log(VestfoldCount);
		
		VestfoldData.onload = function(){
		var Vestfold_parish_layer = L.geoJson(Vestfold_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Vestfold_parishes;

		if(VestfoldCount == 1)
		{		
			Vestfold_parish_layer.addTo(map);
			parishes_layer.addLayer(Vestfold_parish_layer);
		}
		map.fitBounds(Vestfold_parish_layer.getBounds());

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		VestfoldData.src = psrc;

		//Municipality JS file
		msrc = 'JS/Municipalities/Vestfold.js';

		var VestfoldMuniData = document.createElement('script');
		VestfoldMuniData.type = 'text/javascript';

		document.body.appendChild(VestfoldMuniData);
		
		VestfoldMuniData.onload = function(){
		
		var Vestfold_muni_layer = L.geoJson(Vestfold_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Vestfold_muni;
		if(VestfoldCount == 1)
		{		
			Vestfold_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Vestfold_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		VestfoldMuniData.src = msrc;		
	}
	if(dom.byId('CountyDropDown').value == 'Østfold')
	{
		++OstfoldCount;
		psrc = 'JS/Parishes/Ostfold.js';
		
		var OstfoldData = document.createElement('script');
		OstfoldData.type = 'text/javascript';

		document.body.appendChild(OstfoldData);

		console.log(OstfoldCount);
		
		OstfoldData.onload = function(){
		var Ostfold_parish_layer = L.geoJson(Ostfold_parishes, {style: ParishStyle, onEachFeature: labelParishes});
		parish_data_properties = Ostfold_parishes;

		if(OstfoldCount == 1)
		{		
			Ostfold_parish_layer.addTo(map);
			parishes_layer.addLayer(Ostfold_parish_layer);	
		}
		map.fitBounds(Ostfold_parish_layer.getBounds());

		setParishDropdown();    //Populate Parish dropdown list		
		}
		
		OstfoldData.src = psrc;	

		//Municipality JS file
		msrc = 'JS/Municipalities/Ostfold.js';

		var OstfoldMuniData = document.createElement('script');
		OstfoldMuniData.type = 'text/javascript';

		document.body.appendChild(OstfoldMuniData);
		
		OstfoldMuniData.onload = function(){
		
		var Ostfold_muni_layer = L.geoJson(Ostfold_muni, {style: MuniStyle, onEachFeature: labelMunicipalities});
		municipality_data_properties = Ostfold_muni;
		if(OstfoldCount == 1)
		{		
			Ostfold_muni_layer.addTo(map);	
			Municipalities_layer.addLayer(Ostfold_muni_layer);	
		}

		setMunicipalityDropdown();
		
		}
		
		OstfoldMuniData.src = msrc;		
	}
	else
	{
		console.log(dom.byId('CountyDropDown').value + " County was already loaded");
		clearResults();
	}

	
	LayerControl.addOverlay(Municipalities_layer, "Municipalities");
	LayerControl.addOverlay(parishes_layer, "Parishes");

	//setCountyContent();
	
}

//USER INPUT EVENT DECLARATIONS
on(dom.byId('CountyDropDown'), 'change', selectCounty);   //selectCounty   loadJSfile
on(dom.byId('CountyDropDown'), 'change', setCountyContent);
on(dom.byId('ParishDropDown'), 'change', zoomToParish);
on(dom.byId('ParishDropDown'), 'change', setParishContent);
on(dom.byId('MunicipalityDropdown'), 'change', setParishDropdown_Muni);
on(dom.byId('MunicipalityDropdown'), 'change', zoomToMunicipality);
on(dom.byId('MunicipalityDropdown'), 'change', setMunicipalityContent);
on(dom.byId('About'), 'click', function(){
											window.open("about.html", "_self");
										});
on(dom.byId('Acknowledgements'), 'click', function (){
											window.open("Acknowledgements.html", "_self");
										});
on(dom.byId('Resources'), 'click', function(){
											window.open("resources.html", "_self");
										});
on(dom.byId('Contact'), 'click', function(){
											window.open("contact.html", "_self");
										});	
on(dom.byId('offButton'), 'click', function(){
											if(dom.byId('results').style.visibility == "visible")
											{
												dom.byId('results').style.visibility = "hidden";
												dom.byId('offButton').innerHTML = "Show Popup";
												return;
											}
											if(dom.byId('results').style.visibility == "hidden" && dom.byId('results').innerHTML != "")
											{
												if(dom.byId('CountyDropDown').value == "null" || dom.byId('ParishDropDown').value == "")
													return;
											
												dom.byId('results').style.visibility = "visible";
												dom.byId('offButton').innerHTML = "Hide Popup";												
												return;
											}
										});										

var baseLayers = {
	"Aerial Imagery": satelliteLayer,
	"Topographic Map": topoBase,
	"Open Street Map": OSM
};

var overlayLayers = {
	"Transportation": transportationLayer,
	"Counties": Counties_layer,
	"Regional Offices": Offices_layer
};

var LayerControl = L.control.layers(baseLayers, overlayLayers, {position: 'topleft'}).addTo(map);

/*map.on('zoomend', function(){
	zoomlevel = map.getZoom();
	if(zoomlevel > 7)
		Municipality_layer.addTo(map);
	if(zoomlevel > 9)
		Parish_layer.addTo(map);
	if(zoomlevel <= 7)
		map.removeLayer
});*/

//var place_layer = L.geoJson(places).addTo(map);

function setParishContent()
{
	if(dom.byId("offButton").innerHTML = "Show Popup")
		dom.byId("offButton").innerHTML = "Hide Popup";

	for(i in parish_data_properties.features)
	{
		if(parish_data_properties.features[i].properties.Par_NAME == dom.byId('ParishDropDown').value)
		{
			document.getElementById('results').style.visibility = "visible";
			
			var photoWidth;
			var photoHeight;
			
			var FSdata = getFSinfo(parish_data_properties.features[i].properties.COUNTY);
			var FSlink = FSdata[0];
			var FScount = FSdata[1];
			
			if(parish_data_properties.features[i].properties.PHOTO_O == "L")
			{	
				photoWidth = "200px";
				photoHeight = "150px";
			}
			if(parish_data_properties.features[i].properties.PHOTO_O == "P")
			{	
				photoWidth = "150px";
				photoHeight = "200px";
			}
			
			var content = "<div id='resultsTitle'>" + parish_data_properties.features[i].properties.Par_NAME
				+ "<br><img align='middle' src='" + parish_data_properties.features[i].properties.PHOTO + "' height='" + photoHeight + "' " + "width='" + photoWidth + "'><div id='credit'>Photo: kirkesok.no</div></div>"
				+ "<br><b>Municipality: </b>" + parish_data_properties.features[i].properties.MUNICIPALI
				+ "<br><b>County: </b>" + parish_data_properties.features[i].properties.COUNTY
				+ "<br><b>Church: </b><a target='_blank' href='" + parish_data_properties.features[i].properties.CHURCH + "'>Building history and location</a>"
				+ "<br><b>Farms: </b><a target='_blank' href='" + countyFarms + "'>List of farms and their history</a>"
				+ "<br><b>History and Records: </b><a target='_blank' href='" + parish_data_properties.features[i].properties.FAM_SEARCH + "'>FamilySearch.org</a>"
				+ "<br><b>Family Search Index:</b><br>&nbsp;&nbsp;&nbsp;&nbsp;<a target='_blank' href='" + FSlink + "'>Search <b>" + FScount + "</b> indexed vital records</a>"
				+ "<br><b>View Vital Records (National Archives): </b><br>&nbsp;&nbsp;&nbsp;&nbsp;<a target='_blank' href='" + parish_data_properties.features[i].properties.DA_1 + "'>" + parish_data_properties.features[i].properties.DA_1_NAME + "</a>";
			
			if(parish_data_properties.features[i].properties.DA_2_NAME != null)
				content += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a target='_blank' href='" + parish_data_properties.features[i].properties.DA_2 + "'>" + parish_data_properties.features[i].properties.DA_2_NAME + "</a>";
			if(parish_data_properties.features[i].properties.DA_3_NAME != null)	
				content += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a target='_blank' href='" + parish_data_properties.features[i].properties.DA_3 + "'>" + parish_data_properties.features[i].properties.DA_3_NAME + "</a>";
			if(parish_data_properties.features[i].properties.DA_4_NAME != null)			
				content += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a target='_blank' href='" + parish_data_properties.features[i].properties.DA_4 + "'>" + parish_data_properties.features[i].properties.DA_4_NAME + "</a>";				
			if(parish_data_properties.features[i].properties.DA_5_NAME != null)				
				content += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<a target='_blank' href='" + parish_data_properties.features[i].properties.DA_5 + "'>" + parish_data_properties.features[i].properties.DA_5_NAME + "</a>";
				
			content += "<br><b>Census Records (Indexed): </b><br>&nbsp;&nbsp;&nbsp;&nbsp;<a target='_blank' href='" + census_1801 + "'>1801</a>" + ", "
					+ "<a target='_blank' href='" + census_1865 + "'>1865</a>" + ", "
					+ "<a target='_blank' href='" + census_1875 + "'>1875</a>" + ", "
					+ "<a target='_blank' href='" + census_1885 + "'>1885</a>" + ", "
					+ "<a target='_blank' href='" + census_1900 + "'>1900</a>" + ", "
					+ "<a target='_blank' href='" + census_1910 + "'>1910</a>";			
					
			console.log(parish_data_properties.features[i].properties.Par_NAME);
			console.log(dom.byId('ParishDropDown').value);			
			break;
		}
	}
	
	dom.byId('results').innerHTML = content;
	
}

var countyFarms;

function setCountyContent()
{
	if(dom.byId("offButton").innerHTML = "Show Popup")
		dom.byId("offButton").innerHTML = "Hide Popup";
		
	for(i in County_data.features)
	{
		if(County_data.features[i].properties.COUNTY == dom.byId('CountyDropDown').value)
		{
			document.getElementById('results').style.visibility = "visible";
			
			var content = "<div id='resultsTitle'>" + County_data.features[i].properties.COUNTY + " County</div>"
				//+ "<p>Until 1919 " + County_data.features[i].properties.COUNTY + " was known as <b>" + County_data.features[i].properties.OLD_COUNTY + " amt</b></p>"
				+ "<br><b>Prior Name: </b>" + County_data.features[i].properties.OLD_COUNTY + " amt<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(until 1919)"
				+ "<br><b>Wikipedia: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b><a target='_blank' href='" + County_data.features[i].properties.WIKI + "'>Demographics and History</a>"
				+ "<br><b>Family Search: </b><a target='_blank' href='" + County_data.features[i].properties.FS_WIKI + "'>Regional Genealogy Helps</a>"
				+ "<br><b>Farms: &nbsp;&nbsp;&nbsp;&nbsp;</b><a target='_blank' href='" + County_data.features[i].properties.FARMS + "'>Gazetteer of farms by Oluf Rygh</a>";		
		
			countyFarms = County_data.features[i].properties.FARMS;
		
			break;
		}
	}
	
	dom.byId('results').innerHTML = content;
}

function setMunicipalityContent()
{
	if(dom.byId("offButton").innerHTML = "Show Popup")
		dom.byId("offButton").innerHTML = "Hide Popup";

	for(i in municipality_data_properties.features)
	{
		if(municipality_data_properties.features[i].properties.MUNICIPALI == dom.byId('MunicipalityDropdown').value)
		{
			document.getElementById('results').style.visibility = "visible";
			
			var content = "<div id='resultsTitle'>" + municipality_data_properties.features[i].properties.MUNICIPALI
						+ " Municipality</div>"
						+ "<p id='resultsCounty'>" + municipality_data_properties.features[i].properties.COUNTY + " County </p>";
						
			break;
		}
	}
	
	dom.byId('results').innerHTML = content;
	
	if(dom.byId('MunicipalityDropdown').value == "ALL PARISHES")
		dom.byId("results").style.visibility = "hidden";
}

var parishDropdown = document.getElementById('ParishDropDown');

function setParishDropdown()
{
	if(dom.byId('CountyDropDown').value=='null')
	{
		parishDropdown.options.length = 0;
		return;
	}
	
	var ParishNamesSort = [];
	parishDropdown.options.length = 0;//reset Parish dropdown list
	var iniOption = document.createElement('option');
	iniOption.text = "";
	parishDropdown.add(iniOption);
	
	
	for(i in parish_data_properties.features)
	{
		ParishNamesSort.push(parish_data_properties.features[i].properties.Par_NAME);
	}
	
	ParishNamesSort.sort();  //Sort parishes in alphabetical order
	
	for(j in ParishNamesSort)
	{
		var option = document.createElement('option');
		option.text = ParishNamesSort[j];
		
		parishDropdown.add(option);
	}
		
}

function setParishDropdown_Muni()
{
	var ParishNamesSort = [];
	parishDropdown.options.length = 0;//reset Parish dropdown list
	var iniOption = document.createElement('option');
	iniOption.text = "";
	parishDropdown.add(iniOption);
	
	
	for(i in parish_data_properties.features)
	{
		if(dom.byId('MunicipalityDropdown').value == parish_data_properties.features[i].properties.MUNICIPALI)
			ParishNamesSort.push(parish_data_properties.features[i].properties.Par_NAME);
		if(dom.byId('MunicipalityDropdown').value == 'ALL PARISHES')
		{
			ParishNamesSort.push(parish_data_properties.features[i].properties.Par_NAME);
		}
	}
	
	ParishNamesSort.sort();  //Sort parishes in alphabetical order
	
	for(j in ParishNamesSort)
	{
		var option = document.createElement('option');
		option.text = ParishNamesSort[j];
		
		parishDropdown.add(option);
	}
		
}

var MunicipalityDropdown = document.getElementById('MunicipalityDropdown');

function setMunicipalityDropdown()
{
	if(dom.byId('CountyDropDown').value=='null')
	{
		MunicipalityDropdown.options.length = 0;
		return;
	}

	var MunicipalitiesNamesSort = [];
	MunicipalityDropdown.options.length = 0;//reset Parish dropdown list
	var iniOption = document.createElement('option');
	iniOption.text = "ALL PARISHES";
	
	MunicipalityDropdown.add(iniOption);
	
	for(i in municipality_data_properties.features)
	{
		MunicipalitiesNamesSort.push(municipality_data_properties.features[i].properties.MUNICIPALI);
	}
	
	MunicipalitiesNamesSort.sort();  //Sort parishes in alphabetical order
	
	for(j in MunicipalitiesNamesSort)
	{
		var option = document.createElement('option');
		option.text = MunicipalitiesNamesSort[j];
		
		MunicipalityDropdown.add(option);
		//console.log(MunicipalityDropdown.value);
	}
}

function specialChar(text)
{
	var newLabel = text.replace('&aelig;', 'æ').replace('&aring;', 'å').replace('&oslash;', 'ø').replace('&AElig;', 'Æ').replace('&Aring;', 'Å').replace('&Oslash;', 'Ø');
	return newLabel;
}

var zoomParishCount = 0;

var selectedParish = L.layerGroup();//.addTo(map);

function zoomToParish()
{   
	zoomParishCount++;
	
	for(i in parish_data_properties.features)
	{
		if(parish_data_properties.features[i].properties.Par_NAME == dom.byId('ParishDropDown').value)
		{   	
			selectedParish.addTo(map).clearLayers();
			
			tempParishLayer = L.geoJson(parish_data_properties.features[i], {style: SelectedStyle})
			selectedParish.addLayer(tempParishLayer);
			map.fitBounds(tempParishLayer.getBounds());
				
			break;
		}
		else
			clearResults();
	}
	
	
	on(dom.byId('ClearButton'), 'click', function(){
												map.removeLayer(tempParishLayer);
												clearResults();
												});
	on(dom.byId('CountyDropDown'), 'change', function(){
												map.removeLayer(tempParishLayer);
												//clearResults();
												}); 

	on(dom.byId('MunicipalityDropdown'), 'change', function(){
												map.removeLayer(tempParishLayer);
												//clearResults();
												});												
}

var selectedMunicipality = L.layerGroup();
function zoomToMunicipality()
{
	for(i in municipality_data_properties.features)
	{		
		if(municipality_data_properties.features[i].properties.MUNICIPALI == document.getElementById('MunicipalityDropdown').value)
		{   	
			selectedMunicipality.addTo(map).clearLayers();
			
			var tempMuniLayer = L.geoJson(municipality_data_properties.features[i], {style: SelectedStyle})
			selectedMunicipality.addLayer(tempMuniLayer);
			map.fitBounds(tempMuniLayer.getBounds());
				
			break;
		}
		
	}
	
	on(dom.byId('ClearButton'), 'click', function(){
												map.removeLayer(tempMuniLayer);
												clearResults();
												});
	on(dom.byId('CountyDropDown'), 'change', function(){
												map.removeLayer(tempMuniLayer);
												});
	on(dom.byId('ParishDropDown'), 'change', function(){
												map.removeLayer(tempMuniLayer);
												});											
}

var selectedCounty = L.layerGroup();

function selectCounty()
{
	loadJSfile();

	for(i in County_data.features)
	{
		if(County_data.features[i].properties.COUNTY == dom.byId('CountyDropDown').value)
		{   	
			selectedCounty.addTo(map).clearLayers();
			
			tempCountyLayer = L.geoJson(County_data.features[i], {style: SelectedStyle})
			selectedCounty.addLayer(tempCountyLayer);
			//Counties_layer_all.addLayer(tempCountyLayer);
			map.fitBounds(tempCountyLayer.getBounds());
				
			break;
		}
	}
	
	if(dom.byId('CountyDropDown').value == "null")
	{
		dom.byId('ParishDropDown').options.length = 0;
		dom.byId('MunicipalityDropdown').options.length = 0;
		dom.byId('results').style.visibility = "hidden";
	}
	
	on(dom.byId('ClearButton'), 'click', function(){
												map.removeLayer(tempCountyLayer);
												clearResults();
												dom.byId('CountyDropDown').value = "null";
												dom.byId('ParishDropDown').options.length = 0;
												dom.byId('MunicipalityDropdown').options.length = 0;
												});
	on(dom.byId('ParishDropDown'), 'change', function(){
												map.removeLayer(tempCountyLayer);
												//clearResults();
												});
	on(dom.byId('MunicipalityDropdown'), 'change', function(){
												map.removeLayer(tempCountyLayer);
												
												});											
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

function clearResults()
{
	dom.byId('results').innerHTML = '';
	dom.byId('results').style.visibility = 'hidden';
}

function openNewPage(page)
{
	window.open(page, "_self");
}


});