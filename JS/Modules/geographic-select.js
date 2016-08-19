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
      var results = response.results;
      if (results.length < 1){
        console.log("No features found in hit test.");
        return;
      }

      var countyGraphic, cityGraphic, parishGraphic, localParishGraphic;
      var popupGraphics = [];

      results.forEach(function(result){
        var title = result.graphic.layer.title;

        if (title === constants.countyTitle){
          countyGraphic = result.graphic;
          popupGraphics.push(countyGraphic);
        }
        if (title === constants.cityTitle){
          cityGraphic = result.graphic;
          popupGraphics.push(cityGraphic);
        }
        if (title === constants.parishTitle){
          parishGraphic = result.graphic;
          popupGraphics.push(parishGraphic);
        }
        if (title === constants.localParishTitle){
          localParishGraphic = result.graphic;
          popupGraphics.push(localParishGraphic);
        }
      });

      view.popup.open({ features: popupGraphics });

      // If the click occurred outside the selected county
      if (countyGraphic && countyGraphic.attributes.COUNTY !== constants.countydd.value){
        constants.countydd.value = countyGraphic.attributes.COUNTY;

        var cityddSelected = constants.citydd.value.length > 0 || constants.citydd.value;
        var parishddSelected = constants.parishdd.value.length > 0 || constants.parishdd.value;
        var localparishddSelected = constants.localparishdd.value.length > 0 || constants.localparishdd.value;

        countySelect(null, countyGraphic.attributes.COUNTY).then(function(){
          if (cityGraphic && cityddSelected){
            constants.citydd.value = cityGraphic.attributes.MUNICIPALITY;
          }
          if (parishGraphic && parishddSelected){
            constants.parishdd.value = parishGraphic.attributes.NAME;
          }
          if (localParishGraphic && localparishddSelected){
            constants.localparishdd.value = localParishGraphic.attributes.Par_NAME;
          }
        });
      }
      // If the click occurred inside county, but outside municipality
      else if (cityGraphic && cityGraphic.attributes.COUNTY !== constants.citydd.value){
        constants.citydd.value = cityGraphic.attributes.MUNICIPALITY;

        var parishddSelected = constants.parishdd.value.length > 0 || constants.parishdd.value;
        var localparishddSelected = constants.localparishdd.value.length > 0 || constants.localparishdd.value;

        citySelect(null, cityGraphic.attributes.MUNICIPALITY).then(function(){
          if (parishGraphic && parishddSelected){
            constants.parishdd.value = parishGraphic.attributes.NAME;
          }
          if (localParishGraphic && localparishddSelected){
            constants.localparishdd.value = localParishGraphic.attributes.Par_NAME;
          }
        });
      }
      // If the click occurred inside the city, but outside the parish
      else if (parishGraphic && parishGraphic.attributes.NAME !== constants.parishdd.value){
        constants.parishdd.value = parishGraphic.attributes.NAME;

        var localparishddSelected = constants.localparishdd.value.length > 0 || constants.localparishdd.value;

        parishSelect(null, parishGraphic.attributes.NAME).then(function(){
          if (localParishGraphic && localparishddSelected){
            constants.localparishdd.value = localParishGraphic.attributes.Par_NAME;
          }
        });
      }
      // If the click occurred inside the parish, but outside the local parish
      else if (localParishGraphic && localParishGraphic.attributes.NAME !== constants.localparishdd.value){
        constants.localparishdd.value = localParishGraphic.attributes.Par_NAME;
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


  /////////////////////////////////////
  //
  // COUNTY select
  //
  /////////////////////////////////////

  var countySelect = function (evt, name) {

    var county = name ? name : evt.target.value;

    if (!county){
      constants.citydd.options.length = 0;
      constants.parishdd.options.length = 0;
      constants.localparishdd.options.length = 0;
      view.popup.close();
      return;
    }

    var countyLayer = map.layers.find(function(layer){
      return layer.title === constants.countyTitle;
    });

    var qParams = new Query({
      returnGeometry: true,
      where: "COUNTY = '" + county + "' AND " + constants.defExp,
      outFields: [ "BEGIN_", "END_", "COUNTY", "WIKI", "FS_WIKI", "FARMS" ]
    });

    return countyLayer.queryFeatures(qParams)
      .then(function(response){
        // zoom to selection
        if (!name){
          view.goTo(response.features);
          view.popup.open({
            features: response.features
          });
        }

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
  };

  /////////////////////////////////////
  //
  // CITY select
  //
  /////////////////////////////////////

  var citySelect = function (evt, name){
    var city = name ? name : evt.target.value;

    var cityLayer = map.layers.find(function(layer){
      return layer.title === constants.cityTitle;
    });

    var qParams = new Query({
      returnGeometry: true,
      where: "MUNICIPALITY = '" + city + "' AND " + constants.defExp
    });

    return cityLayer.queryFeatures(qParams)
      .then(function(response){
        // zoom to selection
        if (!name){
          view.goTo(response.features);
          view.popup.open({
            features: response.features
          });
        }

        var geom = response.features[0].geometry;

        return {
          node: constants.parishdd,
          geom: geom
        }
      })
      .then(setDropdown)
      .then(setDropdown);
  };


  /////////////////////////////////////
  //
  // PARISH select
  //
  /////////////////////////////////////

  var parishSelect = function (evt, name){

    var parish = name ? name : evt.target.value;
    var parishLayer = map.layers.find(function(layer){
      return layer.title === constants.parishTitle;
    });

    var qParams = new Query({
      returnGeometry: true,
      where: "NAME = '" + parish + "' AND " + constants.defExp
    });

    return parishLayer.queryFeatures(qParams)
      .then(function(response){
        // zoom to selection
        if (!name){
          view.goTo(response.features);
          view.popup.open({
            features: response.features
          });
        }

        var geom = response.features[0].geometry;

        return {
          node: constants.localparishdd,
          geom: geom
        }
      })
      .then(setDropdown);
  };


  /////////////////////////////////////
  //
  // LOCAL PARISH select
  //
  /////////////////////////////////////

  var localParishSelect = function (evt, name) {

    var localParish = name ? name : evt.target.value;
    var localParishLayer = map.layers.find(function(layer){
      return layer.title === constants.localParishTitle;
    });

    var qParams = new Query({
      returnGeometry: true,
      where: "Par_NAME = '" + localParish + "' AND " + constants.defExp
    });

    return localParishLayer.queryFeatures(qParams)
      .then(function(response){
        // zoom to selection
        if (!name){
          view.goTo(response.features);
          view.popup.open({
            features: response.features
          });
        }

        var geom = response.features[0].geometry;

        return {
          geom: geom
        }
      });
  };


  return {
    setDropdown: setDropdown,
    getCentroids: getCentroids,
    countySelect: countySelect,
    citySelect: citySelect,
    parishSelect: parishSelect,
    localParishSelect: localParishSelect
  }
});