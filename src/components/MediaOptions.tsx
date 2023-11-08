import { useCameraContext } from '../states/Camera.context';

const MediaOptions = () => {
    const { mediaOption, setMediaOption } = useCameraContext();

    return (
        <div>
            <button
                class={mediaOption() === 'video' ? 'active' : ''}
                onClick={() => setMediaOption('video')}
            >
                Video
            </button>
            <button
                class={mediaOption() === 'photo' ? 'active' : ''}
                onClick={() => setMediaOption('photo')}
            >
                Photo
            </button>
        </div>
    );
};

export default MediaOptions;
