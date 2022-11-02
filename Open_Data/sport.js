const axios = require('axios');



module.exports = {
    aide_async : async function (resolve){

        axiosCall(function(data){
                resolve(data);
            });
    },
    aide_sync : function (){
        return axios
          .get('https://equipements.sports.gouv.fr/api/records/1.0/search/?dataset=data-es&q=&facet=famille&facet=caract24&facet=caract25&facet=caract74&facet=caract33&facet=caract156&facet=caract159&facet=caract167&facet=caract168&facet=caract169&facet=atlas&facet=nom_region&facet=nom_dept&facet=coordonnees_gps_lat_lon&geofilter.distance=')
    }
};


async function axiosCall(resolve,long, lat,r){
    const url = 'https://equipements.sports.gouv.fr/api/records/1.0/search/?dataset=data-es&q=&facet=famille&facet=caract24&facet=caract25&facet=caract74&facet=caract33&facet=caract156&facet=caract159&facet=caract167&facet=caract168&facet=caract169&facet=atlas&facet=nom_region&facet=nom_dept&facet=coordonnees_gps_lat_lon&geofilter.distance='
    await axios
          .get(url+long+'%2C'+lat+'%2C'+r)
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
                resolve(data);
              });
}