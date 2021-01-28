import { Canvas } from './modules/canvas.js';
import { ResonanceController } from './modules/reasonnance.js'

document.addEventListener("DOMContentLoaded", function() {
  let canvas                = document.querySelector("#scene-canvas")
  let playButton            = document.querySelector("#play-btn")
  let soundTable            = document.querySelector(".sound-table")
  let soundsItem            = document.querySelectorAll(".sound-item")
  let canvasContainer       = document.querySelector("#scene-canvas-container")

  /* Upload relative fields */
  let uploadCollapse         = document.querySelector("#upload-controller")
  let uploadForm             = document.querySelector("#upload-form")
  let uploadInput            = document.querySelector("#sounds-upload__input")
  let uploadButton           = document.querySelector("#sounds-upload__button")
  let uploadLabel            = document.querySelector("#sounds-upload__label")

  let playAllButton          = document.querySelector(".play-all")

  let defaultLabelText       = "Aucun fichier sélectionné"
  let elements               = [
      {x: 0.5, y: 0.5, path: "",radius: 0.04, alpha: 0.75, clickable: true, type: "listener",
          icon: "listener.svg"}
  ]
  let ctx                   = canvas.getContext('2d')
  let canvasController      = null
  let resonanceController   = null
  let selectedElement       = null

  uploadLabel.textContent = defaultLabelText;
  uploadLabel.title       = defaultLabelText;
  canvas.width  = canvasContainer.clientWidth
  canvas.height = canvasContainer.clientHeight

  playButton.addEventListener('click', function(e) {
    /* Chrome doesn't allow audio context creation until user action */
    if(!resonanceController) resonanceController =  new ResonanceController(elements)
    if(!canvasController) canvasController = new Canvas(canvas, elements, resonanceController)
    resonanceController.playAll()

    canvas.addEventListener('drop', (e) => {
      e.preventDefault()

      if(selectedElement != null) {
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) / canvas.width
        const y = (e.clientY - rect.top) / canvas.height

        /* Generating new element then add it to the audio scene */
        let el = { x: x, y: y, radius: 0.04, alpha: 0.75, playing: true, clickable: true, type: "emitter",
          icon: `emitters/emitter${elements.length}.svg`, path: selectedElement.path, ext: selectedElement.ext}

        /* remove element from the list */
        let droppedElement = document.querySelector(`.sound-item[data-path='${selectedElement.path}']`)
        droppedElement.style.display = 'none'

        canvasController.addElement(el)

        addSoundDOM(el, soundTable, canvasController, resonanceController)
        /* reset selected element to null */
        selectedElement = null
      }
    })

    canvas.addEventListener('dragover', (e) => {
      e.preventDefault()
    })

    soundsItem.forEach((item) => {
      item.addEventListener('dragstart', (e) => {
        selectedElement = {
          path: item.dataset.path,
          ext: item.dataset.ext
        }
      })
    })

    playAllButton.addEventListener('click', (e) => {
      /* retrieve all buttons and pass it to the functions */
      let allButtons = soundTable.querySelectorAll('.single-control-button')

      if(playAllButton.textContent == 'Stop All') {
        stopAll(resonanceController, playAllButton, allButtons)
      } else {
        playAll(resonanceController, playAllButton, allButtons)
      }
    })

  })

  uploadButton.addEventListener('click', (e) => {
    uploadInput.click();
  })

  uploadInput.addEventListener('change', (e) => {
    let fileNameList = Array.from(uploadInput.files).map((file) => {
      return file.name
    })

    uploadLabel.textContent = fileNameList.join(', ') || defaultLabelText;
    uploadLabel.title = uploadLabel.textContent;
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
        updateSoundsList(xhr.response.data)
      }
    }
    xhr.open('POST', '/upload');
    xhr.send(formData);
  })

  function updateSoundsList(sounds){
    let soundBag = document.querySelector("#sounds-bag")

    sounds.forEach((sound) => {
      let element     = document.createElement('div')
      let elementText = document.createTextNode(sound.name)
      let arr         = sound.name.split('.')

      element.dataset.path = arr[0]
      element.dataset.ext  = arr[1]
      element.draggable    = true

      element.classList.add('sound-item')

      element.addEventListener('dragstart', (e) => {
        selectedElement = { path: element.dataset.path, ext: element.dataset.ext}
      })

      element.appendChild(elementText)
      soundBag.appendChild(element)
    })
  }

  function addSoundDOM(element, table, canvasController, resonanceController) {
    let tr         = document.createElement('tr')
    let tdTitle    = document.createElement('td')
    let tdStatus   = document.createElement('td')
    let tdDelete   = document.createElement('td')
    let button     = document.createElement('button')
    let deleteIc   = document.createElement('img')
    let tbody      = table.querySelector('tbody')
    let noDataRow  = tbody.querySelector('.no-data')
    let playAllRow = tbody.querySelector('.play-all-row')

    deleteIc.addEventListener('click', (e) => {
      canvasController.removeElement(element)

      let DOMElement = document.querySelector(`.sound-item[data-path='${element.path}']`)
      DOMElement.style.display = 'revert'

      tr.remove()
      /* display empty message if no more data */
      if(tbody.querySelectorAll('tr').length == 2) {
        noDataRow.style.display  = 'revert'
        playAllRow.style.display = 'none'
      }
    })

    button.addEventListener('click', (e) => {
      resonanceController.swapPlayingStatus(element)
      if(button.textContent == 'Pause') {
        button.textContent = 'Playing'
        button.classList.remove("single-pause-button")
      } else {
        button.textContent = 'Pause'
        button.classList.add("single-pause-button")
      }
    })

    deleteIc.src = 'assets/images/cancel.png'
    tdDelete.append(deleteIc)

    button.textContent     = 'Playing'
    button.attributes.type = 'button'
    button.classList.add('single-control-button')
    button.classList.add('single-button')

    tdTitle.append(element.path)
    tdTitle.classList.add('sound-path-cell')
    tdStatus.append(button)

    let arr  = [tdTitle, tdStatus, tdDelete]
    tr.append(...arr)

    noDataRow.style.display  = 'none'
    playAllRow.style.display = 'revert'

    tbody.appendChild(tr)
  }

  function playAll(resonanceController, playAllButton, allButtons) {
    resonanceController.playAll()
    playAllButton.textContent = 'Stop All'
    playAllButton.classList.add('single-pause-button')
    allButtons.forEach((btn) => {
      btn.classList.remove('single-pause-button')
      btn.textContent = 'Playing'
    })
  }

  function stopAll(resonanceController, playAllButton, allButtons) {
    resonanceController.stopAll()
    playAllButton.textContent = 'Play All'
    playAllButton.classList.remove('single-pause-button')
    allButtons.forEach((btn) => {
      btn.classList.add('single-pause-button')
      btn.textContent = 'Stop'
    })
  }
});



