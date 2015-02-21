define(["dojo/_base/declare"],
        function(declare){

return declare(null, {
  
  references: [
      {
        "name": "Akershus",
        "count": 0,
        "parish_file": "Akershus.js",
        "parish_data": "Akershus_parishes",
        "municipal_file": "Akershus.js",
        "municipal_data": "Akershus_muni"
      },
      {
        "name": "Aust-Agder",
        "count": 0,
        "parish_file": "Aust_Agder.js",
        "parish_data": "Aust_Agder_parishes",
        "municipal_file": "Aust_Agder.js",
        "municipal_data": "Aust_Agder_muni"
      },
      {
        "name": "Buskerud",
        "count": 0,
        "parish_file": "Buskerud.js",
        "parish_data": "Buskerud_parishes",
        "municipal_file": "Buskerud.js",
        "municipal_data": "Buskerud_muni"
      },
      {
        "name": "Finnmark",
        "count": 0,
        "parish_file": "Finnmark.js",
        "parish_data": "Finnmark_parishes",
        "municipal_file": "Finnmark.js",
        "municipal_data": "Finnmark_muni",
        
      },
      {
        "name": "Hedmark",
        "count": 0,
        "parish_file": "Hedmark.js",
        "parish_data": "Hedmark_parishes",
        "municipal_file": "Hedmark.js",
        "municipal_data": "Hedmark_muni"
      },
      {
        "name": "Hordaland",
        "count": 0,
        "parish_file": "Hordaland.js",
        "parish_data": "Hordaland_parishes",
        "municipal_file": "Hordaland.js",
        "municipal_data": "Hordaland_muni"
      },
      {
        "name": "Møre og Romsdal",
        "count": 0,
        "parish_file": "More_og_Romsdal.js",
        "parish_data": "More_og_Romsdal_parishes",
        "municipal_file": "More_og_Romsdal.js",
        "municipal_data": "More_og_Romsdal_muni"
      },
      {
        "name": "Nord-Trøndelag",
        "count": 0,
        "parish_file": "Nord_Trondelag.js",
        "parish_data": "Nord_Trondelag_parishes",
        "municipal_file": "Nord_Trondelag.js",
        "municipal_data": "Nord_Trondelag_muni"
      },
      {
        "name": "Nordland",
        "count": 0,
        "parish_file": "Nordland.js",
        "parish_data": "Nordland_parishes",
        "municipal_file": "Nordland.js",
        "municipal_data": "Nordland_muni"
      },
      {
        "name": "Oppland",
        "count": 0,
        "parish_file": "Oppland.js",
        "parish_data": "Oppland_parishes",
        "municipal_file": "Oppland.js",
        "municipal_data": "Oppland_muni"
      },
      {
        "name": "Oslo",
        "count": 0,
        "parish_file": "Oslo.js",
        "parish_data": "Oslo_parishes",
        "municipal_file": "Oslo.js",
        "municipal_data": "Oslo_muni"
      },
      {
        "name": "Rogaland",
        "count": 0,
        "parish_file": "Rogaland.js",
        "parish_data": "Rogaland_parishes",
        "municipal_file": "Rogaland.js",
        "municipal_data": "Rogaland_muni"
      },
      {
        "name": "Sogn og Fjordane",
        "count": 0,
        "parish_file": "Sogn_og_Fjordane.js",
        "parish_data": "Sogn_og_Fjordane_parishes",
        "municipal_file": "Sogn_og_Fjordane.js",
        "municipal_data": "Sogn_og_Fjordane_muni"
      },
      {
        "name": "Sør-Trøndelag",
        "count": 0,
        "parish_file": "Sor_Trondelag.js",
        "parish_data": "Sor_Trondelag_parishes",
        "municipal_file": "Sor_Trondelag.js",
        "municipal_data": "Sor_Trondelag_muni"
      },
      {
        "name": "Telemark",
        "count": 0,
        "parish_file": "Telemark.js",
        "parish_data": "Telemark_parishes",
        "municipal_file": "Telemark.js",
        "municipal_data": "Telemark_muni"
      },
      {
        "name": "Troms",
        "count": 0,
        "parish_file": "Troms.js",
        "parish_data": "Troms_parishes",
        "municipal_file": "Troms.js",
        "municipal_data": "Troms_muni"
      },
      {
        "name": "Vest-Agder",
        "count": 0,
        "parish_file": "Vest_Agder.js",
        "parish_data": "Vest_Agder_parishes",
        "municipal_file": "Vest_Agder.js",
        "municipal_data": "Vest_Agder_muni"
      },
      {
        "name": "Vestfold",
        "count": 0,
        "parish_file": "Vestfold.js",
        "parish_data": "Vestfold_parishes",
        "municipal_file": "Vestfold.js",
        "municipal_data": "Vestfold_muni"
      },
      {
        "name": "Østfold",
        "count": 0,
        "parish_file": "Ostfold.js",
        "parish_data": "Ostfold_parishes",
        "municipal_file": "Ostfold.js",
        "municipal_data": "Ostfold_muni"
      }      
  ],
  
  countyList: function(){
    var items = [];
    for(i=0; i < this.references.length; i++) {
      items.push(this.references[i].name);
    }
      items.sort();
      return items;
  },
    
  countySelection: function(county){
    for(i in this.references){
      if(this.references[i].name == county){
        return i;
        break;
      }
    }
  }
    
});

});
       