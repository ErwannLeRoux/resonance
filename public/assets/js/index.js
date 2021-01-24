$(document).ready(function() {

    let $button = $("#play-btn")
    $button.on('click', function() {
        // Create an AudioContext
        let audioContext = new AudioContext();

        // Create a (first-order Ambisonic) Resonance Audio scene and pass it
        // the AudioContext.
        let resonanceAudioScene = new ResonanceAudio(audioContext);

        resonanceAudioScene.output.connect(audioContext.destination)

        let roomDimensions = {
          width: 3.1,
          height: 2.5,
          depth: 3.4,
        };



        let roomMaterials = {
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

        // Create an AudioElement.
        let audioElement = document.createElement('audio');

        // Load an audio file into the AudioElement.
        audioElement.src = 'public/audio/coeur.mp3';
        audioElement.crossOrigin = 'anonymous';
        audioElement.load();
        audioElement.loop = true;

        let audioElementSource = audioContext.createMediaElementSource(audioElement);

        let source = resonanceAudioScene.createSource();
        audioElementSource.connect(source.input);

        source.setPosition(0, 0, 0);

        // Play the audio.
        audioElement.play();
    })
})
