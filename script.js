const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mongodb = require('mongodb');
const urimongo = require("./resources/secret/databaseconfig.js").url; // TODO
var cors = require('cors');


var ville =  function search() {return document.getElementById("ville") }


function postPoll(idwin, idloose) {
    var body = {win:idwin, loose:idloose};
    var urlpoll = "/poll";
    fetch(urlpoll, {  method:'POST', 
                      body: JSON.stringify(body)  ,
                      headers:{'Content-Type': 'application/json'}, 
                      mode:"cors", 
                      cache:'default'}).then(
        function(response){ 
            window.location.reload();
        })
}


app.post("/poll", cors(), function (request, response) {
    //récupérer les données de la requête
    var body = request.body;
    //pousser en base de données
    mongodb.MongoClient.connect(urimongo, { useUnifiedTopology: true }, function (err, client) {
        if (err) console.log("error", err);
        else {
            try {client.db("otakuotake").collection("poll").insertOne(body);}
             catch(error) {
                throw err;
             }
        }
    }); 
})

//var csv is the CSV file with headers
function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

    var obj = {};
    var currentline=lines[i].split(",");

    for(var j=0;j<headers.length;j++){
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);

  }
  
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}



var slider = document.getElementById("radius");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
} 