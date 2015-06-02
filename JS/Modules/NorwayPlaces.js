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
            
            var baseUrl = "https://ws.geonorge.no/SKWS3Index/ssr/sok?";
            var paramName = "navn=";
//            propertyName = "*" + propertyName + "*";
            var requestUrl = baseUrl + paramName + propertyName;
            
            console.log("request url: ", requestUrl);

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
                
                if(!rawResults){
                    var noResultMessage = "<p><i>No properties could be identified by the name: <b>" + propertyName + "</b></i>. The following"
                    + " are suggestions for improving your search:</p><ol>"
                    + "<li>Check the spelling of the search entry to ensure it is correct, including the usage of Norwegain characters (Æ, Ø, Å). "
                    + "If necessary, <a target='_blank' href='https://familysearch.org/learn/wiki/en/Norway:_Typing_%C3%86,_%C3%98,_and_%C3%85'>"
                    + "activate the Norwegian keyboard</a> on your computer.</li><br>"
                    + "<li>If searching for farms, use <a target='_blank' href='http://www.dokpro.uio.no/rygh_ng/rygh_form.html'>Oluf Rygh's Farm Gazetteer</a>"
                    + " to find alternate spellings of the desired farm name.</li><br>"
                    + "<li>If necessary, uncheck the checkbox to remove geographic filtering in the search.</li></ol>";
                    dfd.resolve(noResultMessage);
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
                            if(itemCount === rawResults.length)
                                dfd.resolve(placeObjects);
                        }
                        else{
                            console.log("geofilter doesn't match: ", att);
                            
                            placeObjects.push(att);
                            console.log("i = ", i, " raw results length = ", rawResults.length);
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
            //CHECK IF GEOCODE POINT IS IN FULL EXTENT OF COUNTIES HERE
//            console.log("WITHIN EXTENT: ", geometryEngine.within(point, extent));
//            return geometryEngine.within(point, extent);
            var within = geometryEngine.within(point, extent);
            if(within){
                return within;
            }
            else{
                alert("Address not located in Norway.");
            }
        }
    };
});