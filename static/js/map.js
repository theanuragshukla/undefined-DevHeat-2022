var map = L.map('map').setView([51.505, -0.09], 18);
let locStatus=false
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '© OpenStreetMap'
}).addTo(map);

const sleep = ms => new Promise(r => setTimeout(r, ms));
var popup = L.popup();
function onLocationFound(e) {
    var radius = e.accuracy;
	locStatus=true
    L.circle(e.latlng, radius).addTo(map);
			map.flyTo(e.latlng, map.getZoom())

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();


}
function onMapClick(e) {
 map.locate();
}

map.on('click', onMapClick);
map.on('locationfound', onLocationFound);
L.marker([51.5, -0.09]).on('click', markerOnClick).addTo(map);

function markerOnClick(e){
	console.log(e)
}

function getLongAndLat() {
	return new Promise((resolve, reject) =>
		navigator.geolocation.getCurrentPosition(resolve, reject)
	);
}
const getBins = () => {
	fetch('/get-all-bins')
	.then(res=> res.json())
	.then(res=> {
		res.map(point=>{
			L.marker([point.loc.x, point.loc.y]).on('click', ()=>{markerOnClick(point.uid)}).addTo(map);
		})
	})
}
const locateMe =async () => {
	document.getElementById('map').click()
	while(!locStatus){
		await sleep(10)
	}
	getBins()
}
window.onload=()=>{
	locateMe()
}
