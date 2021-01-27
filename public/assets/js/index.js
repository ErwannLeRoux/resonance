import { Canvas } from './modules/canvas.js';
import { ResonanceController } from './modules/reasonnance.js'

document.addEventListener("DOMContentLoaded", function() {
  let canvas                = document.querySelector("#scene-canvas")
  let playButton            = document.querySelector("#play-btn")
  let elements              = [
      {x: 0.5, y: 0.5, path: "",radius: 0.04, alpha: 0.75, clickable: true, type: "listener",
          icon: "listener.svg"}
  ]

  let ctx                   = canvas.getContext('2d')
  let canvasController      = null
  let resonanceController   = null

  let soundTable       = document.querySelector(".sound-table")
  let uploadController = document.querySelector("#upload-controller")
  let sounds           = document.querySelector("#sounds-upload")
  let form             = document.querySelector("#upload-form")
  let soundsItem       = document.querySelectorAll(".sound-item")
  let selectedElement  = null

  canvas.addEventListener('drop', (e) => {
    e.preventDefault()

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / canvas.width
    const y = (e.clientY - rect.top) / canvas.height

    /* Generating new element then add it to the audio scene */
    let el = { x: x, y: y, radius: 0.04, alpha: 0.75, playing: true, clickable: true, type: "emitter",
      icon: `emitters/emitter${elements.length}.svg`, path: selectedElement}

    canvasController.addElement(el)
    addSoundDOM(el, soundTable, canvasController, resonanceController)
  })

  soundsItem.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      selectedElement = item.id
    })

    canvas.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
  })

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

function addSoundDOM(element, table, canvasController, resonanceController) {
  let tr       = document.createElement('tr')
  let tdTitle  = document.createElement('td')
  let tdStatus = document.createElement('td')
  let tdDelete = document.createElement('td')
  let button   = document.createElement('button')
  let deleteIc = document.createElement('img')

  deleteIc.addEventListener('click', (e) => {
    canvasController.removeElement(element)
    tr.remove()
  })

  button.addEventListener('click', (e) => {
    resonanceController.swapPlayingStatus(element)
    if(button.textContent == 'Pause') {
      button.textContent = 'Play'
    } else {
      button.textContent = 'Pause'
    }
  })

  deleteIc.src = 'assets/images/cancel.png'
  tdDelete.append(deleteIc)

  button.textContent = 'Pause'
  button.attributes.type = 'button'

  tdTitle.append(element.path)
  tdStatus.append(button)

  let arr  = [tdTitle, tdStatus, tdDelete]
  tr.append(...arr)
  table.querySelector('tbody').appendChild(tr)
}

