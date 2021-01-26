export class ResonanceController {

    constructor(elements) {
        this.audioReady = false
        this.audioElements = []
        this.soundSources = []
        this.audioContext = new AudioContext();
        this.resonanceAudioScene = new ResonanceAudio(this.audioContext);
        this.resonanceAudioScene.output.connect(this.audioContext.destination)
        this.roomDimensions = { width: 3.1, height: 2.5, depth: 3.4 };
        this.roomMaterials = {
          // Room wall materials
          left: 'brick-bare',
          right: 'curtain-heavy',
          front: 'marble',
          back: 'glass-thin',
          // Room floor
          down: 'grass',
          // Room ceiling
          up: 'transparent',
        };

        elements?.forEach(element => {
            if(element.type == 'emitter') {
                let audioElement = document.createElement('audio');
                audioElement.src = `resources/audio/${element.path}`;
                audioElement.crossOrigin = 'anonymous';
                audioElement.load();
                audioElement.loop = true;

                let audioElementSource = this.audioContext.createMediaElementSource(audioElement);
                let source = this.resonanceAudioScene.createSource();
                audioElementSource.connect(source.input);

                source.setPosition(this.roomDimensions.width * element.x, this.roomDimensions.height * element.y, 0);
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
