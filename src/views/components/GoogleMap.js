import { stylers } from "./GoogleMapStyler";
import GoogleMapMarker from "./GoogleMapMarker";

/**
 * Location Map
 * Main map rendering function that uses  API class
 * @param {string} el - Google Map selector
 */
export default function GoogleMap(el, data, markerdata) {
  const mapEl = document.querySelector(el);
  const mapdata = {
    lat: parseFloat(data.lat ? data.lat : 0),
    lng: parseFloat(data.lng ? data.lng : 0),
    address: data.address,
    title: data.title ? data.title : "Map",
    zoom: parseFloat(data.zoom ? datat.zoom : 10),
  };
  // Call map renderer
  if (document.getElementById("googleMaps")) {
    renderMap(mapEl, mapdata, markerdata);
  }
}

/**
 * Render Map
 * @param {map obj} mapEl - Google Map
 * @param {obj} data - map data
 */
function renderMap(mapEl, data, markerdata) {
  const options = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: stylers.styles,
    zoom: data.zoom,
    center: {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
    },
  };

  const map = new google.maps.Map(mapEl, options);

  renderMarker(map, data);
  if (
    markerdata !== undefined &&
    markerdata !== null &&
    markerdata.length > 0
  ) {
    markerdata.forEach(function (d) {
      renderMarker(map, d);
    });
  }
}

/**
 * Render Marker
 * Renders custom map marker and infowindow
 * @param {map element} mapEl
 * @param {object} data
 */
function renderMarker(map, data) {
  const icon = {
    url: stylers.icons.red,
    scaledSize: new google.maps.Size(80, 80),
  };

  const tmpl = GoogleMapMarker(data);

  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(
      parseFloat(data.lat),
      parseFloat(data.lng)
    ),
    map: map,
    icon: icon,
    title: data.title,
    content: tmpl,
    animation: google.maps.Animation.DROP,
  });

  const infowindow = new google.maps.InfoWindow();

  handleMarkerClick(map, marker, infowindow);
}

/**
 * Handle Marker Click
 *
 * @param {map obj} mapEl
 * @param {marker} marker
 * @param {infowindow} infoWindow
 */
function handleMarkerClick(map, marker, infowindow) {
  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(marker.content);
    infowindow.open(map, marker);
  });

  google.maps.event.addListener(map, "click", function (event) {
    if (infowindow) {
      infowindow.close(map, infowindow);
    }
  });
}
