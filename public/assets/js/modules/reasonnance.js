export class ReasonnanceController {

    constructor(elements) {
        this.audioElements = []
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
            let audioElement = document.createElement('audio');
            audioElement.src = `public/audio/${element.path}.mp3`;
            audioElement.crossOrigin = 'anonymous';
            audioElement.load();
            audioElement.loop = true;

            let audioElementSource = this.audioContext.createMediaElementSource(audioElement);
            let source = this.resonanceAudioScene.createSource();
            audioElementSource.connect(source.input);
            source.setPosition(0, 0, 0);
            this.audioElements.push(audioElement)
        })
    }

    playAll() {
        this.audioElements?.forEach(element => {
            element.play()
        })
    }

}
