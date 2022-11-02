const axios = require('axios');



module.exports = {
	culture_async : async function (resolve){

		axiosCall(function(data){
				resolve(data);
			});
	},
	culture_sync : function (){
		return axios
		  .get('/api/records/1.0/search/?dataset=base-des-lieux-et-des-equipements-culturels&q=&facet=type_equipement_ou_lieu&facet=label_et_appellation&facet=domaine&facet=sous_domaines&facet=departement&facet=adresse_postale&facet=nom&facet=coordonnees_gps_lat_lon&geofilter.distance=')
	}
};


async function axiosCall(resolve,long, lat,r){
	const url = '/api/records/1.0/search/?dataset=base-des-lieux-et-des-equipements-culturels&q=&facet=type_equipement_ou_lieu&facet=label_et_appellation&facet=domaine&facet=sous_domaines&facet=departement&facet=adresse_postale&facet=nom&facet=coordonnees_gps_lat_lon&geofilter.distance='
	await axios
		  .get(url+long+'%2C'+lat+'%2C'+r)
		  .then(res => {
		    let data = [];
			res.data['records'].forEach(element =>{
			    	let temp_dic = {}
					temp_dic['nom'] = element['fields']['nom'];
			    	temp_dic['type'] = element['fields']['type_equipement_ou_lieu']
			    	temp_dic['label_et_appellation'] = element['fields']['label_et_appellation'];
			    	temp_dic['domaine'] = element['fields']['domaine'];
					temp_dic['s_domaine'] = element['fields']['sous_domaine'];
			    	temp_dic['departement'] = element['fields']['departement'];
					temp_dic['adresse_postale'] = element['fields']['adresse_postale'];

			    	data.push(temp_dic)

		    	});
		    	resolve(data);
			  });
}
