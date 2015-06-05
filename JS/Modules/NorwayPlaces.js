define([
    "esri/request",
    "esri/urlUtils",
    "esri/config",
    "esri/SpatialReference",
    "esri/tasks/ProjectParameters",
    "esri/tasks/GeometryService",
    "esri/geometry/geometryEngine",
    "esri/geometry/Point",
    "dojo/_base/array",
    "dojo/Deferred"
], function(esriRequest, urlUtils, esriConfig, SpatialReference, ProjectParameters, GeometryService, geometryEngine, Point, array, Deferred){
    
    return {
        test: function(){
            console.log("this is a test");
        },
        
        search: function(propertyName, geoFilter){
            var dfd = new Deferred();
            
            if(propertyName.length < 1){
                alert("You must enter a property name to perform this operation.");
                dfd.reject();
            }
            
            esriConfig.defaults.io.corsEnabledServers.push("tasks.arcgisonline.com");
            
            urlUtils.addProxyRule({
                urlPrefix: "http://tasks.arcgisonline.com/ArcGIS/rest/services",
                proxyUrl: "./proxy/DotNet/proxy.ashx"
            });
            
            var geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            
            var placeObjects = [];
            var geoMatch;
 
            var exampleRequestUrl = "https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=Ask*&maxAnt=50&tilSosiKoordSyst=4258&fylkeKommuneListe=605,612&eksakteForst=true";
            
            //Construct request url
            var baseUrl = "https://ws.geonorge.no/SKWS3Index/ssr/sok?";
            var paramName = "navn=";
            var requestUrl = baseUrl + paramName + propertyName;

            esriRequest({
                url: requestUrl,
                handleAs: "xml"
            }, {
                useProxy: true
            }).then(function(response){
                var xmlResponse = response;
                var jsonResponse = xmlToJSON.parseXML(xmlResponse);
                var rawResults = jsonResponse.sokRes[0].stedsnavn;
                
                if(!rawResults){
                    dfd.resolve(0);
                }
                
                var projectParams = new ProjectParameters();
                projectParams.outSR = new SpatialReference({wkid: 4326});
                
                var itemCount = 0;
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
                        itemCount++;
                        projGeom = result[0];
                        att.geom = projGeom;
                        
                        if(geoFilter){
                            geoMatch = geometryEngine.intersects(projGeom, geoFilter);
                            if(geoMatch){
                                placeObjects.push(att);
                            }
                            if(itemCount === rawResults.length)
                                dfd.resolve(placeObjects);
                        }
                        else{
                            placeObjects.push(att);
                            if(itemCount === rawResults.length){
                                dfd.resolve(placeObjects);
                            }
                        }
                     });
                });
            });
           return dfd.promise; 
        },
        
        getFactSheet: function(id){
            var baseUrl = "http://faktaark.statkart.no/SSRFakta/faktaarkfraobjektid?enhet=";
            var ssrId = id;
            
            var requestUrl = baseUrl + ssrId;
            window.open(requestUrl);
        },
        
        withinExtent: function(point, extent){
            var within = geometryEngine.within(point, extent);
            if(within){
                return within;
            }
            else{
                alert("Address not located in Norway.");
                return false;
            }
        }
    };
});