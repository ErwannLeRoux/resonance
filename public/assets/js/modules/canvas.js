export class Canvas {

    constructor(canvas, elements, resonanceController) {
        this.resonanceController = resonanceController
        this.elements            = elements
        this.canvas              = canvas
        this.context             = canvas.getContext('2d')
        this.lastMoveEventTime   = 0
        this.minimumThreshold    = 16
        this.selected            = {
            index: -1,
            xOffset: 0,
            yOffset: 0
        }

        /* init icons */
        this.elements.forEach((el) => {
            let icon = new Image(50, 50);
            icon.src = `assets/images/${el.icon}`;
            el.icon  = icon
        })
        this.initListeners()
    }

    addElement(element) {
        this.elements.push(element)
        let icon = new Image(50, 50);
        icon.src = `assets/images/${element.icon}`;
        element.icon  = icon

        this.resonanceController.addAudioElement(this.elements, element)
        this.resize()
        this.draw()
    }

    removeElement(element) {
        const index = this.elements.indexOf(element);
        if (index > -1) {
            this.elements.splice(index, 1);
        }
        this.resonanceController.removeAudioElement(element)

        this.resize()
        this.draw()
    }

    initListeners() {
        window.addEventListener('resize', (event) => {
            this.resize();
            this.draw();
        }, false);

        this.canvas.addEventListener('touchstart', (event) => {
            this.cursorDownFunc(event);
        });

        this.canvas.addEventListener('mousedown', (event) => {
            this.cursorDownFunc(event)
        });

        this.canvas.addEventListener('touchmove', (event) => {
            let currentEventTime = Date.now();
            if (currentEventTime - this.lastMoveEventTime > this.minimumThreshold) {
                this.lastMoveEventTime = currentEventTime;
                if (this.cursorMoveFunc(event)) {
                    event.preventDefault();
                }
            }
        }, true);

        this.canvas.addEventListener('mousemove', (event) => {
            let currentEventTime = Date.now();
            if (currentEventTime - this.lastMoveEventTime > this.minimumThreshold) {
                this.lastMoveEventTime = currentEventTime;
                this.cursorMoveFunc(event);
            }
        });

        document.addEventListener('touchend', (event) => {
            this.cursorUpFunc()
        });
        document.addEventListener('mouseup', (event) => {
            this.cursorUpFunc()
        });

        this.resonanceController.updateSources(this.elements)
        this.resize()
        this.draw()
    }

    draw() {
        this.context.globalAlpha = 1;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.lineWidth   = 5;
        this.context.strokeStyle = '#bbb';
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].icon !== undefined) {
                let radiusInPixels = this.elements[i].radius * this.canvas.width;
                let x = this.elements[i].x * this.canvas.width - radiusInPixels;
                let y = this.elements[i].y * this.canvas.height - radiusInPixels;
                this.context.globalAlpha = this.elements[i].alpha;

                this.elements[i].icon.onload = () => {
                    this.context.drawImage(
                        this.elements[i].icon, x, y, radiusInPixels * 2, radiusInPixels * 2);
                }

                if(this.elements[i].icon.complete) {
                    this.context.drawImage(
                        this.elements[i].icon, x, y, radiusInPixels * 2, radiusInPixels * 2);
                }
            }
        }
    }

    resize() {
        let canvasWidth   = this.canvas.parentNode.clientWidth;
        let maxCanvasSize = 480;
        if (canvasWidth > maxCanvasSize) {
            canvasWidth = maxCanvasSize;
        }
        this.canvas.width  = canvasWidth;
        this.canvas.height = canvasWidth;
    }

    cursorDownFunc(event) {
        this.cursorDown    = true
        let cursorPosition = this.getCursorPosition(event)
        this.selected      = this.getNearestElement(cursorPosition);
        this.cursorUpdateFunc(cursorPosition);

    }

    cursorUpFunc(event) {
        this.cursorDown     = false;
        this.selected.index = -1;
        document.body.style = '';
    }

    cursorUpdateFunc(cursorPosition) {
        if (this.selected.index > -1) {
            this.elements[this.selected.index].x = Math.max(0, Math.min(1,
                (cursorPosition.x + this.selected.xOffset) / this.canvas.width));
            this.elements[this.selected.index].y = Math.max(0, Math.min(1,
                (cursorPosition.y + this.selected.yOffset) / this.canvas.height));
            this.resonanceController.updateSources(this.elements)
        }
        this.draw();
    }

    cursorMoveFunc(event) {
        let cursorPosition = this.getCursorPosition(event);
        let selection      = this.getNearestElement(cursorPosition);

        if (this.cursorDown == true) {
            this.cursorUpdateFunc(cursorPosition);
        }
        if (selection.index > -1) {
            this.canvas.style.cursor = 'pointer';
            return true;
        } else {
            this.canvas.style.cursor = 'default';
            return false;
        }
    }

    getCursorPosition(event) {
        let cursorX;
        let cursorY;
        let rect = this.canvas.getBoundingClientRect();
        if (event.touches !== undefined) {
            cursorX = event.touches[0].clientX;
            cursorY = event.touches[0].clientY;
        } else {
            cursorX = event.clientX;
            cursorY = event.clientY;
        }
        return {
            x: cursorX - rect.left,
            y: cursorY - rect.top,
        };
    }

    getNearestElement(cursorPosition) {
        let minDistance = 1e8;
        let minIndex = -1;
        let minXOffset = 0;
        let minYOffset = 0;
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].clickable == true) {
                let dx = this.elements[i].x * this.canvas.width - cursorPosition.x;
                let dy = this.elements[i].y * this.canvas.height - cursorPosition.y;
                let distance = Math.abs(dx) + Math.abs(dy);
                if (distance < minDistance &&
                    distance < 2 * this.elements[i].radius * this.canvas.width) {
                    minDistance = distance;
                    minIndex    = i;
                    minXOffset  = dx;
                    minYOffset  = dy;
                }
            }
        }

        return {
            index: minIndex,
            xOffset: minXOffset,
            yOffset: minYOffset,
        };
    }

}
