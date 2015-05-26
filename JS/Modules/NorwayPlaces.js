define([
    "dojo/request",
    "esri/request",
    "esri/urlUtils",
    "esri/config",
    "esri/SpatialReference",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/tasks/FeatureSet",
    "esri/tasks/ProjectParameters",
    "esri/tasks/GeometryService",
    "esri/geometry/geometryEngine",
    "esri/graphic",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/geometry/Point",
    "dojo/_base/array",
    "dojo/Deferred"
], function(request, esriRequest, urlUtils, esriConfig, SpatialReference, FeatureLayer, GraphicsLayer, FeatureSet, ProjectParameters, GeometryService, geometryEngine, Graphic, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, Color, Point, array, Deferred){
    
    return {
        test: function(){
            console.log("this is a test");
        },
        
        search: function(propertyName, geoFilter){
            esriConfig.defaults.io.corsEnabledServers.push("tasks.arcgisonline.com");
            
            urlUtils.addProxyRule({
                urlPrefix: "http://tasks.arcgisonline.com/ArcGIS/rest/services",
                proxyUrl: "./proxy/DotNet/proxy.ashx"
            });
            
            var dfd = new Deferred();
            
            var geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
//            var projectParams = new ProjectParameters();
//            projectParams.outSR = new SpatialReference({wkid: 4326});
            
            var placeObjects = [];
            var geoMatch;
            
//            var pointSymbol = new SimpleMarkerSymbol(SimpleLineSymbol.STYLE_CIRCLE, 7, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("red"), 0.5), new Color([0,255,0,1]));
            
//            var featureSet = new FeatureSet();
            
//            var propLayer = new GraphicsLayer();
            
//            var layerDefinition = {
//              "geometryType": "esriGeometryPoint",
//              "spatialReference": new SpatialReference({wkid: 25833}),
//              "fields": [{
//                "alias": "OID",
//                "name": "OID",
//                "type": "esriFieldTypeOID"
//              },
//              {
//                "alias": "x",
//                "name": "x",
//                "type": "esriFieldTypeInteger"
//              },
//              {
//                "alias": "y",
//                "name": "y",
//                "type": "esriFieldTypeInteger"
//              },
//              {
//                "alias": "wkid",
//                "name": "wkid",
//                "type": "esriFieldTypeInteger"
//              },
//              {
//                "alias": "ssrId",
//                "name": "ssrId",
//                "type": "esriFieldTypeInteger"
//              },
//              {
//                "alias": "name",
//                "name": "name",
//                "type": "esriFieldTypeString"
//              },
//              {
//                "alias": "SpName",
//                "name": "SpName",
//                "type": "esriFieldTypeString"
//              },
//              {
//                "alias": "status",
//                "name": "status",
//                "type": "esriFieldTypeString"
//              },
//              {
//                "alias": "type",
//                "name": "type",
//                "type": "esriFieldTypeString"
//              },
//              {
//                "alias": "municipality",
//                "name": "municipality",
//                "type": "esriFieldTypeString"
//              },
//              {
//                "alias": "county",
//                "name": "county",
//                "type": "esriFieldTypeString"
//              }
//                        ],
//              "drawingInfo": {
//                "renderer": new SimpleRenderer(pointSymbol),
//                "transparency": 0
//              }
//            }; 
            var exampleRequestUrl = "https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=Ask*&maxAnt=50&tilSosiKoordSyst=4258&fylkeKommuneListe=605,612&eksakteForst=true";
            
            var baseUrl = "https://ws.geonorge.no/SKWS3Index/ssr/sok?";
            var paramName = "navn=";
            var requestUrl = baseUrl + paramName + propertyName;
            
            console.log("request url: ", requestUrl);
            
//            request(requestUrl, {
//                handleAs: "xml"
//            }).then(function(response){
//                console.log("search response: ", response);
//            });
//            var features = [];
            esriRequest({
                url: requestUrl,
                handleAs: "xml"
            }, {
                useProxy: true
            }).then(function(response){
                var xmlResponse = response;
                console.log("request response: ", response);
                
                var jsonResponse = xmlToJSON.parseXML(xmlResponse);
                console.log("xml2json response: ", jsonResponse);
                
                var rawResults = jsonResponse.sokRes[0].stedsnavn;
                
                var projectParams = new ProjectParameters();
                projectParams.outSR = new SpatialReference({wkid: 4326});
                
                array.forEach(rawResults, function(item, i){
                    var att = {};
                    att.x = item.aust[0]._text;
                    att.y = item.nord[0]._text;
                    att.name = item.stedsnavn[0]._text;
                    att.ssrId = item.ssrId[0]._text;
                    att.status = item.skrivemaatestatus[0]._text;
                    att.SpName = item.skrivemaatenavn[0]._text;
                    att.type = item.navnetype[0]._text;
                    att.municipality = item.kommunenavn[0]._text;
                    att.county = item.fylkesnavn[0]._text;
                    att.wkid = item.epsgKode[0]._text;
                    
                    var geom = new Point([att.x,att.y], new SpatialReference({wkid: att.wkid}));
                    projectParams.geometries = [geom];
                    
                    geometryService.project(projectParams, function(result){
                        console.log("projection result: ", result);
                        projGeom = result[0];
                        att.geom = projGeom;
                        
                        if(geoFilter){
                            geoMatch = geometryEngine.intersects(projGeom, geoFilter);
                            console.log("geomatch = ", geoMatch);
                            console.log("geofilter geom = ", geoFilter);
                            if(geoMatch){
                                placeObjects.push(att);
                            }
//                            else if((i + 1) === rawResults.length){
                            if((i + 1) === rawResults.length)
                                dfd.resolve(placeObjects);
//                            }
//                            else{
//                                return;
//                            }
                        }
                        else{
                            console.log("geofilter doesn't match: ", att);
                            
                            placeObjects.push(att);
                            console.log("i = ", i, " raw results length = ", rawResults.length);
                            if((i + 1) === rawResults.length){
                                dfd.resolve(placeObjects);
                            }
                        }
                     });
    
//                    if(geoFilter){
//                        geoMatch = geometryEngine.intersects(geom, geoFilter);
//                        if(geoMatch){
//                            placeObjects.push(att);
//                        }
//                        else{
//                            console.log("no geo match");
//                        }
//                    }
//                    else{
//                        placeObjects.push(att);
//                    }
                                                            
//                    var projGeom;
                    
//                    console.log("geometry: ", geom);
//                    console.log("feature: ", feature);
//                    projectParams.geometries = [geom];
                    
//                    geometryService.project(projectParams, function(result){
//                        console.log("projection result: ", result);
//                        projGeom = result[0];
//                        att.geom = projGeom;
//                        var feature = new Graphic(projGeom, pointSymbol, att);
//                        propLayer.add(feature);
////                        features.push(feature);
//                    });
                    
                    
//                    features.push(new Graphic(geom, pointSymbol, att));
                    
//                    var feature = new Graphic(projGeom, pointSymbol, att);
                    
//                    propLayer.add(feature);
                    
//                    placeObjects.push(att);
                });
                
//                console.log("features array: ", features);
                
//                featureSet.features = features;
                
//                var featureCollection = {
//                    layerDefinition: layerDefinition,
//                    featureSet: featureSet
//                };
                
//                var propertiesLayer = new FeatureLayer(featureCollection, {
//                    mode: FeatureLayer.MODE_SNAPSHOT
//                });
                
                console.log("cleaned up search results: ", placeObjects);
//                console.log("features: ", features);
//                console.log("properties layer: ", propertiesLayer);
//                console.log("graphics layer: ", propLayer);
                
//                dfd.resolve(propLayer);
//                dfd.resolve(placeObjects);
            });
           return dfd.promise; 
        },
        
//        getLayer: function(items){
//            var dfd = new Deferred();
//            var pointSymbol = new SimpleMarkerSymbol(SimpleLineSymbol.STYLE_CIRCLE, 7, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("red"), 0.5), new Color([0,255,0,1]));
//            var propLayer = new GraphicsLayer();
////            var geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
////            var projectParams = new ProjectParameters();
////            projectParams.outSR = new SpatialReference({wkid: 3857});
//    
//            array.forEach(items, function(item, i){
//                console.log("item = ", items.length, " i = ", i);
//                var geom = item.geom;
//                var feature = new Graphic(geom, pointSymbol, item);
//                propLayer.add(feature);
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
//                if(items.length === (i + 1)){
//                    dfd.resolve(propLayer);
//                }
//            });
            
    
            

            
//                    console.log("feature: ", feature);
            

            
//            return dfd.promise;
//        },
        
        getLayerExtent: function(graphics){
            
        }
    };
});