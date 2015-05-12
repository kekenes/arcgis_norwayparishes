define([
    "dojo/request",
    "esri/request"
], function(request, esriRequest){
    
    return {
        test: function(){
            console.log("this is a test");
        },
        
        search: function(propertyName){
            var exampleRequestUrl = "https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=Ask*&maxAnt=50&tilSosiKoordSyst=4258&fylkeKommuneListe=605,612&eksakteForst=true";
            
            var baseUrl = "https://ws.geonorge.no/SKWS3Index/ssr/sok?";
            var paramName = "navn=";
            var requestUrl = baseUrl + paramName + propertyName;
            
            console.log("request url: ", requestUrl);
            
//            request(requestUrl, {
//                handleAs: "xml"
//            }).then(function(response){
//                console.log("search response: ", response);
//            });
            
            esriRequest({
                url: requestUrl,
                handleAs: "xml"
            }, {
                useProxy: true
            }).then(function(response){
                console.log("request response: ", response);
            });
            
        }
    };
});