var client;

init();

async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderText);
}

async function renderText() {
  
  // get element from html to update -------------------
  const textElement = document.getElementById('apptext');

  // get installation parameters ------------------------
  const iparams = await client.iparams.get();

  // get method from installation parameters ----------
    const parameters = {
    method: iparams.method
  }
  
  // update waiting text on widget ---------------------
  textElement.innerText = iparams.waiting_text
  
  // get contact data ----------------------------------
  const contactData = await client.data.get('contact');
  
  // Take params from URL -------------------------------
  const url = await new URL(iparams.url);
  var newUrl = iparams.url;

  const params = await url.searchParams;
  
  params.forEach((value) => {
    var variable = ''
    variable = value.replace( /[{}]/g, '')
    newUrl = newUrl.replace( value, contactData.contact[variable])
  });

  // Take params from body -------------------------------
  if ( iparams.method == 'POST' ) {

    body = iparams.body

    if ( body ) {
          
      var body = JSON.parse( body );
      keys = Object.keys(body);
      values = Object.values(body);
          
      switch (iparams.body_format) {

        case "x-www-form-urlencoded":
          
          newBody = new URLSearchParams();
    
        break;

        case "form-data":

          newBody = new FormData();
          
        }
        
        keys.forEach((key) => {
          newBody.append(key, contactData.contact[body[key]])
        })
        
        parameters.body = newBody

      }
  
  }

  // get response from URL ------------------------------
  const response = await fetch(newUrl, parameters)

  // get response text ----------------------------------
  const respuesta = await response.text();

  // update text on widget ------------------------------
  textElement.innerText = respuesta

}