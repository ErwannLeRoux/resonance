import { Canvas } from './modules/canvas.js';
import { ResonanceController } from './modules/reasonnance.js'

document.addEventListener("DOMContentLoaded", function() {
  let canvas                = document.querySelector("#scene-canvas")
  let playButton            = document.querySelector("#play-btn")
  let elements              = [

      {x: 0.5, y: 0.5, path: "emmanuel/accepterLesCookies.wav",radius: 0.04, alpha: 0.75, clickable: true, type: "listener",
          icon: "listener.svg"},
      {x: 0.25, y: 0.5, path: "emmanuel/accessibilite.wav",radius: 0.04, alpha: 0.75, clickable: true, type: "emitter",
          icon : "emitters/emitter1.svg"},
      {x: 0.75, y: 0.5, path: "emmanuel/accepterLesCoockies.wav",radius: 0.04, alpha: 0.75, clickable: true, type: "emitter",
          icon : "emitters/emitter2.svg"},
  ]

  let ctx                   = canvas.getContext('2d')
  let canvasController      = null
  let resonanceController   = null

  playButton.addEventListener('click', function(e) {
    /* Chrome doesn't allow audio context creation until user action */
    if(!resonanceController) resonanceController =  new ResonanceController(elements)
    if(!canvasController) canvasController = new Canvas(canvas, elements, resonanceController)
    resonanceController.playAll()
  })


  /* Upload */
  let uploadCollapse         = document.querySelector("#upload-controller")
  let uploadForm             = document.querySelector("#upload-form")
  let uploadInput            = document.querySelector("#sounds-upload__input")
  let uploadButton           = document.querySelector("#sounds-upload__button")
  let uploadLabel            = document.querySelector("#sounds-upload__label")
  let uploadInputContainer   = document.querySelector("#sounds-input__container")
  let defaultLabelText       = "Aucun fichier sélectionné"
  
  uploadLabel.textContent = defaultLabelText;
  uploadLabel.title = defaultLabelText;

  uploadButton.addEventListener('click', (e) => {
    uploadInput.click();
  })

  uploadInput.addEventListener('change', (e) => {
    let fileNameList = Array.from(uploadInput.files).map((file) => {
      return file.name
    })

    uploadLabel.textContent = fileNameList.join(', ') || defaultLabelText;
    uploadLabel.title = label.textContent;
  })

  uploadCollapse.addEventListener("click", (e) =>{
    e.preventDefault()
    if(uploadForm.classList.contains("hidden")){
      uploadForm.classList.remove("hidden")
    }else{
      uploadForm.classList.add("hidden")
    }
  })

  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let soundfiles = uploadInput.files

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
  let soundBag = document.querySelector("#sounds-bag")
  sounds.forEach((sound) => {
    let element     = document.createElement('div')
    let elementText = document.createTextNode(sound.name)

    element.classList.add('sound-item')
    element.appendChild(elementText)
    soundBag.appendChild(element)
  })
}
