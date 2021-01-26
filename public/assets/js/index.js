import { Canvas } from './modules/canvas.js';
import { ReasonnanceController } from './modules/reasonnance.js'

document.addEventListener("DOMContentLoaded", function() {
  let canvas                = document.querySelector("#scene-canvas")
  let playButton            = document.querySelector("#play-btn")
  let elements              = [
      {x: 0.5, y: 0.5, path: "clavier"},
      {x: 0.75, y: 0, path: "coeur"},
      {x: 0, y: 0.75, path: "foret"}
  
  ]
  let ctx                   = canvas.getContext('2d')
  let canvasController      = new Canvas(canvas, elements)
  let reasonnanceController = null

  playButton.addEventListener('click', function(e) {
      /* Chrome doesn't allow audio context creation until user action */
      if(!reasonnanceController) reasonnanceController =  new ReasonnanceController(elements)
      reasonnanceController.playAll()
  })

  // UPLOAD 
  let uploadController = document.querySelector("#upload-controller")
  uploadController.addEventListener("click", (e) =>{
    e.preventDefault()
    let uploadForm = document.querySelector("#upload-form")
    if(uploadForm.classList.contains("hidden")){
      uploadForm.classList.remove("hidden")
    }else{
      uploadForm.classList.add("hidden")
    }
    

  })

  let sounds = document.querySelector("#sounds-upload")
  let form = document.querySelector("#form-upload")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    let soundfiles = sounds.files

    let formData = new FormData()
    Array.from(soundfiles).forEach(soundfile => {
      formData.append('sounds', soundfile)
    }) 

    formData.append('sounds', soundfiles)
    let xhr = new XMLHttpRequest()
    xhr.responseType = 'json'
    xhr.onload = () => {
      if(xhr.response.status == "success"){
        actualiseSoundsList(xhr.response.data)
      }
    }
    xhr.open('POST', '/upload');
    xhr.send(formData);
  })

});

function actualiseSoundsList(sounds){
  let soundBag = document.querySelector("#sounds-container")
  sounds.forEach((sound) => {
    let element = document.createElement('div')
    element.classList.add('sound-item')
    let elementText = document.createTextNode(sound.name)
    element.appendChild(elementText)
    soundBag.appendChild(element)
  })
}