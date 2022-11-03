/* "use strict";

// const express= require('express');

// import https from "https";
// import fs from "fs";
// import path from "path";
// import xlsx from "node-xlsx";

// import fetch from 'node-fetch';
// import axios from 'axios';
// import express from 'express';


const axios = require('axios')
const express = require('express')
const request = require('request')
const fs = require('fs')
const XLSX = require('xlsx');
const puppeteer = require('puppeteer')
const scrap = require('./scrap')
const aide = require('./aide')
const chomage = require('./chomage')
const dep_reg = require('./dep_reg')
const reg_code = require('./reg_code')



const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const app = express();

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

const swaggerDocs = swaggerJsDoc(swaggerOptions);


app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));


const PORT = process.env.PORT || 3000;

 */

/* 
try {
  if (!fs.existsSync('./data/lycee.json')) {
  	scrap.scrap(function(data){
  		const return_json = JSON.stringify(data);

			// write JSON string to a file
			fs.writeFile('./data/lycee.json', return_json, (err) => {
			    if (err) {
			        throw err;
			    }
			    console.log("JSON data is saved.");
			});
  	})
  }
} catch(err) {
  console.error(err)
}
 */
/* 
try {
  if (!fs.existsSync('./data/dep_reg.json')) {
  	dep_reg.dep_reg(function(data){
  		const return_json = JSON.stringify(data);

			// write JSON string to a file
			fs.writeFile('./data/dep_reg.json', return_json, (err) => {
			    if (err) {
			        throw err;
			    }
			    console.log("JSON data is saved.");
			});
  	})
  }
} catch(err) {
  console.error(err)
}
 */
/* try {
  if (!fs.existsSync('./data/reg_code.json')) {
  	reg_code.reg_code(function(data){
  		const return_json = JSON.stringify(data);

			// write JSON string to a file
			fs.writeFile('./data/reg_code.json', return_json, (err) => {
			    if (err) {
			        throw err;
			    }
			    console.log("JSON data is saved.");
			});
  	})
  }
} catch(err) {
  console.error(err)
}
 */




/* app.get('/', function(req, response){
	console.log('hello');
	response.send('bienvenue sur mon serveur');
})
 */

/**
 * @swagger
 * /dep_reg:
 *   get:
 *     description: Retourne la liste des departements avec leurs regions
 *     responses:
 *       200:
 *         description: Success
 *
 */

/* app.get('/dep_reg', function(req, response){
	fs.readFile('./data/dep_reg.json', 'utf-8', (err, data) => {
	    if (err) {
	        throw err;
	    }
	    // parse JSON object
	    const dep_reg = JSON.parse(data.toString());

	    // print JSON object
	    response.send(dep_reg);
	});




	});

 */

  /**
   * @swagger
   * /reg_code:
   *   get:
   *     description: Retourne la liste des regions avec leurs codes
   *     responses:
   *       200:
   *         description: Success
   *
   */

/* 
	app.get('/reg_code', function(req, response){
		fs.readFile('./data/reg_code.json', 'utf-8', (err, data) => {
		    if (err) {
		        throw err;
		    }
		    // parse JSON object
		    const reg_code = JSON.parse(data.toString());

		    // print JSON object
		    response.send(reg_code);
		});
	});
	 */

    /**
     * @swagger
     * /classementslycees:
     *   get:
     *     description: Retourne la liste des lycee avec leurs departements ainsi que leurs moyennes du Bac
     *     responses:
     *       200:
     *         description: Success
     *
     */
/* 
app.get('/classementslycees', function(req, response){
	fs.readFile('./data/lycee.json', 'utf-8', (err, data) => {
	    if (err) {
	        throw err;
	    }
	    // parse JSON object
	    const allLycee = JSON.parse(data.toString());

	    // print JSON object
	    response.send(allLycee);
	});
}) */

/**
 * @swagger
 * /aide_territoire:
 *   get:
 *     description: Retourne la population totale de chaque region
 *     responses:
 *       200:
 *         description: Success
 *
 */

/* app.get('/aide_territoire', function(req, response){
	aide.aide_async(function(data) {response.send(data)});
})
 */
/**
 * @swagger
 * /chomage:
 *   get:
 *     description: Retourne le taux de chomage pour chaque region
 *     responses:
 *       200:
 *         description: Success
 *
 */

/* app.get('/chomage', function(req, response){
	response.send(chomage.chomage());
})

 */
/**
 * @swagger
 * /join:
 *   get:
 *     description: Retourne la concetanation des routes precedentes pour avoir toutes les donnees en fonction des regions
 *     responses:
 *       200:
 *         description: Success
 *
 */
/* 
app.get('/join', function(req, response){
    var chomage_data = chomage.chomage();
    Promise.all([aide.aide_sync()]).then((values) => {
          let dep_corres = {}
          let reg_corres = {}
          let final_data = {}
          let moyenne_lycee = {}
          let moyenne_region = {}
          let aide_territoire_data = [];
            values[0].data['records'].forEach(element =>{
                    let temp_dic = {}
                    temp_dic['reg_code'] = element['fields']['reg_code']
                    temp_dic['reg_name'] = element['fields']['reg_name'];
                    temp_dic['date'] = element['fields']['start_year'];
                    temp_dic['pop_total'] = element['fields']['reg_pop_tot'];
                    aide_territoire_data.push(temp_dic)
                });

          var classementLycee_data = JSON.parse(fs.readFileSync('./data/lycee.json').toString());
					var dep_reg = JSON.parse(fs.readFileSync('./data/dep_reg.json').toString());
					var reg_code = JSON.parse(fs.readFileSync('./data/reg_code.json').toString());


					reg_code.forEach(element =>{
						if(parseInt(element['code']) != 11 & parseInt(element['code']) > 0){
							reg_corres[element['region']] = parseInt(element['code'])
						}
						reg_corres['Île-de-France'] = 11;
					})

					dep_reg.forEach(element =>{
						if(parseInt(reg_corres[element['region']]) > 0){
							dep_corres[element['code']] = reg_corres[element['region']];
						}
					})

					classementLycee_data.forEach(element =>{
						if(!(parseInt(element['dpt']) in moyenne_lycee)){
							moyenne_lycee[parseInt(element['dpt'])] = {}
							moyenne_lycee[parseInt(element['dpt'])]['somme_note'] = parseInt(element['note'])
							moyenne_lycee[parseInt(element['dpt'])]['count_note'] = 1 
						} else{
							moyenne_lycee[parseInt(element['dpt'])]['somme_note'] += parseInt(element['note'])
							moyenne_lycee[parseInt(element['dpt'])]['count_note'] += 1 
						}
					})
					for (var key in moyenne_lycee) {
						if(!(parseInt(dep_corres[moyenne_lycee[key]]) in moyenne_region)){
							console.log(dep_corres[key])
							moyenne_region[dep_corres[key]] = {}
							moyenne_region[dep_corres[key]]['somme_note'] = moyenne_lycee[key]['somme_note']
							moyenne_region[dep_corres[key]]['count_note'] = moyenne_lycee[key]['count_note']
						}
						else{
							moyenne_region[dep_corres[key]]['somme_note'] += moyenne_lycee[key]['somme_note']
							moyenne_region[dep_corres[key]]['count_note'] += moyenne_lycee[key]['count_note']
						}
					}
					for (var key in moyenne_region){
						moyenne_region[key]['moyenne'] = moyenne_region[key]['somme_note']/moyenne_region[key]['count_note']
						if(parseInt(key) > 0){
							final_data[key] = {'moyenne_region': moyenne_region[key]['somme_note']/moyenne_region[key]['count_note']}
						}
					}
					chomage_data.forEach(element =>{
						if(parseInt(element['reg_code']) in final_data){
							final_data[parseInt(element['reg_code'])]['taux_chomage'] = element['taux_chomage']
						}
					})
					aide_territoire_data.forEach(element =>{
						if(parseInt(element['reg_code']) in final_data){
							final_data[parseInt(element['reg_code'])]['pop_total'] = element['pop_total']
						}
					})
					reg_code.forEach(element =>{
						if(parseInt(element['code']) in final_data){
							final_data[parseInt(element['code'])]['nom_region'] = element['region']
						}
					})

          response.send(final_data);
});

})

 */

/* app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})
 */
"use strict";

// const express= require('express');

// import https from "https";
// import fs from "fs";
// import path from "path";
// import xlsx from "node-xlsx";

// import fetch from 'node-fetch';
// import axios from 'axios';
// import express from 'express';


const axios = require('axios')
const express = require('express')
const request = require('request')
const fs = require('fs')

const app = express();
var cors = require('cors');


const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')


const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mongodb = require('mongodb');
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

const swaggerDocs = swaggerJsDoc(swaggerOptions);


app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));


const PORT = process.env.PORT || 3000;


app.get('/culture_async/:long/:lat/:r', function(req, response){
	const long = req.params.long
	const lat = req.params.lat
	const r = req.params.r
	
	
	var url = 'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=base-des-lieux-et-des-equipements-culturels&q=&facet=type_equipement_ou_lieu&facet=label_et_appellation&facet=domaine&facet=sous_domaines&facet=departement&facet=adresse_postale&facet=nom&facet=coordonnees_gps_lat_lon&geofilter.distance='
	

    url = url+""+long+'%2C'+""+lat+'%2C'+"+"+r

	/* url = "/api/records/1.0/search/?dataset=base-des-lieux-et-des-equipements-culturels&q=&facet=type_equipement_ou_lieu&facet=label_et_appellation&facet=region&facet=domaine&facet=sous_domaines&facet=departement&geofilter.distance=47.21151478387656%2C-1.547461758200557%2C+1000 "
 */
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
	fs.readFile("/index.html")
        .then(contents => {
            response.setHeader("Content-Type", "text/html");
            response.writeHead(200);
            response.end(contents);
        })
	

})


app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})


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


