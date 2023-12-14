    console.log(1)
    var myHeaders = new Headers();
    console.log(2)
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("cors-access-control-allow-origin", "*")

    console.log(3)
    
    var urlencoded = new URLSearchParams();
    urlencoded.append("new_email_convo", "description");
    urlencoded.append("new_email_subject", "subject");
    console.log(4)
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };
    console.log(5)
    
    fetch("https://td-mailresponder-dot-deyes-ml.uc.r.appspot.com/process_email_v2", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    console.log(6)