import { useCameraContext } from '../states/Camera.context';

const CameraActions = () => {
    const { startRecording, stopRecording, takePhoto, mediaOption } =
        useCameraContext();

    return (
        <div>
            {mediaOption() === 'photo' ? (
                <button
                    class="mb-2 mr-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    onClick={() => takePhoto()}
                >
                    Take Photo
                </button>
            ) : null}

            {mediaOption() === 'video' ? (
                <>
                    <button
                        class="mb-2 mr-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                        onClick={startRecording}
                    >
                        Start Recording
                    </button>
                    <button
                        class="mb-2 mr-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                        onClick={stopRecording}
                    >
                        Stop Recording
                    </button>
                </>
            ) : null}
        </div>
    );
};

export default CameraActions;
