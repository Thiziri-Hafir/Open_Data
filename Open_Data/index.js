import fs from "fs";
import path from "path";

import fetch from 'node-fetch';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import bodyParser from "body-parser";

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb+srv://opendata:azertymiashs@open-data.7jjwuga.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var collection;

// Swagger ingtegration
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');


app.use(express.static('app'));

const PORT = process.env.PORT || 3000;


app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})


app.get('/home', function(req, response){
	fs.promises.readFile("app/templates/index2.html")
        .then(contents => {
            response.setHeader("Content-Type", "text/html");
            response.writeHead(200);
            response.end(contents);
        })
})

app.get('/infos_from_ville/:ville/:r/:nbresults', function(req, response){
	console.log('HELLO2')

	const ville = req.params.ville
	const r = req.params.r
	const nbresults = req.params.nbresults

	let loc_ville = fs.readFileSync("loc_ville.json");
	loc_ville = JSON.parse(loc_ville);
	
	var loc_ville_filter = loc_ville.filter(function (result){
        return result.nom == ville;
    });
    
	Promise.all(culture_sport_async(loc_ville_filter[0].lat,loc_ville_filter[0].long,r,nbresults)).then(res =>{ response.send({'lat': loc_ville_filter[0].lat, 'long':loc_ville_filter[0].long, 'results': res})});


})

function culture_sport_async(lat,long, r, nbresults){
	console.log('ADDNOTE')
	// executeStudentCrudOperations()

	var url = 'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=base-des-lieux-et-des-equipements-culturels&q=&rows='+nbresults+'&facet=type_equipement_ou_lieu&facet=label_et_appellation&facet=domaine&facet=sous_domaines&facet=departement&facet=adresse_postale&facet=nom&facet=coordonnees_gps_lat_lon&geofilter.distance='
	
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
				temp_dic['id'] = element['recordid'];
				temp_dic['nom'] = element['fields']['nom'];
				temp_dic['type'] = element['fields']['type_equipement_ou_lieu']
				temp_dic['famille'] = element['fields']['domaine'];
				temp_dic['departement'] = element['fields']['departement'];
				temp_dic['code_postal'] = element['fields']['code_postal']
				temp_dic['adresse'] = element['fields']['adresse_postale'];
				temp_dic['lat'] = element['fields']['coordonnees_gps_lat_lon'][0];
				temp_dic['long'] = element['fields']['coordonnees_gps_lat_lon'][1];
				
				data.push(temp_dic)

                });
                return(data);
                
              });
	var url = "https://equipements.sports.gouv.fr/api/records/1.0/search/?dataset=data-es&rows="+nbresults+"&q=&facet=famille&facet=caract24&facet=caract25&facet=caract74&facet=caract33&facet=caract156&facet=caract159&facet=caract167&facet=caract168&facet=caract169&facet=atlas&facet=nom_region&facet=nom_dept&facet=coordonnees_gps_lat_lon&geofilter.distance="	

	url = url+""+lat+'%2C'+""+long+'%2C'+"+"+r
	console.log(url)

	 var sport = axios
		.get(url)
		.then(res => {
			let data = [];
			res.data['records'].forEach(element =>{
					let temp_dic = {}
					temp_dic['id'] = element['recordid']
					temp_dic['type'] = element['fields']['typequipement'];
					temp_dic['nom'] = element['fields']['nominstallation'];
					temp_dic['famille'] = element['fields']['famille'];
					temp_dic['departement'] = element['fields']['nom_dept'];
					temp_dic['code_postal'] = element['fields']['codepostal'];
					temp_dic['adresse'] = element['fields']['adresse'];
					temp_dic['lat'] = element['fields']['coordonnees'][0]
					temp_dic['long'] = element['fields']['coordonnees'][1]
					data.push(temp_dic)

				});
				return(data);
				
			}); 
	
  return([culture, sport]);

	
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


app.get("/get_avis/:id", (request, response) => {
		const id = request.params.id
    client.connect(err => {
		  collection = client.db("opendata").collection("interest_point_notation").find({"id":id}).toArray(function(err, docs){
			    if (err) throw err;
			    response.send(docs);
			 });
		});
});

app.post("/add_avis", (request, response) => {
    client.connect(err => {
		  collection = client.db("opendata").collection("interest_point_notation").insertOne(request.body, function (err, result) {
	      if (err) {
	        response.status(400).send("Error inserting matches!");
	      } else {
	        console.log(`Added a new match with id ${result.insertedId}`);
	        response.status(204).send();
	      }
	    });
	});
  });


  app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
