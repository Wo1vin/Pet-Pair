//calls start function, which calls displayInfo and getInfo functions
document.querySelector('button').addEventListener('click', start)

function start(){
  getInfo();
  changeLayout();
}

function changeLayout(){
  const main = document.getElementById('main');
  main.style.background = "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.8) 8%, rgba(255,255,255,.85) 50%, rgba(255,255,255,.8) 92%, rgba(255,255,255,0) 100%)";
  main.style.flexDirection = "column"

  const interact = document.getElementById('interact');
  interact.style.justifyContent = 'space-evenly';
  
  
  const contact = document.getElementById('contact');
  contact.style.display = 'inline-block';

  const petInfo = document.getElementById('petInfo');
  petInfo.style.display = 'inline';

  const imgCont = document.getElementById('imgCont');
  imgCont.style.visibility = 'visible';

}

//retrieve template for APIs and input pet data
function getInfo(){
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
          document.querySelector('h3').innerText = "Age: " + info.ageString;
        } else if(!info.ageString){
          document.querySelector('h3').innerText = "Age group: "+ info.ageGroup;
        } else { 
          document.querySelector('h3').innerText = "Age unknown";
        } 

        document.querySelector('h4').innerText = "Location: " + data.included.find(findContactInfo).attributes.citystate;
        //find the index that contains attributes.original.url
        let imgUrl = data.included.find(findImgUrl).attributes.original.url;
        document.querySelector('.petPic').src = imgUrl;

        document.querySelector('a').href = `mailto:${data.included.find(findContactInfo).attributes.email}?subject=Adoption Inquiry: ${info.name}`;
       // name age location summary picture data[0].attributes.ageString
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function findImgUrl(obj){
  return obj.type === 'pictures';
}
function findContactInfo(obj){
  return obj.type === 'orgs';
}