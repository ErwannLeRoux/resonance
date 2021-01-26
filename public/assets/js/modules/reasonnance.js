export class ResonanceController {

    constructor(elements) {
        this.audioReady          = false
        this.audioElements       = []
        this.soundSources        = []
        this.audioContext        = new AudioContext();
        this.resonanceAudioScene = new ResonanceAudio(this.audioContext)
        this.roomDimensions      = { width: 10, height: 10, depth: 3.4 }

        this.resonanceAudioScene.output.connect(this.audioContext.destination)

        elements?.forEach(element => {
            if(element.type == 'emitter') {
                let audioElement         = document.createElement('audio');

                audioElement.src         = `resources/audio/${element.path}`;
                audioElement.crossOrigin = 'anonymous';
                audioElement.loop        = true;

                audioElement.load();

                let audioElementSource = this.audioContext.createMediaElementSource(audioElement);
                let source             = this.resonanceAudioScene.createSource();
                audioElement.volume    = 1

                audioElementSource.connect(source.input);

                source.setPosition(this.roomDimensions.width * element.x, this.roomDimensions.height * element.y,
                    0);
                this.audioElements.push(audioElement)
                this.soundSources.push(source)
            }
        })
        this.audioReady = true
    }

    updateSources(elements) {
        if(!this.audioReady) {
            return
        }

        /* get listener element */
        let listenerElement = elements.find(el => el.type == 'listener')

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

    playAll() {
        this.audioElements?.forEach(element => {
            element.play()
        })
    }
}
