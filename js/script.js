//fetch template for APIs
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){

  fetch('https://api.rescuegroups.org/v5/public/animals/search/available/haspic/?sort=random&limit=1&fields[attributes]',{
    method: "GET",
    headers: {
      "Content-Type":"application/vnd.api+json",
      "Authorization":"Eq0WwliZ"
  }})
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        let info =data.data[0].attributes;
        console.log(info);
        if(!info.ageString){
        console.log(info.ageGroup)
        } else { console.log(info.ageString)}
        console.log(info.name)
        console.log(info.pictureThumbnailUrl)
       // name age location summary picture data[0].attributes.ageString
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}