define([
  "dojo/dom",
  "dojo/domReady!"
], function(
  dom
){

  var year = dom.byId("year").value;

  return {
    countydd: dom.byId("fylke-select"),
    citydd: dom.byId("herred-select"),
    parishdd: dom.byId("prestegjeld-select"),
    localparishdd: dom.byId("sokn-select"),
    year: year,
    defExp: "BEGIN_ <= " + year + " AND END_ > " + year,

    countyTitle: "Norge_boundaries - fylke",
    cityTitle: "Norge_boundaries - herred",
    parishTitle: "Norge_boundaries - prestegjeld",
    localParishTitle: "Norge_boundaries - sokn"
  };

});