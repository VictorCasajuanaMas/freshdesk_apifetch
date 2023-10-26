var client;
var iparams;
var version = '4.0'

init();

async function init() {
  console.log('#apifetch#0 init version ' + version)
  client = await app.initialized();
  console.log('#apifetch#1 cliente.events.on')
  client.events.on('app.activated', renderText);
}

async function renderText() {

  // get installation parameters ------------------------
  console.log('#apifetch#2 get iparams from client.iparams.get()')
  iparams = await client.iparams.get();
  
  // get method from installation parameters ----------
  console.log('#apifetch#3 define const parameters');
  const parameters = {
    method: iparams.method,
    debug: iparams.debug
  }
  
  debug('#apifetch#4 start function renderText()')
  // get element from html to update -------------------
  debug('#apifetch#5 get apptext from document.getelementbyid("apptext")')
  const textElement = document.getElementById('apptext');
  
  // update waiting text on widget ---------------------
  debug('#apifetch#6 update waiting text on widget');
  textElement.innerText = 'Apifetch ver ' + version + '\n\n' + iparams.waiting_text
  
  // get contact data ----------------------------------
  debug('#apifetch#7 get contact data from client.data.get("contact")');
  const contactData = await client.data.get('contact');
  
  // Take params from URL -------------------------------
  debug('#apifetch#8 Take iparams.url');
  const url = await new URL(iparams.url);
  var newUrl = iparams.url;

  debug('#apifetch#9 take searchParams from url')
  const params = await url.searchParams;
  
  debug('#apifetch#10 iterate params to replace variables')
  params.forEach((value) => {
    var variable = ''
    variable = value.replace( /[{}]/g, '')
    newUrl = newUrl.replace( value, contactData.contact[variable])
  });

  debug('#apifetch#11 newUrl: ' + newUrl)

  // Take params from body -------------------------------
  if ( iparams.method == 'POST' ) {

    debug('#apifetch#12 Configure POST fetch')

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
  debug('#apifetch#13 get response from URL')
  const response = await fetch(newUrl, parameters)

  // get response text ----------------------------------
  debug('#apifetch#14 get response text')
  const respuesta = await response.text();

  // update text on widget ------------------------------
  debug('#apifetch#15 update text on widget')
  textElement.innerText = respuesta

  debug('#apifetch#16 end function RenderText()')

}

async function debug ( text ){

  if ( iparams.debug ) {
    console.log(text)
  }

}