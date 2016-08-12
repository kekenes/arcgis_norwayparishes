define([
  "esri/tasks/support/Query",
  "Modules/constants",
  "esri/tasks/support/FeatureSet",
  "esri/request",
  "dojo/dom-construct",
], function(
  Query, constants, FeatureSet, esriRequest, domConstruct
){

  var map;

  var countyJsonUrl = "../json/fylke_centroids.json";
  var cityJsonUrl = "../json/herred_centroids.json";
  var parishJsonUrl = "../json/prestegjeld_centroids.json";
  var localParishJsonUrl = "../json/sokn_centroids.json";

  var COUNTYLYR, CITYLYR, PARISHLYR, LOCALPARISHLYR;
  var COUNTYPTS, CITYPTS, PARISHPTS, LOCALPARISHPTS;

  var getCentroids = function (m) {
    map = m;
    return esriRequest(countyJsonUrl)
      .then(function(response){
        var fs = FeatureSet.fromJSON(response.data);
        COUNTYPTS = fs.features;

        return esriRequest(cityJsonUrl);
      })
      .then(function(response){
        var fs = FeatureSet.fromJSON(response.data);
        CITYPTS = fs.features;

        return esriRequest(parishJsonUrl);
      })
      .then(function(response){
        var fs = FeatureSet.fromJSON(response.data);
        PARISHPTS = fs.features;

        return esriRequest(localParishJsonUrl);
      })
      .then(function(response){
        var fs = FeatureSet.fromJSON(response.data);
        LOCALPARISHPTS = fs.features;

        return setDropdown({
          node: constants.countydd,
          layer: map.layers.find(function(layer){
            return layer.title === "Norge_boundaries - fylke";
          })
        });
      });
  }

  /////////////////////////////////////
  //
  // Generic Set dropdown method
  //
  /////////////////////////////////////

  var setDropdown = function (opts) {
    var node = opts.node;
    var layer = opts.layer;
    var geom = opts.geom;

    console.log("setDropdown: ", node, layer, map, geom);

    var nextNode;

    var options = [""];

    // reset dropdown if already populated with options
    node.options.length = 0;

    if (node.id === "fylke-select"){
      COUNTYPTS.forEach(function(county, i){
        var atts = county.attributes;
        if (atts.BEGIN <= constants.year && atts.END > constants.year){
          options.push(atts.COUNTY);
        }
      });

      nextNode = constants.citydd;
    }

    if (node.id === "herred-select"){
      CITYPTS.forEach(function(city, i){
        var atts = city.attributes;
        if ((atts.BEGIN <= constants.year && atts.END > constants.year) && geom.contains(city.geometry)){
          options.push(atts.MUNICIPALITY);
        }
      });

      nextNode = constants.parishdd;
    }

    if (node.id === "prestegjeld-select"){
      PARISHPTS.forEach(function(parish, i){
        var atts = parish.attributes;
        if ((atts.BEGIN <= constants.year && atts.END > constants.year) && geom.contains(parish.geometry)){
          options.push(atts.NAME);
        }
      });

      nextNode = constants.localparishdd;
    }

    if (node.id === "sokn-select"){
      LOCALPARISHPTS.forEach(function(parish, i){
        var atts = parish.attributes;
        if ((atts.BEGIN <= constants.year && atts.END > constants.year) && geom.contains(parish.geometry)){
          options.push(atts.Par_NAME);
        }
      });
    }

    options.sort();
    options.forEach(function(item, i){
      var option = domConstruct.create("option");
      option.text = item;
      node.add(option);
    });

    return {
      node: nextNode,
      geom: geom
    };
  }




  return {

    setDropdown: setDropdown,

    getCentroids: getCentroids,

    /////////////////////////////////////
    //
    // COUNTY select
    //
    /////////////////////////////////////

    countySelect: function (evt) {

      var county = evt.target.value;
      var countyLayer = map.layers.find(function(layer){
        return layer.title === "Norge_boundaries - fylke";
      });

      var qParams = new Query({
        returnGeometry: true,
        where: "COUNTY = '" + county + "' AND " + constants.defExp
      });

      countyLayer.queryFeatures(qParams)
        .then(function(response){
          console.log("county select response: ", response.features);
          var geom = response.features[0].geometry;
          return {
            node: constants.citydd,
            geom: geom
          }
        }, function(err){
          console.error("There was an error performing the query: ", err);
        })
        .then(setDropdown)
        .then(setDropdown)
        .then(setDropdown);
    },

    /////////////////////////////////////
    //
    // CITY select
    //
    /////////////////////////////////////

    citySelect: function (evt){
      var city = evt.target.value;

      var cityLayer = map.layers.find(function(layer){
        return layer.title === "Norge_boundaries - herred";
      });

      var qParams = new Query({
        returnGeometry: true,
        where: "MUNICIPALITY = '" + city + "' AND " + constants.defExp
      });

      cityLayer.queryFeatures(qParams)
        .then(function(response){
          console.log(response);
          var geom = response.features[0].geometry;
          return {
            node: constants.parishdd,
            geom: geom
          }
        })
        .then(setDropdown)
        .then(setDropdown);
    },

    /////////////////////////////////////
    //
    // PARISH select
    //
    /////////////////////////////////////

    parishSelect: function (evt){

      var parish = evt.target.value;
      var parishLayer = map.layers.find(function(layer){
        return layer.title === "Norge_boundaries - prestegjeld";
      });

      var qParams = new Query({
        returnGeometry: true,
        where: "NAME = '" + parish + "' AND " + constants.defExp
      });

      parishLayer.queryFeatures(qParams)
        .then(function(response){
          console.log(response);
          var geom = response.features[0].geometry;
          return {
            node: constants.localparishdd,
            geom: geom
          }
        })
        .then(setDropdown);
    },

    /////////////////////////////////////
    //
    // LOCAL PARISH select
    //
    /////////////////////////////////////

    localParishSelect: function (evt) {

      var localParish = evt.target.value;
      var localParishLayer = map.layers.find(function(layer){
        return layer.title === "Norge_boundaries - sokn";
      });

      var qParams = new Query({
        returnGeometry: true,
        where: "Par_NAME = '" + localParish + "' AND " + constants.defExp
      });

      localParishLayer.queryFeatures(qParams)
        .then(function(response){
          console.log(response);
          var geom = response.features[0].geometry;
          return {
            geom: geom
          }
        });
    }
  }
});