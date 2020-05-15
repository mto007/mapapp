import Utils from "../../common/Utils";

let getPlace = async (id) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${process.env.API_URL}places/` + id, options);
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("Error getting place", err);
  }
};

let getKeywordsList = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${process.env.API_URL}keywords/`, options);
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("Error getting keywords", err);
  }
};

let Place = {
  render: async () => {
    let request = Utils.parseRequestURL();
    let place = null;
    // get keywords to list
    let keywords = await getKeywordsList();
    if (request.id !== undefined && request.id !== "") {
      place = await getPlace(request.id);
    }
    return /*html*/ `
          <section class="section">
          <h1>Place details</h1>
          <form class="w3-container w3-card-4" title=${
            place !== null ? place._id : ""
          } >
              <div class="field">
                  <p class="control">
                  <label for="titleInput">Title:</label>
                      <input class="w3-input w3-border" id="titleInput" type="text" required maxlength=40 placeholder="Title" value= ${
                        place !== null
                          ? '"' + Utils.unescape(place.title) + '"'
                          : ""
                      }>
                  </p>
              </div>
              <div class="field">
                  <p class="control ">
                  <label for="descr_input">Description:</label>
                      <input class="w3-input w3-border" id="descriptionInput" type="text" required maxlength=100 placeholder="Description" value=${
                        place !== null
                          ? '"' + Utils.unescape(place.description) + '"'
                          : ""
                      }>
                      
                  </p>
              </div>
              <div class="field">
                  <p class="control ">
                  <label for="latitude_input">Latitude:</label>
                      <input class="w3-input w3-border" id="latitudeInput" type="number" required placeholder="Latitude" value=${
                        place !== null ? place.latitude : ""
                      }>
                  </p>
              </div>
              <div class="field">
                  <p class="control ">
                  <label for="longitude_input">Longitude:</label>
                      <input class="w3-input w3-border" id="longitudeInput" type="number" required placeholder="Longitude" value=${
                        place !== null ? place.longitude : ""
                      }>
                  </p>
              </div>
              <div class="field">
                  <p class="control ">
                  <label>Opening hours:</label>
                      <input class="w3-input w3-border" id="ostartInput" type="time" placeholder="Opening hours start" value=${
                        place !== null ? place.openhoursstart : ""
                      }>
                  -
                      <input class="w3-input w3-border" id="oendInput" type="time" placeholder="Opening hours end" value=${
                        place !== null ? place.openhoursend : ""
                      }>
                  </p>
              </div>
              <div>
              <label>Keywords:</label></br>
              <select id="keywordsSelect" name="keywords" multiple>
                ${keywords.map(
                  (keyword) => `
                <option value=${keyword._id} ${
                    place !== null &&
                    place.keywords.findIndex((k) => k._id == keyword._id) > -1
                      ? "selected"
                      : ""
                  }>${Utils.unescape(keyword.label)} 
                  </option>`
                )}
              </select>
              </div>
              <div class="field">
                  <p class="control">
                      <button class="w3-btn w3-blue w3-round" id="addPlaceButton">
                     Save place
                      </button>
                  </p>
              </div>
          </form>
          </section>
          `;
  },

  after_render: async () => {
    // add place button event listener
    document.getElementById("addPlaceButton").addEventListener("click", () => {
      const selected = document.querySelectorAll(
        "#keywordsSelect option:checked"
      );
      const values = Array.from(selected).map((el) => el.value);
      let newPlace = {
        title: Utils.escape(document.getElementById("titleInput").value),
        description: Utils.escape(
          document.getElementById("descriptionInput").value
        ),
        longitude: document.getElementById("longitudeInput").value,
        latitude: document.getElementById("latitudeInput").value,
        openhoursstart: document.getElementById("ostartInput").value,
        openhoursend: document.getElementById("oendInput").value,
        keywords: values,
      };
      if (
        newPlace.title == "" ||
        newPlace.description == "" ||
        newPlace.latitude == "" ||
        newPlace.longitude == "" ||
        newPlace.openhoursstart == "" ||
        newPlace.openhoursend == ""
      ) {
        alert("mandatory data missing");
        return;
      }
      var id = document.getElementsByTagName("form")[0].title;
      if (id == undefined || id === "") {
        const response = fetch(`${process.env.API_URL}places/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlace),
        });
      } else {
        newPlace._id = id;
        const response = fetch(`${process.env.API_URL}places/` + id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlace),
        });
      }
      // go to places page
      window.location.href = "#/list";
    });
  },
};

export default Place;
