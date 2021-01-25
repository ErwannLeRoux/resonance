import { Canvas } from './modules/canvas.js';
import { ReasonnanceController } from './modules/reasonnance.js'

document.addEventListener("DOMContentLoaded", function() {
  let canvas                = document.querySelector("#scene-canvas")
  let playButton            = document.querySelector("#play-btn")
  let elements              = [
      {x: 0, y: 0, path: "coeur"},
      {x: 0, y: 0, path: "coeur"},
      {x: 0, y: 0, path: "coeur"}
  ]
  let ctx                   = canvas.getContext('2d')
  let canvasController      = new Canvas(canvas, elements)
  let reasonnanceController = null

  playButton.addEventListener('click', function(e) {
      /* Chrome doesn't allow audio context creation until user action */
      if(!reasonnanceController) reasonnanceController =  new ReasonnanceController(elements)
      reasonnanceController.playAll()
  })
});
