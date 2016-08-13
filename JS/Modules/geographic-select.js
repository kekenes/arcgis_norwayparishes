define([
  "esri/tasks/support/Query",
  "modules/constants",
  "esri/tasks/support/FeatureSet",
  "esri/request",
  "dojo/on",
  "dojo/dom-construct",
], function(
  Query, constants, FeatureSet, esriRequest, on, domConstruct
){

  var map, view;

  var countyJsonUrl = "../json/fylke_centroids.json";
  var cityJsonUrl = "../json/herred_centroids.json";
  var parishJsonUrl = "../json/prestegjeld_centroids.json";
  var localParishJsonUrl = "../json/sokn_centroids.json";

//  var COUNTYLYR, CITYLYR, PARISHLYR, LOCALPARISHLYR;
  var COUNTYPTS, CITYPTS, PARISHPTS, LOCALPARISHPTS;

  // Reset dropdowns when user clicks a feature

  //
  // works from top down but also needs to work from bottom up
  // if user clicks local parish outside of county of current
  // selection, then the upper dropdowns need to be set accordingly
  //
  var clickToSelect = function (evt) {

    var screenPoint = evt.screenPoint;
    view.hitTest(screenPoint).then(function(response){
      var graphic = response.results[0].graphic;
      var att = graphic.attributes;
      var layerTitle = graphic.layer.title;

      if (layerTitle === constants.countyTitle){
        constants.countydd.value = att.COUNTY;
        var parOpts = setDropdown({
          node: constants.citydd,
          geom: graphic.geometry
        });
        var locParOpts = setDropdown(parOpts);
        setDropdown(locParOpts);
      }
      if (layerTitle === constants.cityTitle){
        constants.citydd.value = att.MUNICIPALITY;
        var locParOpts = setDropdown({
          node: constants.parishdd,
          geom: graphic.geometry
        });
        setDropdown(locParOpts);
      }
      if (layerTitle === constants.parishTitle){
        constants.parishdd.value = att.NAME;
        setDropdown({
          node: constants.localparishdd,
          geom: graphic.geometry
        });
      }
      if (layerTitle === constants.localParishTitle){
        constants.localparishdd.value = att.Par_NAME;
      }
    });
  }

  var getCentroids = function (v) {
    map = v.map;
    view = v;

    console.log("GET CENTROIDS!");

    on(view, "click", clickToSelect);

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
          node: constants.countydd
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
    var geom = opts.geom;

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
        return layer.title === constants.countyTitle;
      });

      var qParams = new Query({
        returnGeometry: true,
        where: "COUNTY = '" + county + "' AND " + constants.defExp,
        outFields: [ "BEGIN_", "END_", "COUNTY", "WIKI", "FS_WIKI", "FARMS" ]
      });

      countyLayer.queryFeatures(qParams)
        .then(function(response){
          console.log("county select response: ", response.features);
          // zoom to selection
          view.goTo(response.features);

          var geom = response.features[0].geometry;
          view.popup.open({
            features: response.features
          });
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
        return layer.title === constants.cityTitle;
      });

      var qParams = new Query({
        returnGeometry: true,
        where: "MUNICIPALITY = '" + city + "' AND " + constants.defExp
      });

      cityLayer.queryFeatures(qParams)
        .then(function(response){
          console.log(response);
          var geom = response.features[0].geometry;

          view.popup.open({
            features: response.features
          });

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
        return layer.title === constants.parishTitle;
      });

      var qParams = new Query({
        returnGeometry: true,
        where: "NAME = '" + parish + "' AND " + constants.defExp
      });

      parishLayer.queryFeatures(qParams)
        .then(function(response){
          // zoom to selection
          view.goTo(response.features);
          console.log(response);

          var geom = response.features[0].geometry;

          view.popup.open({
            features: response.features
          });

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
        return layer.title === constants.localParishTitle;
      });

      var qParams = new Query({
        returnGeometry: true,
        where: "Par_NAME = '" + localParish + "' AND " + constants.defExp
      });

      localParishLayer.queryFeatures(qParams)
        .then(function(response){
          // zoom to selection
          view.goTo(response.features);
          console.log(response);

          var geom = response.features[0].geometry;

          view.popup.open({
            features: response.features
          });

          return {
            geom: geom
          }
        });
    }
  }
});