//calls start function, which calls displayInfo and getInfo functions
document.querySelector('button').addEventListener('click', start)

function start(){
  getInfo();
  changeLayout();
}
const imgCont = document.getElementById('imgCont');
const petInfo = document.getElementById('petInfo');

function changeLayout(){
  const header = document.querySelector('header');
  header.style.height = "20vh";
  header.querySelector('p').style.fontSize = '3rem';
  const main = document.getElementById('main').style;
  main.background = "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.8) 8%, rgba(255,255,255,.85) 50%, rgba(255,255,255,.8) 92%, rgba(255,255,255,0) 100%)";
  main.flexDirection = "column";
  main.height = "73vh";
  // main.padding = "1em 2em";
//background: rgba(255, 255, 255, 0.85); at max width 550px

  const interact = document.getElementById('interact').style;
  interact.justifyContent = 'center';
  interact.height = '8%';
  interact.width = '70%';

    const start = document.getElementById('start').style;
    const contact = document.getElementById('contact').style;
    contact.display = 'inline';
    const btn = [contact,start];

      btn.forEach(el => {
        el.fontSize = '2.5rem';
        el.padding = '.5rem 3rem';
        el.margin = "0 2%";
      })

  petInfo.style.display = 'block';
  imgCont.style.height = '68%';
  
  const footer = document.getElementById('footer'); 
  footer.style.height = '7vh';
  document.getElementById('footer').querySelector('a').style.fontSize = '2.2rem';
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
        let orgInfo = data.included.find(findContactInfo).attributes;
        document.querySelector('h4').innerText = "Location: " + orgInfo.citystate;

        console.log(orgInfo.name);


        const petPic = imgCont.querySelector('img'); //do not add .src to this
        //pulls the image file information from the data. 
        let picInfo = data.included.find(findImgInfo); //dont add attributes
        function findImgInfo(obj){
          return obj.type === 'pictures';
        }
        
        if(!picInfo){
          // imgCont.style.visibility = 'hidden';
          console.log("error");
          petPic.src = 'https://cdn.searchenginejournal.com/wp-content/uploads/2020/08/404-pages-sej-5f3ee7ff4966b.png'
          //or 'https://http.cat/404.png' 
          //or 'https://peoplewithpets.com/wp-content/uploads/2019/11/people-with-pets-no-image-available.jpg'

          //create text block
          let img404 = document.createElement('h5');
          img404.textContent = `We couldn't get a good picture of ${info.name}, but you can request more information by contacting ${orgInfo.name}`;
          petInfo.appendChild(img404);
        } else {
          imgCont.style.visibility = 'visible';
          console.log('no error');
          petPic.src = picInfo.attributes.original.url;
          
          //establishing variables for image width and height for ease of use
          let imgWidth = picInfo.attributes.original.resolutionX;
          let imgHeight = picInfo.attributes.original.resolutionY;
            //if the height of img < 600px, change img object-fit: cover
            if (imgHeight <= 600){
              petPic.style.objectFit = 'cover';
            } else {
              petPic.style.objectFit = 'contain';
            }
        }

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
// function findImgInfo(obj){
//   console.log(obj.type === 'pictures');
//   for (let i = 0; i <= obj.length ; i++){
//     if(obj[i].type === 'pictures'){
//       return;
//     } else
// }
// }