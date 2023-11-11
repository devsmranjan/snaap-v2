import { useCameraContext } from '../states/Camera.context';

const CameraActions = () => {
    const {
        startRecording,
        stopRecording,
        takePhoto,
        mediaOption,
        recording,
        micEnabled,
        setMicEnabled,
    } = useCameraContext();

    const handlePhotoCapture = () => {
        takePhoto();
    };

    const handleRecording = () => {
        if (recording()) {
            stopRecording();

            return;
        }

        startRecording();
    };

    const handleAction = () => {
        if (mediaOption() === 'photo') {
            handlePhotoCapture();
            return;
        }

        handleRecording();
    };

    return (
        <div class="relative h-full">
            <div class="absolute bottom-0 top-0 m-auto flex w-full flex-col items-center justify-center gap-6">
                <button
                    onClick={handleAction}
                    class="flex h-20 w-20 items-center justify-center rounded-full bg-white"
                >
                    {mediaOption() === 'photo' ? (
                        <span class="material-symbols-rounded text-3xl text-gray-600">
                            photo_camera
                        </span>
                    ) : (
                        <>
                            {recording() ? (
                                <div class="h-10 w-10 rounded-full bg-red-500"></div>
                            ) : (
                                <span class="material-symbols-rounded text-3xl text-gray-600">
                                    videocam
                                </span>
                            )}
                        </>
                    )}
                </button>

                {mediaOption() === 'video' ? (
                    <button
                        class={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                            micEnabled() ? 'bg-red-600' : 'bg-gray-600'
                        }`}
                        onClick={() => setMicEnabled((prev) => !prev)}
                    >
                        <span class="material-symbols-rounded text-xl text-white">
                            {micEnabled() ? 'mic' : 'mic_off'}
                        </span>
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default CameraActions;
