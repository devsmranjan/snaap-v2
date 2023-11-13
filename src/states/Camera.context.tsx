import {
    Accessor,
    JSX,
    Setter,
    createContext,
    createEffect,
    createSignal,
    useContext,
} from 'solid-js';
import { useDbContext } from './Database.context';

type MediaOptionType = 'video' | 'photo';
type FilterColorType =
    | 'transparent'
    | '#ff000030'
    | '#1100ff30'
    | '#15ff0030'
    | '#ff008030';

interface CameraProviderProps {
    children: JSX.Element;
}

export interface ICameraContext {
    setCameraViewRef: (ref: HTMLVideoElement | null) => void;
    cameraViewRef: () => HTMLVideoElement | null;
    startRecording: () => void;
    stopRecording: () => void;
    takePhoto: () => void;
    hasPermission: Accessor<boolean>;
    mediaOption: Accessor<MediaOptionType>;
    setMediaOption: Setter<MediaOptionType>;
    recording: Accessor<boolean>;
    filterColor: Accessor<FilterColorType>;
    setFilterColor: Setter<FilterColorType>;
    availableFilters: Accessor<FilterColorType[]>;
    micEnabled: Accessor<boolean>;
    setMicEnabled: Setter<boolean>;
}

const CameraContext = createContext<ICameraContext>();

export const CameraProvider = (props: CameraProviderProps) => {
    const db = useDbContext();

    const [cameraViewRef, setCameraViewRef] =
        createSignal<HTMLVideoElement | null>(null);
    const [stream, setStream] = createSignal<MediaStream | null>(null);
    const [recorder, setRecorder] = createSignal<MediaRecorder | null>(null);
    const [chunks, setChunks] = createSignal<BlobPart[]>([]);
    const [hasPermission, setHasPermission] = createSignal<boolean>(true);
    const [mediaOption, setMediaOption] =
        createSignal<MediaOptionType>('video');
    const [recording, setRecording] = createSignal<boolean>(false);
    const [micEnabled, setMicEnabled] = createSignal<boolean>(true);
    const [availableFilters, setAvailableFilters] = createSignal<
        FilterColorType[]
    >([]);
    const [filterColor, setFilterColor] =
        createSignal<FilterColorType>('transparent');

    // Add stream to video element
    createEffect(() => {
        const ref = cameraViewRef();

        if (!ref) {
            return;
        }

        ref.srcObject = stream();
    });

    // Initial values for video & photo
    createEffect(() => {
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

        stopRecording();
        setMicEnabled(true);
    });

    // Enable/disable mic
    createEffect(() => {
        const audioTracks = stream()?.getAudioTracks() ?? [];

        if (micEnabled()) {
            // enable mic
            audioTracks.forEach((track) => (track.enabled = true));
            return;
        }

        // disable mic
        audioTracks.forEach((track) => (track.enabled = false));
    });

    // initialize
    (async () => {
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

                db.add('video', blob);
            };

            setRecorder(recorder);
        } catch (error) {
            console.error("couldn't get media devices");
            console.error(error);

            setHasPermission(false);
        }
    })();

    // const download = (url: string) => {
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = mediaOption() === 'video' ? 'video.mp4' : 'photo.png';
    //     a.click();
    // };

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

    // Capture photo
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

        // canvas to blob
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('blob is null');
                return;
            }

            db.add('image', blob);
        }, 'image/png');
    };

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
                micEnabled,
                setMicEnabled,
            }}
        >
            {props.children}
        </CameraContext.Provider>
    );
};

export const useCameraContext = () =>
    useContext(CameraContext) as ICameraContext;
