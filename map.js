mapboxgl.accessToken = 'pk.eyJ1IjoieWFuc3VuMjAyMCIsImEiOiJjazg4dmFsbGcwMGcwM2xxc2Zla21zZG91In0.Kkqjs0MWxmSEeqe7yO-k5g';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/dark-v10',
center: [118, 32],
zoom: 4
});
 
map.on('load', function () {
map.addSource('projects', {
type: 'geojson',
data: 'data/data.geojson',
cluster: true,
clusterMaxZoom: 14, 
clusterRadius: 50 
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'projects',
filter: ['has', 'point_count'],
paint: {
'circle-color': ['step',['get', 'point_count'],
'#51bbd6',5,
'#f1f075',10,
'#f28cb1',
],'circle-radius': ['step',['get', 'point_count'],
20,5,
30,10,
40]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'projects',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'projects',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#11b4da',
'circle-radius': 10,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});
 
map.on('click', 'clusters', function (e) {
var features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
var clusterId = features[0].properties.cluster_id;
map.getSource('activities').getClusterExpansionZoom(
clusterId,
function (err, zoom) {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
map.on('click', 'unclustered-point', function (e) {
var coordinates = e.features[0].geometry.coordinates.slice();
var Type = e.features[0].properties.Categories;
var TFA = e.features[0].properties.TFA;
var FAR = e.features[0].properties.FAR;
var Height = e.features[0].properties.HEIGHT;
var Name = e.features[0].properties.NAME;
var Stage = e.features[0].properties.Stage;
var Client = e.features[0].properties.Client;
var Image = e.features[0].properties.Image;



while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML('<h4><b>' + Name + '</b></h4>'
            + '<p><b>Client:</b> ' + Client + '<br>'
            + '<b>Type:</b> ' + Type + '<br>'
            + '<b>TFA:</b> ' + TFA + '㎡<br>'
            + '<b>FAR:</b> ' + FAR + '<br>'
            + '<b>Height:</b> ' + Height + 'm<br>'
            + '<b>Stage:</b> ' + Stage + '<br>'
            + '<b>Image:</b> ' + Image + '<br>')
.addTo(map);
});
 
map.on('mouseenter', 'clusters', function () {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', function () {
map.getCanvas().style.cursor = '';
});
});

var toggleableLayerIds = ['Produce in NYC By YanSun'];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function(e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
