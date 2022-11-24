import fs from "fs";
import path from "path";

import fetch from 'node-fetch';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import mongodb from 'mongodb';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import bodyParser from "body-parser";


const app = express();


app.use(bodyParser.json());


/* const urimongo = require("./resources/secret/databaseconfig.js").url; // TODO
 */


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Documentation de l'API ",
            version: "1.0.0",
            description: "Documentation des différentes routes de l'API",
        }
    },
    apis: ['index.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);


app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

app.use(express.static('app'));

const PORT = process.env.PORT || 3000;




app.get('/infos_from_ville/:ville/:r', function(req, response){
	console.log('HELLO2')

	const ville = req.params.ville
	const r = req.params.r

	let loc_ville = fs.readFileSync("loc_ville.json");
	loc_ville = JSON.parse(loc_ville);
	
	var loc_ville_filter = loc_ville.filter(function (result){
        return result.nom == ville;
    });
    
	culture_sport_async(loc_ville_filter[0].lat,loc_ville_filter[0].long,r).then(res =>{ response.send({'lat': loc_ville_filter[0].lat, 'long':loc_ville_filter[0].long, 'culture': res})});


})

function culture_sport_async(lat,long, r){
	var url = 'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=base-des-lieux-et-des-equipements-culturels&q=&rows=500&facet=type_equipement_ou_lieu&facet=label_et_appellation&facet=domaine&facet=sous_domaines&facet=departement&facet=adresse_postale&facet=nom&facet=coordonnees_gps_lat_lon&geofilter.distance='
	
    url = url+""+lat+'%2C'+""+long+'%2C'+"+"+r

	console.log("url: ",url);
	var culture = axios
          .get(url)
          .then(res => {
          	console.log('LENGTH')
          	console.log(res.data['records'].length)
            let data = [];
            res.data['records'].forEach(element =>{
				let temp_dic = {}
				temp_dic['id'] = element['fields']['Code_Insee_EPCI'];
				temp_dic['nom'] = element['fields']['nom'];
				temp_dic['type'] = element['fields']['type_equipement_ou_lieu']
				temp_dic['label_et_appellation'] = element['fields']['label_et_appellation'];
				temp_dic['domaine'] = element['fields']['domaine'];
				temp_dic['s_domaine'] = element['fields']['sous_domaine'];
				temp_dic['departement'] = element['fields']['departement'];
				temp_dic['adresse_postale'] = element['fields']['adresse_postale'];
				temp_dic['lat'] = element['fields']['coordonnees_gps_lat_lon'][0];
				temp_dic['long'] = element['fields']['coordonnees_gps_lat_lon'][1];
				
				data.push(temp_dic)

                });
                return(data);
                
              });
	var url = "https://equipements.sports.gouv.fr/api/records/1.0/search/?dataset=data-es&q=&facet=famille&facet=caract24&facet=caract25&facet=caract74&facet=caract33&facet=caract156&facet=caract159&facet=caract167&facet=caract168&facet=caract169&facet=atlas&facet=nom_region&facet=nom_dept&facet=coordonnees_gps_lat_lon&geofilter.distance="	

	url = url+""+lat+'%2C'+""+long+'%2C'+"+"+r

	/* var sport = axios
		.get(url)
		.then(res => {
			let data = [];
			res.data['records'].forEach(element =>{
					let temp_dic = {}
					temp_dic['type'] = element['fields']['carac168'];
					temp_dic['type_equipement'] = element['fields']['typeequipement']
					temp_dic['nom_installation'] = element['fields']['nominstallation'];
					temp_dic['famille'] = element['fields']['famille'];
					temp_dic['departement'] = element['fields']['nom_dept'];
					temp_dic['code_postale'] = element['fields']['codepostal'];
					temp_dic['adresse'] = element['fields']['adresse'];

					data.push(temp_dic)

				});
				return(data);
				
			}); */
	
	return(culture)

	
}

app.get('/culture_async/:long/:lat/:r', function(req, response){
	const long = req.params.long
	const lat = req.params.lat
	const r = req.params.r
	
	
	var url = 'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=base-des-lieux-et-des-equipements-culturels&q=&facet=type_equipement_ou_lieu&facet=label_et_appellation&facet=domaine&facet=sous_domaines&facet=departement&facet=adresse_postale&facet=nom&facet=coordonnees_gps_lat_lon&geofilter.distance='
	

    url = url+""+long+'%2C'+""+lat+'%2C'+"+"+r

	console.log("url: ",url);
	axios
          .get(url)
          .then(res => {
            let data = [];
            res.data['records'].forEach(element =>{
				let temp_dic = {}
				temp_dic['id'] = element['fields']['Code_Insee_EPCI'];
				temp_dic['nom'] = element['fields']['nom'];
				temp_dic['type'] = element['fields']['type_equipement_ou_lieu']
				temp_dic['label_et_appellation'] = element['fields']['label_et_appellation'];
				temp_dic['domaine'] = element['fields']['domaine'];
				temp_dic['s_domaine'] = element['fields']['sous_domaine'];
				temp_dic['departement'] = element['fields']['departement'];
				temp_dic['adresse_postale'] = element['fields']['adresse_postale'];
				data.push(temp_dic)

                });
                response.send(data);
                
              });


})

app.get('/sport_async/:long/:lat/:r', function(req, response){

	const long = req.params.long
	const lat = req.params.lat
	const r = req.params.r
	
	
	var url = "https://equipements.sports.gouv.fr/api/records/1.0/search/?dataset=data-es&q=&facet=famille&facet=caract24&facet=caract25&facet=caract74&facet=caract33&facet=caract156&facet=caract159&facet=caract167&facet=caract168&facet=caract169&facet=atlas&facet=nom_region&facet=nom_dept&facet=coordonnees_gps_lat_lon&geofilter.distance="	

    url = url+""+long+'%2C'+""+lat+'%2C'+"+"+r

	axios
          .get(url)
          .then(res => {
            let data = [];
            res.data['records'].forEach(element =>{
                    let temp_dic = {}
                    temp_dic['type'] = element['fields']['carac168'];
                    temp_dic['type_equipement'] = element['fields']['typeequipement']
                    temp_dic['nom_installation'] = element['fields']['nominstallation'];
                    temp_dic['famille'] = element['fields']['famille'];
                    temp_dic['departement'] = element['fields']['nom_dept'];
                    temp_dic['code_postale'] = element['fields']['codepostal'];
                    temp_dic['adresse'] = element['fields']['adresse'];

                    data.push(temp_dic)

                });
                response.send(data);
                
              });

})



app.get('/home', function(req, response){
	fs.promises.readFile("app/templates/index2.html")
        .then(contents => {
            response.setHeader("Content-Type", "text/html");
            response.writeHead(200);
            response.end(contents);
        })
})


app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})




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


