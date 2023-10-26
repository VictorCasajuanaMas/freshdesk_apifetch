// version 3.0

var client;

init();

async function init() {
  console.log('#apifetch#0 init version 3.0')
  client = await app.initialized();
  console.log('#apifetch#1 cliente.events.on')
  client.events.on('app.activated', renderText);
}

async function renderText() {
  
  console.log('#apifetch#2 start function renderText()')
  // get element from html to update -------------------
  console.log('#apifetch#3 get apptext from document.getelementbyid("apptext")')
  const textElement = document.getElementById('apptext');
  
  // get installation parameters ------------------------
  console.log('#apifetch#4 get iparams from client.iparams.get()')
  const iparams = await client.iparams.get();
  
  // get method from installation parameters ----------
  console.log('#apifetch#5 define const parameters');
  const parameters = {
    method: iparams.method
  }
  
  // update waiting text on widget ---------------------
  console.log('#apifetch#6 update waiting text on widget');
  textElement.innerText = iparams.waiting_text
  
  // get contact data ----------------------------------
  console.log('#apifetch#7 get contact data from client.data.get("contact")');
  const contactData = await client.data.get('contact');
  
  // Take params from URL -------------------------------
  console.log('#apifetch#8 Take iparams.url');
  const url = await new URL(iparams.url);
  var newUrl = iparams.url;

  console.log('#apifetch#9 take searchParams from url')
  const params = await url.searchParams;
  
  console.log('#apifetch#10 iterate params to replace variables')
  params.forEach((value) => {
    var variable = ''
    variable = value.replace( /[{}]/g, '')
    newUrl = newUrl.replace( value, contactData.contact[variable])
  });

  console.log('#apifetch#11 newUrl: ' + newUrl)

  // Take params from body -------------------------------
  if ( iparams.method == 'POST' ) {

    console.log('#apifetch#12 Configure POST fetch')

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
  console.log('#apifetch#13 get response from URL')
  const response = await fetch(newUrl, parameters)

  // get response text ----------------------------------
  console.log('#apifetch#14 get response text')
  const respuesta = await response.text();

  // update text on widget ------------------------------
  console.log('#apifetch#15 update text on widget')
  textElement.innerText = respuesta

  console.log('#apifetch#16 end function RenderText()')

}