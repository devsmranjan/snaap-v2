import { JSX, createContext, createSignal, useContext } from 'solid-js';
import { effect } from 'solid-js/web';

const [cameraViewRef, setCameraViewRef] = createSignal<HTMLVideoElement | null>(
    null
);
const [stream, setStream] = createSignal<MediaStream | null>(null);
const [recorder, setRecorder] = createSignal<MediaRecorder | null>(null);
const [chunks, setChunks] = createSignal<BlobPart[]>([]);
const [mediaUrl, setMediaUrl] = createSignal<string | null>(null);
const [hasPermission, setHasPermission] = createSignal<boolean>(true);

const init = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        setStream(stream);

        const recorder = new MediaRecorder(stream);

        recorder.onstart = () => {
            console.log('recording started');

            setChunks([]);
        };

        recorder.ondataavailable = (e) => {
            console.log(e.data);

            setChunks((prev) => [...prev, e.data]);
        };

        recorder.onstop = () => {
            console.log('recording stopped');

            const blob = new Blob(chunks(), { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);

            // download

            // const a = document.createElement('a');
            // a.href = url;
            // a.download = 'video.mp4';
            // a.click();

            setMediaUrl(url);
        };

        setRecorder(recorder);
    } catch (error) {
        console.error("couldn't get media devices");
        console.error(error);

        setHasPermission(false);
    }
};

const startRecording = () => {
    const r = recorder();

    if (!r) {
        console.error('recorder is not initialized');
        return;
    }

    r.start();
};

const stopRecording = () => {
    const r = recorder();

    if (!r) {
        console.error('recorder is not initialized');
        return;
    }

    r.stop();
};

const takePhoto = (filterColor?: string | null) => {
    const element = cameraViewRef();

    if (!element) {
        console.error('element is null');
        return;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        console.error('context is null');
        return;
    }

    const width = element.videoWidth;
    const height = element.videoHeight;

    canvas.width = width;
    canvas.height = height;

    context.filter = filterColor ?? 'none';
    context.drawImage(element, 0, 0, width, height);

    const url = canvas.toDataURL('image/png');

    // download

    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.png';
    a.click();

    setMediaUrl(url);
};

init();

effect(() => {
    const ref = cameraViewRef();

    if (!ref) {
        return;
    }

    ref.srcObject = stream();
});

const CameraContext = createContext(
    {
        setCameraViewRef,
        cameraViewRef,
        startRecording,
        stopRecording,
        takePhoto,
        hasPermission,
    },
    { name: 'CameraContext' }
);

interface CameraProviderProps {
    children: JSX.Element;
}

export const CameraProvider = (props: CameraProviderProps) => {
    return (
        <CameraContext.Provider
            value={{
                setCameraViewRef,
                cameraViewRef,
                startRecording,
                stopRecording,
                takePhoto,
                hasPermission,
            }}
        >
            {props.children}
        </CameraContext.Provider>
    );
};

export const useCameraContext = () => useContext(CameraContext);
