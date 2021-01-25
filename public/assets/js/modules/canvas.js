export class Canvas {

    constructor(canvas, elements) {
        this.elements = elements
        this.canvas   = canvas
        this.initListeners()
    }

    addElement(element) {
        this.elements.push(element)
    }

    initListeners() {
        this.canvas.addEventListener('mousedown', function(event) {

        });

        this.canvas.addEventListener('touchmove', function(event) {

        }, true);

        this.canvas.addEventListener('mousemove', function(event) {

        });

        document.addEventListener('touchend', function(event) {

        });

        document.addEventListener('mouseup', function(event) {

        });
    }
}
