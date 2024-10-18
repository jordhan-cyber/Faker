const gestureText = document.getElementById('gestureText');

        let previousX = null;
        let direction = null;
        let waveCount = 0;

        // Detectar si la mano está abierta
        function isHandOpen(landmarks) {
            return landmarks[4].y < landmarks[3].y && 
                   landmarks[8].y < landmarks[6].y && 
                   landmarks[12].y < landmarks[10].y && 
                   landmarks[16].y < landmarks[14].y && 
                   landmarks[20].y < landmarks[18].y;
        }

        // Detectar el gesto de ola (movimiento de lado a lado)
        function detectWave(landmarks) {
            const handX = landmarks[9].x;

            if (previousX === null) {
                previousX = handX;
                return false;
            }

            if (handX < previousX) {
                if (direction !== 'left') {
                    direction = 'left';
                    waveCount++;
                }
            } else if (handX > previousX) {
                if (direction !== 'right') {
                    direction = 'right';
                    waveCount++;
                }
            }

            previousX = handX;

            return waveCount >= 2 ? (waveCount = 0, true) : false;
        }

        // Función para detectar gestos
        function detectGesture(landmarks) {
            if (detectWave(landmarks)) {
                return "Hola";
            }

            if (isHandOpen(landmarks) && landmarks[9].y > landmarks[0].y) {
                return "Buenos días";
            }

            if (isHandOpen(landmarks) && detectWave(landmarks)) {
                return "Adiós";
            }

            if (!isHandOpen(landmarks) && landmarks[8].y < landmarks[6].y) {
                return "¿Cómo estás?";
            }

            if (isHandOpen(landmarks) && landmarks[9].y < landmarks[0].y) {
                return "Madre";
            }

            if (isHandOpen(landmarks) && landmarks[9].y > landmarks[0].y) {
                return "Padre";
            }

            if (landmarks[4].y < landmarks[3].y && 
                landmarks[8].y < landmarks[6].y && 
                landmarks[12].y < landmarks[10].y && 
                landmarks[16].y < landmarks[14].y && 
                !landmarks[20].y < landmarks[18].y) {
                return "Hermano";
            }

            if (!isHandOpen(landmarks)) {
                return "Comprar";
            }

            if (isHandOpen(landmarks) && landmarks[9].x > landmarks[5].x) {
                return "Vender";
            }

            if (isHandOpen(landmarks) && landmarks[9].y < landmarks[0].y && landmarks[9].x < landmarks[0].x) {
                return "Descansar";
            }

            return null;
        }

        // Configuración de MediaPipe Hands
        const videoElement = document.getElementById('webcam');
        const canvasElement = document.getElementById('output');
        const canvasCtx = canvasElement.getContext('2d');

        const hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults((results) => {
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
                    drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});

                    // Detectar frases (gestos)
                    const detectedPhrase = detectGesture(landmarks);
                    if (detectedPhrase) {
                        console.log("Frase detectada: " + detectedPhrase);
                        gestureText.value += detectedPhrase + "\n"; // Agregar la frase detectada al cuadro de texto
                    }
                }
            }
        });

        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({image: videoElement});
            },
            width: 640,
            height: 480
        });
        camera.start();