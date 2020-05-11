let Navbar = {
  render: async () => {
    let view = /*html*/ `
           <nav class="navbar" role="navigation" aria-label="main navigation">
              <div class="container">
                  
                  <div id="navbarBasic" class="w3-bar w3-light-grey" aria-expanded="false">
                      <div class="navbar-start">
                          <a class="w3-bar-item w3-button" href="/#/list">
                              PlaceList
                          </a>
                          <a class="w3-bar-item w3-button" href="/#/keywords">
                              Keywords
                          </a>
                      </div>
                  </div>
              </div>
          </nav>
      `;
    return view;
  },
  after_render: async () => {},
};

export default Navbar;
