




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