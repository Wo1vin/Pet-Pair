//fetch template for APIs
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  //const choice = document.querySelector('input').value
  const url = 'https://api.nasa.gov/planetary/apod?api_key=ApOhXZtmpW9HtrMwhyttF2Zwoq1JiwjqeXD1ig8F'

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}