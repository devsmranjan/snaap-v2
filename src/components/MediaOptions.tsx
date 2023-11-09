import { useCameraContext } from '../states/Camera.context';

const MediaOptions = () => {
    const { mediaOption, setMediaOption } = useCameraContext();

    return (
        <div class="w-100 flex h-full items-center justify-center gap-2">
            <button
                type="button"
                class={`rounded-full border border-gray-300 px-7 py-2 text-xs font-medium  transition focus:outline-none ${
                    mediaOption() === 'video'
                        ? 'bg-white text-gray-900'
                        : 'bg-transparent text-white'
                }`}
                onClick={() => setMediaOption('video')}
            >
                Video
            </button>

            <button
                type="button"
                class={`rounded-full border border-gray-300 px-7 py-2 text-xs font-medium  transition focus:outline-none ${
                    mediaOption() === 'photo'
                        ? 'bg-white text-gray-900'
                        : 'bg-transparent text-white'
                }`}
                onClick={() => setMediaOption('photo')}
            >
                Photo
            </button>
        </div>
    );
};

export default MediaOptions;
