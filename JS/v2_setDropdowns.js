//function setDropdownContent(layer){
//  var dropdownQuery = new L.esri.Tasks.Query(layer);
// var results = dropdownQuery.where("COUNTY in (SELECT COUNTY FROM County_Boundaries GROUP BY COUNTY HAVING COUNT(COUNTY)=1)");
//    console.log("query results: ", results);
//}