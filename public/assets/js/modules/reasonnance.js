export class ResonanceController {

    constructor(elements) {
        this.audioReady          = false
        this.audioElements       = []
        this.soundSources        = []
        this.audioContext        = new AudioContext();
        this.resonanceAudioScene = new ResonanceAudio(this.audioContext)
        this.roomDimensions      = { width: 10, height: 10, depth: 3.4 }

        this.resonanceAudioScene.output.connect(this.audioContext.destination)
        this.resonanceAudioScene.setAmbisonicOrder(3)

        elements?.forEach(element => {
            if(element.type == 'emitter') {
                this.addAudioElement(elements, element)
            }
        })
        this.audioReady = true
    }

    updateSources(elements) {
        if(!this.audioReady) {
            return
        }


        for (let i = 0; i < elements.length; i++) {
            let x = (elements[i].x - 0.5) * this.roomDimensions.width / 2;
            let y = 0;
            let z = (elements[i].y - 0.5) * this.roomDimensions.depth / 2;
            if (elements[i].type == 'emitter') {
                this.soundSources[i-1].setPosition(x, y, z);
            } else if(elements[i].type == 'listener'){
                this.resonanceAudioScene.setListenerPosition(x, y, z);
            }
        }
    }

    addAudioElement(elements, element) {
        let audioElement         = document.createElement('audio');

        audioElement.src         = `resources/audio/${element.path}`;
        audioElement.crossOrigin = 'anonymous';
        audioElement.loop        = true;
        audioElement.id          = element.path

        audioElement.load();

        let audioElementSource = this.audioContext.createMediaElementSource(audioElement);
        let source             = this.resonanceAudioScene.createSource();
        source.id              = element.path

        audioElementSource.connect(source.input);

        source.setPosition(this.roomDimensions.width*element.x, this.roomDimensions.height*element.y, this.roomDimensions.depth * element.z );

        this.audioElements.push(audioElement)
        this.soundSources.push(source)
        audioElement.play()

        // have to update sources
        this.updateSources(elements)
    }

    removeAudioElement(element) {
        /* Delete audio element and source */
        let toDelete = this.audioElements.find((audioEl) => {
            return audioEl.id == element.path
        })
        toDelete.pause()

        let sourceToDelete = this.soundSources.find(s => {
            return s.id == element.path
        })

        let index = this.audioElements.indexOf(toDelete);
        if (index > -1) {
            this.audioElements.splice(index, 1)
        }

        index = this.soundSources.indexOf(sourceToDelete);
        if (index > -1) {
            this.soundSources.splice(index, 1)
        }
    }

    playAll() {
        this.audioElements?.forEach(element => {
            element.play()
        })
    }

    stopAll() {
        this.audioElements?.forEach(element => {
            element.stop()
        })
    }

    swapPlayingStatus(element) {
        let toPause = this.audioElements.find((audioEl) => {
            return audioEl.id == element.path
        })

        if(element.playing) {
            toPause.pause()
            toPause.currentTime = 0
            element.playing = false
        } else {
            toPause.play()
            element.playing = true
        }
    }
}
