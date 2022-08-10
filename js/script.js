//calls start function, which calls displayInfo and getInfo functions
document.querySelector('button').addEventListener('click', start)

function start(){
  getInfo();
  changeLayout();
}
const imgCont = document.getElementById('imgCont');
const petInfo = document.getElementById('petInfo');

function changeLayout(){
  document.getElementById('start').innerText = 'Next Pet';

  const header = document.querySelector('header');
  header.style.height = "17vh";
  header.querySelector('p').style.fontSize = '3rem';
  const main = document.getElementById('main').style;
  main.background = "linear-gradient(90deg, rgba(255,255,255,0) 3%, rgba(255,255,255,.8) 12%, rgba(255,255,255,.85) 50%, rgba(255,255,255,.8) 88%, rgba(255,255,255,0) 97%)";
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

      if (window.innerHeight >= window.innerWidth*1.5 ){
        main.borderRadius = '28em';
        btn.forEach(el => {
          el.fontSize = '2rem';
          el.padding = '.4rem 2.4rem';
          el.margin = "0 3%";
          el.borderRadius = '1.8em';
          el.fontWeight = '800';
          el.letterSpacing = ".1em";
        })
      } else {
        btn.forEach(el => {
          el.fontSize = '2.5rem';
          el.padding = '.5rem 3rem';
          el.margin = "0 2%";
          el.borderRadius = '1.8em';
        })
      }

  petInfo.style.display = 'block';
  imgCont.style.height = '68%';
  
  const footer = document.getElementById('footer'); 
  footer.style.height = '7vh';
  document.getElementById('footer').querySelector('a').style.fontSize = '2.2rem';
}

//retrieve template for APIs and input pet data
function getInfo(){
  fetch('https://api.rescuegroups.org/v5/public/animals/search/available/haspic/?sort=random&limit=1&fields[attributes]',{
    method: "GET",
    headers: {
      "Content-Type":"application/vnd.api+json",
      "Authorization":"Eq0WwliZ"
  },cache:'default'})
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data);
        let info = data.data[0].attributes;

        document.querySelector('h2').innerText = info.name;
        // console.log(info.name);
        if(info.ageString){
          document.querySelector('h3').innerText = "Age: " + info.ageString;
        } else if(!info.ageString){
          document.querySelector('h3').innerText = "Age group: "+ info.ageGroup;
        } else { 
          document.querySelector('h3').innerText = "Age unknown";
        } 
        let orgInfo = data.included.find(findContactInfo).attributes;
        document.querySelector('h4').innerText = "Location: " + orgInfo.citystate;

        const petPic = imgCont.querySelector('img'); //do not add .src to this
        //pulls the image file information from the data. 
        let picInfo = data.included.find(findImgInfo); //dont add attributes
        function findImgInfo(obj){
          return obj.type === 'pictures';
        }
        let img404 = document.createElement('h5');
        if(!picInfo){
          petPic.style.display = 'none';
          console.log("no image found");
          // petPic.src = 'https://cdn.searchenginejournal.com/wp-content/uploads/2020/08/404-pages-sej-5f3ee7ff4966b.png'
          //or 'https://http.cat/404.png' 
          //or 'https://peoplewithpets.com/wp-content/uploads/2019/11/people-with-pets-no-image-available.jpg'

          //create text block
          img404.textContent = `We couldn't get a good picture of ${info.name}, but you can request more information by contacting ${orgInfo.name}`;
          imgCont.appendChild(img404);
        } else {
          petPic.src = picInfo.attributes.original.url;
          imgCont.style.display = 'inline-flex';
          imgCont.style.visibility = 'visible';
          imgCont.querySelectorAll('h5').remove();
          petPic.style.display = 'inherit';
          console.log('no error');
          //establishing variables for image width and height for ease of use
          let imgWidth = picInfo.attributes.original.resolutionX;
          let imgHeight = picInfo.attributes.original.resolutionY;
            //if the height of img < 600px, change img obj(ect-fit: cover
            if ((imgHeight <= 600) || 
                (imgHeight < (imgWidth + (imgHeight * 1.2))) ||
                (imgWidth > imgHeight*1.5)){
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
function findContactInfo(obj){
  return obj.type === 'orgs';
}