import GoogleMap from "./GoogleMap";

const GoogleMapApi = (el, data, markers) => {
  const existingScript = document.getElementById("googleMaps");

  if (!existingScript) {
    const script = document.createElement("script");
    const key = process.env.MAP_APIKEY;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.id = "googleMaps";
    document.body.appendChild(script);

    script.onload = () => {
      GoogleMap(el, data, markers);
    };
  } else {
    console.log("render again" + data);
    if (data !== undefined) {
      GoogleMap(el, data, markers);
    }
  }
};

export default GoogleMapApi;
