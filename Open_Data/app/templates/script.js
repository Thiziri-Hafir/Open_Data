// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto, noUiSlider */

var map = L.map('map').setView([40.695217, -73.977127], 12);

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'apikey',
  username: 'brelsfoeagain'
});

// Initialze source data
var source = new carto.source.SQL('SELECT * FROM airbnb_listings');

// Create style for the data
var style = new carto.style.CartoCSS(`
  #layer {
    marker-width: 7;
    marker-fill: #EE4D5A;
    marker-fill-opacity: 0.9;
    marker-line-color: #FFFFFF;
    marker-line-width: 1;
    marker-line-opacity: 1;
    marker-placement: point;
    marker-type: ellipse;
    marker-allow-overlap: true;
  }
`);

// Add style to the data
//
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var layer = new carto.layer.Layer(source, style, {
  featureClickColumns: ['price', 'host_name']
});

var sidebar = document.querySelector('.sidebar-feature-content');
layer.on('featureClicked', function (event) {
  // Create the HTML that will go in the sidebar. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  //
  // This is exactly like the way we do it in the popups example:
  //
  //   https://glitch.com/edit/#!/carto-popups
  var content = '<h3>' + event.data['host_name'] + '</h3>'
  content += '<div>$' + event.data['price'] + ' per night</div>';
  
  // Then put the HTML inside the sidebar. Once you click on a feature, the HTML
  // for the sidebar will change.
  sidebar.innerHTML = content;
});

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

var priceSlider = document.getElementById('price-slider');
noUiSlider.create(priceSlider, {
	start: [0, 300],
	connect: true,
	range: {
		'min': 0,
		'max': 300
	},
  tooltips: [true, true]
});

priceSlider.noUiSlider.on('change', function () {
  var priceValues = priceSlider.noUiSlider.get();
  source.setQuery('SELECT * FROM airbnb_listings WHERE price >= ' + priceValues[0] + ' AND price <= ' + priceValues[1]);
});