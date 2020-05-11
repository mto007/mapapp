// --------------------------------
//  Get saved palces
// --------------------------------
import GoogleMapApi from "../components/GoogleMapApi";
import Utils from "../../common/Utils";
import validator from "validator";
import "../../styles/Common.scss";

let getPlaceList = async (searchterm, filter) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const condition =
    searchterm !== undefined && searchterm !== "5eb6838e87df2b287809609b"
      ? "?title=" + searchterm
      : "";

  try {
    const response = await fetch(
      `${process.env.API_URL}places${condition}`,
      options
    );
    const json = await response.json();
    let filtered = [];
    let isFiltering = false;
    if (filter !== undefined && filter !== "") {
      //?open=true&filter=bar,nightclub,pizza

      const currentDate = new Date();
      const currentHours = Number.parseInt(currentDate.getHours());
      const currentMinutes = Number.parseInt(currentDate.getMinutes());
      const isopen = filter.split("&")[0].split("=")[1];
      const keywords = filter.split("&")[1].split("=")[1];

      if (isopen == "true") {
        isFiltering = true;
        for (var i = 0, item; (item = json[i]); i++) {
          const itemEndHours = Number.parseInt(item.openhoursend.split(":")[0]);
          const itemStartHours = Number.parseInt(
            item.openhoursstart.split(":")[0]
          );
          const itemEndHMinutes = Number.parseInt(
            item.openhoursend.split(":")[1]
          );
          const itemStartMinutes = Number.parseInt(
            item.openhoursstart.split(":")[1]
          );
          if (currentHours >= itemStartHours && currentHours < itemEndHours) {
            filtered.push(item);
          }
        }
      }

      if (keywords !== "") {
        isFiltering = true;
        // filter with keywords
        const keywordValues = keywords.split(",");
        let tmpFiltered = [];
        for (var i = 0, item; (item = json[i]); i++) {
          let itemKeywords = json[i].keywords;
          let isOKArray = itemKeywords
            .map((ik) => {
              return keywordValues.indexOf(ik) > -1 ? true : false;
            })
            .filter((a) => a == true);
          if (isOKArray.length > 0) {
            tmpFiltered.push(json[i]);
          }
        }
        filtered = filtered.concat(
          tmpFiltered.filter((item) => filtered.indexOf(item) < 0)
        );
      }
    }

    return isFiltering == true ? filtered : json;
  } catch (err) {
    console.log("Error getting places", err);
  }
};

let getKeywordList = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${process.env.API_URL}keywords`, options);
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("Error getting keywords", err);
  }
};

let PlaceList = {
  render: async () => {
    let request = Utils.parseRequestURL();
    let places = await getPlaceList(request.id, request.verb);
    let keywords = await getKeywordList();

    let view = /*html*/ `
      <div class="w3-container" >
         <section>
             <h1> Places </h1>
             </br>
             <button   class="w3-btn w3-blue w3-round" id="addButton">Add new place</button></br>
             <label>Search places by title:</>
             <input class="input" id="searchTerm" type="text" placeholder="Title"  />
             <button  class="w3-btn w3-blue w3-round" id="searchButton"><i class="fa fa-search"></i> Search by title</button>
            
             <label for="keywords">Choose keywords:</label>
<select id="keywordsSelect" name="keywords" multiple>
${keywords.map(
  (keyword) => `
  <option value=${keyword._id}>${unescape(keyword.label)}</option>`
)}
</select>
<input type="checkbox" id="openCheckbox">Only open at the moment</input>
<button   class="w3-btn w3-blue w3-round" id="filterButton">Filter</button>
</br>
             </section>
             <section>
            
             </div><div>
  <table id="placesTable" class="w3-table w3-striped w3-bordered">
  <tbody>
    <tr>
      <th>Title</th>
      <th>Description</th>
      <th>Latitude</th>
      <th>Longitude</th>
      <th>Opening hours</th>
      <th>Keywords</th>
    </tr>
    ${places
      .map(
        (place) =>
          `<tr id=${place._id}><td id="title">${unescape(
            place.title
          )}</td><td id="descr">${unescape(
            place.description
          )}</td><td id="latitude">${place.latitude}</td><td id="longitude">${
            place.longitude
          }</td><td id="times">${place.openhoursstart} - ${
            place.openhoursend
          }</td>
        </td><td id="times">${place.keywords.map((k) => {
          const kw = keywords.find((w) => w._id == k);
          return kw !== undefined ? unescape(kw.label) : "";
        })}</td>
        <td><button  class="w3-btn w3-blue w3-round" id="editButton_${
          place._id
        }">Edit</button></td><td><button class="w3-btn w3-blue w3-round" id="deleteButton_${
            place._id
          }">Delete</button></td></tr>`
      )
      .join("")}
    </tbody>
    </table>
  </section>
  </div>
  <div>
  <div id="map"></div></div>
     `;
    return view;
  },
  after_render: async () => {
    // fetch data to the map
    let mapdata;
    let markers = [];
    var table = document.getElementById("placesTable");
    for (var i = 0, row; (row = table.rows[i]); i++) {
      //iterate through rows
      let latitude;
      let longitude;
      let title;
      let marker;
      let address;
      for (var j = 0, col; (col = row.cells[j]); j++) {
        switch (col.id) {
          case "title":
            title = col.innerHTML;
            break;
          case "descr":
            address = col.innerHTML;
            break;
          case "latitude":
            latitude = col.innerHTML;
            break;
          case "longitude":
            longitude = col.innerHTML;
            break;
          default:
            break;
        }
      }
      if (i == 1) {
        mapdata = {
          lat: latitude,
          lng: longitude,
          title: title,
          address: address,
        };
      } else {
        marker = {
          lat: latitude,
          lng: longitude,
          title: title,
          address: address,
        };
        markers.push(marker);
      }
    }

    // render map
    GoogleMapApi("#map", mapdata, markers);

    // edit and delete event listeners
    var buttons = document.getElementsByTagName("button");
    for (var index = 0; index < buttons.length; index++) {
      if (buttons[index].id.search("editButton") > -1) {
        buttons[index].addEventListener("click", () => {
          let id = event.srcElement.id.split("_")[1];
          window.location.href = "#/place/" + id;
        });
      } else if (buttons[index].id.search("deleteButton") > -1) {
        buttons[index].addEventListener("click", () => {
          let id = event.srcElement.id.split("_")[1];
          const options = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };
          try {
            const response = fetch(
              `${process.env.API_URL}places/${id}`,
              options
            );
          } catch (err) {
            console.log("Error deleting a place", err);
          }
          location.reload();
        });
      }
    }

    // add new place event
    document.getElementById("addButton").addEventListener("click", () => {
      // go to add new place page
      window.location.href = "#/place";
    });

    // search by title event
    document.getElementById("searchButton").addEventListener("click", () => {
      // reload the page with search term
      const searchTerm = escape(document.getElementById("searchTerm").value);
      window.location.href = "#/list/" + searchTerm;
    });

    // filter by keywords or currentlyOpen restaurants event
    document.getElementById("filterButton").addEventListener("click", () => {
      let open = document.getElementById("openCheckbox").checked;
      // page with search term
      let selectElement = document.getElementById("keywordsSelect");
      let selectedValues = Array.from(selectElement.selectedOptions).map(
        (option) => option.value
      );
      let searchTerm = escape(document.getElementById("searchTerm").value);
      searchTerm = searchTerm === "" ? "5eb6838e87df2b287809609b" : searchTerm;
      window.location.href =
        "#/list/" +
        searchTerm +
        "/" +
        "open=" +
        open +
        "&keywords=" +
        selectedValues.toString();
    });
  },
};

export default PlaceList;
