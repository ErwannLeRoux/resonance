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
  let resonanceController = null

  playButton.addEventListener('click', function(e) {
      /* Chrome doesn't allow audio context creation until user action */
      if(!resonanceController) resonanceController =  new ResonanceController(elements)
      if(!canvasController) canvasController = new Canvas(canvas, elements, resonanceController)
      resonanceController.playAll()
  })
});
