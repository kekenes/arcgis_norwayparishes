require(["dijit/layout/BorderContainer", 
         "dijit/layout/ContentPane",
         "dijit/layout/AccordionContainer",
         "dijit/layout/AccordionPane",
         "dojo/dom-construct", 
         "dojo/on", 
         "dojo/domReady!"],
        function(BorderContainer, ContentPane, AccordionContainer, AccordionPane, domConstruct, on){

var bc = new BorderContainer({
    style: "height: 100%; width: 100%", 
    gutters: true, 
    liveSplitters: true
});
    
 toolContainer = new AccordionContainer({
  splitter: true,
  region: "left",
  style: "width: 300px"
});
bc.addChild(toolContainer);
    
selectPane = new AccordionPane({
   title: "Select Parish",
   content: "<div class='tools'>Tool Content</div>",
   style: "margin: 0; padding: 0;"
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
var norwayCountiesLayerURL = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/0";
var norwayMuniLayerURL = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/1";
var norwayParishesURL = "http://services3.arcgis.com/KXH3vrrQAKwhcniG/arcgis/rest/services/Norway_Parish_Boundaries_4326_FS/FeatureServer/2";

var map = L.map('map', {
center: [64.5,11.0],
zoom: 5,
});

var norwayCountiesLayer = L.esri.featureLayer(norwayCountiesLayerURL);//, {
//style: function(feature){
 //   return {color: 'blue', weight: 2};
//}
//}).addTo(map);
L.esri.basemapLayer('Gray').addTo(map);
//norwayCountiesLayer.addTo(map);

var norwayParishesLayer = L.esri.featureLayer(norwayParishesURL);
//norwayParishesLayer.addTo(map);
    

    
});