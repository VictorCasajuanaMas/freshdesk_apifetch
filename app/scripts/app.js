var client;
var iparams;
var version = '6.0'
var parameters = {}

init();

async function init() {
  console.log('#AP#0 init version ' + version)
  client = await app.initialized();
  console.log('#AP#1 cliente.events.on')
  client.events.on('app.activated', renderText);
}

async function renderText() {

  await getiparams()
  
  debug('#AP#4 start function renderText()')

  // get element from html to update -------------------
  debug('#AP#5 get apptext from document.getelementbyid("apptext")')
  const textElement = document.getElementById('apptext');
  
  // update waiting text on widget ---------------------
  debug('#AP#6 update waiting text on widget');
  textElement.innerText = 'Apifetch ver ' + version + '\n\n' + iparams.waiting_text
  
  newUrl = await getparamsfromurl( )

  await setparameters()

  // get response from URL ------------------------------
  debug('#AP#13 get response from URL')
  await fetch(newUrl, parameters)
                              .then( response => response.text() )
                              .then( result => textElement.innerHTML = result )
                              .catch( error => console.error(error) );

  debug('#AP#14 get response text')

}

async function getiparams() {
  // get installation parameters ------------------------
  console.log('#AP#2 get iparams from client.iparams.get()')
  iparams = await client.iparams.get()
}


async function setparameters() {

  // get method from installation parameters ----------
  console.log('#AP#3 define const parameters');
  parameters = {
    method: iparams.method,
    debug: iparams.debug
  }

  // Take params from body -------------------------------
  if ( iparams.method == 'POST' ) {

    debug('#AP#12 Configure POST fetch')

    body = iparams.body

    if ( body ) {
          
      var body = JSON.parse( body );
          
      switch (iparams.body_format) {

        case "x-www-form-urlencoded":
          
          parameters.body = new URLSearchParams();

          parameters.headers = new Headers();
          parameters.headers.append("Content-Type", "application/x-www-form-urlencoded");
    
        break;

        case "form-data":

          parameters.body = new FormData();

        break;
          
      }

      for (let x in body ) {
        debug('#AP#12.1 parameters:',x, body[x])
        parameters.body.append(x, await getdata( body[x] ) )
      }
    }
  }
}


async function getparamsfromurl ( ) {
  // Take params from URL -------------------------------
  debug('#AP#8 Take iparams.url');
  const url = await new URL(iparams.url);
  var newUrl = iparams.url;

  debug('#AP#9 take searchParams from url')
  const params = await url.searchParams;

  debug('#AP#10 iterate params to replace variables')
  for (const [key, value] of params) {
    
    newUrl = newUrl.replace( value, await getdata( value ) )
    debug('#AP#10.1 setting key ' + key )

  }

  debug('#AP#11 newUrl: ' + newUrl)
  return newUrl
}

async function getdata( value ) {

  var datamethod = ''

    if (value.includes('.')) {

      var variable = value.replace( /[{}]/g, '')      // deleting { } 
      datamethod = variable.split('.')[0]         // datemethod is contact, ticket, etc...
      var field = variable.split('.')[1]              // id, email, subject, etc...

    } else {  // esto se hace para compatibilizar con versiones anteriores que no se les permitia pasar el tipo de data ( ticket, contact, etc... )

      datamethod = 'contact' // datemethod default is contact

    }  
    debug('#AP#10.1 get data from ' + datamethod + ' with client.data.get())')
    var data = await client.data.get( datamethod );
    debug('#AP#10.2 extract data from ' + datamethod + ' with Object.getOwnPropertyDescriptor()')
    object = await Object.getOwnPropertyDescriptor( data, datamethod )
    debug('#AP#10.3 get field ' + field + ' from ' + datamethod )
    var valueoffield = object.value[field]
    debug('#AP#10.4 value of ' + field + ' from ' + datamethod + ' : ' + valueoffield )

    return valueoffield

}

async function debug ( text ){

  if ( iparams.debug ) {
    console.log(text)
  }

}
