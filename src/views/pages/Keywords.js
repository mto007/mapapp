import Utils from "../../common/Utils";

let getKeywordsList = async () => {
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

let Keywords = {
  render: async () => {
    let keywords = await getKeywordsList();

    let view = /*html*/ `
      <section class="section">
        <h1> Keywords </h1>
        </br>
        <label>Enter new keyword</>
        <input class="input" id="keywordInput" type="text" placeholder="Keyword" required />
        <button class="w3-btn w3-blue w3-round" id="addButton">Add</button>
        </br>
      </section>
      <section class="section"><table id="keywordsTable" class="w3-table w3-striped w3-bordered">
        <tbody>
          <tr>
            <th>Label</th>
          </tr>
            ${keywords
              .map(
                (keyword) =>
                  `<tr id=${keyword._id}><td id="label">${Utils.unescape(
                    keyword.label
                  )}</td><td><button class="w3-btn w3-blue w3-round" id="editButton_${
                    keyword._id
                  }" value=\"${Utils.unescape(
                    keyword.label
                  )}\">Edit</button></td><td><button class="w3-btn w3-blue w3-round" id="deleteButton_${
                    keyword._id
                  }" ><i class="fa fa-trash"></i> Delete</button></td></tr>`
              )
              .join("")}
        </tbody>
      </table>
    </section>
          `;
    return view;
  },

  after_render: async () => {
    // add new keyword
    document.getElementById("addButton").addEventListener("click", () => {
      // add new keyword and refreh page
      if (document.getElementById("keywordInput").value == "") {
        alert("Keyword cannot be empty");
        return;
      }
      let newKeyword = {
        label: Utils.escape(document.getElementById("keywordInput").value),
      };
      const response = fetch(`${process.env.API_URL}keywords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newKeyword),
      });
      location.reload();
    });

    // delete and edit keyword event listeners
    var buttons = document.getElementsByTagName("button");
    for (var index = 0; index < buttons.length; index++) {
      if (buttons[index].id.search("editButton") > -1) {
        buttons[index].addEventListener("click", () => {
          let id = event.srcElement.id.split("_")[1];
          console.log("value " + event.srcElement.value);
          // edit keyword
          var input = prompt("Edit keyword", event.srcElement.value);
          if (input != null) {
            let newKeyword = {
              label: Utils.escape(input),
              _id: id,
            };
            const response = fetch(`${process.env.API_URL}keywords/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newKeyword),
            });
            location.reload();
          }
        });
      } else if (buttons[index].id.search("deleteButton") > -1) {
        buttons[index].addEventListener("click", () => {
          alert("deleting keywords in use is not recommended!");
          let id = event.srcElement.id.split("_")[1];
          const options = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };
          try {
            const response = fetch(
              `${process.env.API_URL}keywords/${id}`,
              options
            );
          } catch (err) {
            console.log("Error deleting a keyword", err);
          }
          location.reload();
        });
      }
    }
  },
};

export default Keywords;
