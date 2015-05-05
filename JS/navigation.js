require([
    "dojo/on",
    "dojo/dom",
    "dojo/request",
    "dojo/domReady!"
], function(on, dom, request){

    on(dom.byId("aboutNav"), "click", function(){
        request("./about_v2.html").then(function(content){
          console.log("About content: ", content);
        });
    });
    
});