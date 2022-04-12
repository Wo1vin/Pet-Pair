//fetch template for APIs
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  document.getElementById('start').innerText = 'Next Pet';

  fetch('https://api.rescuegroups.org/v5/public/animals/search/available/haspic/?sort=random&limit=1&fields[attributes]',{
    method: "GET",
    headers: {
      "Content-Type":"application/vnd.api+json",
      "Authorization":"Eq0WwliZ"
  }})
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data);
        let info = data.data[0].attributes;

        document.querySelector('h2').innerText = info.name;

        if(info.ageString){
          document.querySelector('h3').innerText = info.ageString;
        } else if(!info.ageString){
          document.querySelector('h3').innerText = info.ageGroup;
        } else { 
          document.querySelector('h3').innerText = "Age unknown";
        } 
        //find the index that contains attributes.original.url
        let imgUrl = data.included.find(imgObj).attributes.original.url;
        document.querySelector('img').src = imgUrl;

       // name age location summary picture data[0].attributes.ageString
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function imgObj(obj){
  return obj.type === 'pictures';
}