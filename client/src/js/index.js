const y = window.matchMedia('(min-height: 400px)');

function queryFunction (y) {
  if (y.matches) {
    getData();
    async function getData () {
      const page = 1;
      const response = await window.fetch(`/api/medium/${page}`);
      const data = await response.json();

      console.log(data);

      function blogTemplate (vorstellung) {
        return `
                            <div class= "border border-info rounded flex-items-container">

                                <div class= "container-filmname"> ${vorstellung.filmname} </div>

                                <div class="container-datum"> ${vorstellung.datum} </div> </br>
                                <div class="container-beginn"> ${vorstellung.kinosaal} </br>
                                ${vorstellung.uhrzeit} Uhr </div>

                            </div>`;
      }
      document.getElementById('vorstellungen').innerHTML = `

            <p class="font-weight-bold">${data.count} Einträge - Seite 1 von ${Math.ceil(data.count / 2)}</p>
            ${data.rows.map(blogTemplate).join('')}

            `;

      // prüfen ob ein Button Container von "large" oder "small" existiert, wenn ja dann lösche ihn und erstelle einen neuen
      if (document.getElementById('divButtons') !== null) {
        const buttonContainer = document.getElementById('divButtons');
        document.body.removeChild(buttonContainer);
      } else if (document.getElementById('divButtonsSmall') !== null) {
        const buttonContainerSmall = document.getElementById('divButtonsSmall');
        document.body.removeChild(buttonContainerSmall);
      }

      const containerButtons = document.createElement('div');
      containerButtons.setAttribute('id', 'divButtonsQuery');
      containerButtons.className = 'buttonContainer';

      for (let page = 1; page <= `${Math.ceil(data.count / 2)}`; page++) {
        const button = document.createElement('button');
        button.innerHTML = page;
        button.className = 'btn btn-outline-light';
        button.value = page;
        button.addEventListener('click', buttonFunction);

        containerButtons.appendChild(button);
      }
      // containerButtons.style.textAlign = 'center';

      document.body.appendChild(containerButtons);

      function buttonFunction () {
        const page = this.value;

        getData();
        async function getData () {
          const response = await window.fetch(`/api/medium/${page}`);
          const data = await response.json();

          function blogTemplate (vorstellung) {
            return `

                      <div class= "border border-info rounded flex-items-container">

                          <div class= "container-filmname"> ${vorstellung.filmname} </div>

                          <div class="container-datum"> ${vorstellung.datum} </div> </br>
                          <div class="container-beginn"> ${vorstellung.kinosaal} </br>
                          ${vorstellung.uhrzeit} Uhr </div>

                      </div>`;
          }
          document.getElementById('vorstellungen').innerHTML = `

                      <p class="font-weight-bold">${data.count} Einträge - Seite ${page} von ${Math.ceil(data.count / 2)}</p>
                      ${data.rows.map(blogTemplate).join('')}`;
        }
      }
    }
  } else {
    getData();
    async function getData () {
      const page = 1;
      const response = await window.fetch(`/api/small/${page}`);
      const data = await response.json();

      console.log(data);

      function blogTemplate (vorstellung) {
        return `
                            <div class= "border border-info rounded flex-items-container">
    
                                <div class= "container-filmname"> ${vorstellung.filmname} </div>
        
                                <div class="container-datum"> ${vorstellung.datum} </div> </br>
                                <div class="container-beginn"> ${vorstellung.kinosaal} </br>
                                ${vorstellung.uhrzeit} Uhr </div>
                     
                            </div>`;
      }
      document.getElementById('vorstellungen').innerHTML = `
           
            <p class="font-weight-bold">${data.count} Einträge - Seite 1 von ${Math.ceil(data.count / 1)}</p>
            ${data.rows.map(blogTemplate).join('')}

            `;

      // prüfen ob ein Button Container von "medium" existiert, wenn ja dann lösche ihn und erstelle einen neuen
      if (document.getElementById('divButtonsQuery') !== null) {
        const buttonContainer = document.getElementById('divButtonsQuery');
        document.body.removeChild(buttonContainer);
      }

      const containerButtons = document.createElement('div');
      containerButtons.setAttribute('id', 'divButtonsSmall');
      containerButtons.className = 'buttonContainer pagination-sm';

      for (let page = 1; page <= `${Math.ceil(data.count / 1)}`; page++) {
        const button = document.createElement('button');
        button.innerHTML = page;
        button.className = 'btn btn-outline-light';
        button.value = page;
        button.addEventListener('click', buttonFunction);

        containerButtons.appendChild(button);
      }
      // containerButtons.style.textAlign = 'center';

      document.body.appendChild(containerButtons);

      function buttonFunction () {
        const page = this.value;

        getData();
        async function getData () {
          const response = await window.fetch(`/api/small/${page}`);
          const data = await response.json();

          function blogTemplate (vorstellung) {
            return `
  
                      <div class= "border border-info rounded flex-items-container">
  
                          <div class= "container-filmname"> ${vorstellung.filmname} </div>
  
                          <div class="container-datum"> ${vorstellung.datum} </div> </br>
                          <div class="container-beginn"> ${vorstellung.kinosaal} </br>
                          ${vorstellung.uhrzeit} Uhr </div>
  
                      </div>`;
          }
          document.getElementById('vorstellungen').innerHTML = `
                    
                      <p class="font-weight-bold">${data.count} Einträge - Seite ${page} von ${Math.ceil(data.count / 1)}</p>
                      ${data.rows.map(blogTemplate).join('')}`;
        }
      }
    }
  }
  y.addListener(queryFunction);
}

const x = window.matchMedia('(min-height: 600px)');

function queryFunction1 (x) {
  if (x.matches) {
    getData();
    async function getData () {
      const page = 1;
      const response = await window.fetch(`/api/${page}`);
      const data = await response.json();

      console.log(data);

      function blogTemplate (vorstellung) {
        return `
                            <div class= "border border-info rounded flex-items-container">

                                <div class= "container-filmname"> ${vorstellung.filmname} </div>

                                <div class="container-datum"> ${vorstellung.datum} </div> </br>
                                <div class="container-beginn"> ${vorstellung.kinosaal} </br>
                                ${vorstellung.uhrzeit} Uhr </div>

                            </div>`;
      }

      document.getElementById('vorstellungen').innerHTML = `

            <p class="font-weight-bold">${data.count} Einträge - Seite 1 von ${Math.ceil(data.count / 3)}</p>
            ${data.rows.map(blogTemplate).join('')}
            `;

      // prüfen ob ein Button Container von "medium" existiert, wenn ja dann lösche ihn und erstelle einen neuen
      if (document.getElementById('divButtonsQuery') !== null) {
        const buttonContainer = document.getElementById('divButtonsQuery');
        document.body.removeChild(buttonContainer);
      }

      const containerButtons = document.createElement('div');
      containerButtons.setAttribute('id', 'divButtons');
      containerButtons.className = 'buttonContainer';

      for (let page = 1; page <= `${Math.ceil(data.count / 3)}`; page++) {
        const button = document.createElement('button');
        button.innerHTML = page;
        button.className = 'btn btn-outline-light';
        button.value = page;
        button.addEventListener('click', buttonFunction);

        containerButtons.appendChild(button);
      }
      // containerButtons.style.textAlign = 'center';

      document.body.appendChild(containerButtons);

      function buttonFunction () {
        const page = this.value;

        getData();
        async function getData () {
          const response = await window.fetch(`/api/${page}`);
          const data = await response.json();

          function blogTemplate (vorstellung) {
            return `

                        <div class= "border border-info rounded flex-items-container">

                            <div class= "container-filmname"> ${vorstellung.filmname} </div>

                            <div class="container-datum"> ${vorstellung.datum} </div> </br>
                            <div class="container-beginn"> ${vorstellung.kinosaal} </br>
                            ${vorstellung.uhrzeit} Uhr </div>

                        </div>`;
          }

          document.getElementById('vorstellungen').innerHTML = `

                        <p class="font-weight-bold">${data.count} Einträge - Seite ${page} von ${Math.ceil(data.count / 3)}</p>
                        ${data.rows.map(blogTemplate).join('')}`;
        }
      }
    }
  } else {
    queryFunction(y);
  }
  x.addListener(queryFunction1);
}
queryFunction1(x);
