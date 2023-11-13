import { For } from 'solid-js';
import { useDbContext } from '../states/Database.context';

const Gallery = () => {
    const { getAll, mediaList } = useDbContext();

    getAll();

    return (
        <div class="grid">
            <For each={mediaList()}>
                {(media) => (
                    <div class="h-60 w-32">
                        {media?.type === 'video' ? (
                            <video
                                src={media?.mediaUrl}
                                class="h-full w-full"
                                autoplay
                                muted
                                loop
                            ></video>
                        ) : (
                            <img
                                src={media?.mediaUrl}
                                alt=""
                                class="h-full w-full"
                            />
                        )}
                    </div>
                )}
            </For>
        </div>
    );
};

export default Gallery;
