define([], function(){
    
    return {
      compare: function(municipality, county){ 
        var wikiUrl = "http://en.wikipedia.org/wiki/" + municipality;
          
        var commonNames = ["Moss", "Marker", "Ski", "Lom", "Gran", "Hole", "Gol", "Nome", "Lund", "Time", "Strand", "Sund", "Flora", "Luster", "Eid", "Rissa", "Roan", "Leka", "Grane", "Rana", "Berg", "Alta", "Tana", "Haram", "Strand"];
        
        var duplicateNames = ["Nes", "Os", "Vang", "Sande", "Hof", "Sula", "Herøy", "Bø"];
          
        commonNames.forEach(function(item, i){
          if(municipality === item)
            wikiUrl = "http://en.wikipedia.org/wiki/" + municipality + ",_Norway";
        });
          
        duplicateNames.forEach(function(item, i){
          if(municipality === item)
            wikiUrl = "http://en.wikipedia.org/wiki/" + municipality + ",_" + county;
        });  

        return wikiUrl;
      }
    };
});