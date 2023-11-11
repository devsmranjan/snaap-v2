import { JSX, createContext, createSignal, useContext } from 'solid-js';
import { effect } from 'solid-js/web';

type MediaOptionType = 'video' | 'photo';
type FilterColorType =
    | 'transparent'
    | '#ff000030'
    | '#1100ff30'
    | '#15ff0030'
    | '#ff008030';

const [cameraViewRef, setCameraViewRef] = createSignal<HTMLVideoElement | null>(
    null
);
const [stream, setStream] = createSignal<MediaStream | null>(null);
const [recorder, setRecorder] = createSignal<MediaRecorder | null>(null);
const [chunks, setChunks] = createSignal<BlobPart[]>([]);
const [mediaUrl, setMediaUrl] = createSignal<string | null>(null);
const [hasPermission, setHasPermission] = createSignal<boolean>(true);
const [mediaOption, setMediaOption] = createSignal<MediaOptionType>('video');
const [recording, setRecording] = createSignal<boolean>(false);
const [availableFilters, setAvailableFilters] = createSignal<FilterColorType[]>(
    []
);
const [filterColor, setFilterColor] =
    createSignal<FilterColorType>('transparent');

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
            download(url);

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

    setRecording(true);
};

const stopRecording = () => {
    const r = recorder();

    if (!r) {
        console.error('recorder is not initialized');
        return;
    }

    r.stop();

    setRecording(false);
};

const takePhoto = () => {
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

    context.drawImage(element, 0, 0, width, height);

    context.fillStyle = filterColor() ?? 'none';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const url = canvas.toDataURL('image/png');

    // download
    download(url);

    setMediaUrl(url);
};

const download = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = mediaOption() === 'video' ? 'video.mp4' : 'photo.png';
    a.click();
};

init();

effect(() => {
    const ref = cameraViewRef();

    if (!ref) {
        return;
    }

    ref.srcObject = stream();
});

effect(() => {
    if (mediaOption() === 'video') {
        setFilterColor('transparent');
        setAvailableFilters([]);

        return;
    }

    setAvailableFilters([
        'transparent',
        '#ff000030',
        '#1100ff30',
        '#15ff0030',
        '#ff008030',
    ]);
});

const CameraContext = createContext(
    {
        setCameraViewRef,
        cameraViewRef,
        startRecording,
        stopRecording,
        takePhoto,
        hasPermission,
        mediaOption,
        setMediaOption,
        recording,
        filterColor,
        setFilterColor,
        availableFilters,
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
                mediaOption,
                setMediaOption,
                recording,
                filterColor,
                setFilterColor,
                availableFilters,
            }}
        >
            {props.children}
        </CameraContext.Provider>
    );
};

export const useCameraContext = () => useContext(CameraContext);
