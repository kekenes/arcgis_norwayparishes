define([
  "esri/request",
  "esri/config",
  "esri/geometry/Point",
  "esri/Graphic",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/tasks/support/ProjectParameters",
  "esri/tasks/GeometryService",
  "esri/geometry/SpatialReference",
  "projection/proj4"
], function(
  esriRequest, esriConfig,
  Point, Graphic, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol,
  ProjectParameters, GeometryService, SpatialReference, proj4
){

  // service urls
  var gs = new GeometryService({
    url: "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
  });
  esriConfig.request.proxyUrl = "../proxy/PHP/proxy.php";
  esriConfig.request.corsEnabledServers.push("https://ws.geonorge.no/SKWS3Index/ssr/sok");

  function round (num, places){
    var factor = Math.pow(10, places);
    return Math.round(num * factor) / factor;
  }

  function project (x, y){
    var EPSG_25833 = 'PROJCS["ETRS_1989_UTM_Zone_33N",GEOGCS["GCS_ETRS_1989",DATUM["D_ETRS_1989",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",15.0],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]';

    var WebMercator =  'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]';

    return proj4(EPSG_25833, WebMercator, { x: x, y: y });
  }

  return {
    test: function(){
      return "this is a test";
    },

    search: function(propertyName, geoFilter){

      if(propertyName.length < 1){
        alert("You must enter a property name to perform this operation.");
      }

      ///////////////////////////////////////
      //
      // FeatureLayer schema
      //
      ///////////////////////////////////////

      var fields = [
        { name: "ObjectID", alias: "ObjectID", type: "short" },
        { name: "x", alias: "easting", type: "double" },
        { name: "y", alias: "northing", type: "double" },
        { name: "lon", alias: "longitude", type: "double" },
        { name: "lat", alias: "latitude", type: "double" },
        { name: "name", alias: "name", type: "string" },
        { name: "ssrId", alias: "ssrId", type: "double" },
        { name: "status", alias: "status", type: "string" },
        { name: "propertyName", alias: "Property Name", type: "string" },
        { name: "type", alias: "Property Type", type: "double" },
        { name: "municipality", alias: "Municipality", type: "string" },
        { name: "county", alias: "County", type: "string" },
        { name: "wkid", alias: "wkid", type: "string" }
      ];

      var popupTemplate = {
        title: "{name}",
        content: "Name: {name}<br>"
          + "{municipality}, {county}<br>"
          + "Coordinates: {lat}° N, {lon}° E",
        actions: [{
          title: "Fact Sheet",
          id: "fact-sheet"
        }]
      };

      var renderer = new SimpleRenderer({
        symbol: new SimpleMarkerSymbol({
          style: "circle",
          size: 6,
          color: "blue",
          outline: {
            size: 10,
            color: [ 0, 0, 255, 0.5 ]
          }
        }),
        label: "Properties"
      });

      // exampleRequestUrl => "https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=Ask*&maxAnt=50&tilSosiKoordSyst=4258&fylkeKommuneListe=605,612&eksakteForst=true";

      // Construct request url

      var baseUrl = "https://ws.geonorge.no/SKWS3Index/ssr/sok";
      var graphics;

      return esriRequest(baseUrl, {
        responseType: "xml",
        query: {
          navn: propertyName
        }
      }).then(function(response){

        var xmlResponse = response.data;
        var jsonResponse = xmlToJSON.parseXML(xmlResponse);
        var rawResults = jsonResponse.sokRes[0].stedsnavn;

        if(!rawResults){
          console.log("no raw results");
          return 0;
        }
        start = performance.now();
       /* graphics =*/ return rawResults.map(function(item, i){
          var att = {};
          att.ObjectId = i++;
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


          var geoCoords = project(att.x, att.y);

          console.log(geoCoords);

          var geom = new Point({
            x: geoCoords.x,
            y: geoCoords.y,
            spatialReference: { wkid: 3857 }
          });

          att.lon = round(geom.longitude, 6);
          att.lat = round(geom.latitude, 6);

//          var geom = new Point({
//            x: att.x,
//            y: att.y,
//            spatialReference: { wkid: att.wkid }
//          });

          return new Graphic({
            attributes: att,
            geometry: geom
          });
        });
//        console.log("performance: ", performance.now() - start);
//        console.log("graphics: ", graphics);
//        return graphics;

//        var projectParams = new ProjectParameters({
//          outSR: new SpatialReference({ wkid: 3857 }),
//          // ETRS_1989_To_WGS_1984
//          transformation: { wkid: 1149 },
//          transformForward: true,
//          geometries: graphics.map(function(graphic, i){
//            return graphic.geometry;
//          })
//        });
//
//        start = performance.now();
//
//        return gs.project(projectParams);
//      }).then(function(response){
//        console.log("project time: ", performance.now() - start);
//
//        var properties = [];
//        response.forEach(function(geom, i){
//          graphics[i].geometry = geom;
//          graphics[i].attributes.lon = round(geom.longitude, 6);
//          graphics[i].attributes.lat = round(geom.latitude, 6);
//
//          if (geoFilter){
//            if (geoFilter.contains(geom)){
//              properties.push(graphics[i]);
//            }
//          } else {
//            properties.push(graphics[i]);
//          }
//
//        });
//        return properties;
      }).then(function(features){
        console.log("performance: ", performance.now() - start);
        console.log("features: ", features);
        return new FeatureLayer({
          title: "Property results",
          fields: fields,
          outFields: ["*"],
          objectIdField: "ObjectID",
          geometryType: "point",
          spatialReference: { wkid: 3857 },
          source: features,
          renderer: renderer,
          popupTemplate: popupTemplate
        }).load();

      });
    },

    // execute when popup action is selected
    getFactSheet: function (id) {
      var baseUrl = "http://faktaark.statkart.no/SSRFakta/faktaarkfraobjektid?enhet=";
      var ssrId = id;

      var requestUrl = baseUrl + ssrId;
      window.open(requestUrl);
    },

    withinExtent: function(point, extent){
      var within = extent.contains(point);
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