import { JSX, createContext, createSignal, useContext } from 'solid-js';

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

init();

const CameraContext = createContext(
    {
        stream,
        mediaUrl,
        startRecording,
        stopRecording,
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
                stream,
                mediaUrl,
                startRecording,
                stopRecording,
                hasPermission,
            }}
        >
            {props.children}
        </CameraContext.Provider>
    );
};

export const useCameraContext = () => useContext(CameraContext);
