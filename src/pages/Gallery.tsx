import { For } from 'solid-js';
import GalleryCard from '../components/GalleryCard';
import { useDbContext } from '../states/Database.context';

const Gallery = () => {
    const { getAll, mediaList, downloadMedia, deleteMedia } = useDbContext();

    getAll();

    const handleAction = (e: Event) => {
        const target = e.target as HTMLElement;

        // get closest buttion element which is having data-id
        const button = target.closest(
            'button[data-key="gallary-action"]'
        ) as HTMLElement;

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (!id || !action) return;

        if (action === 'download') {
            console.log('download');

            downloadMedia(id);

            return;
        }

        if (action === 'delete') {
            console.log('delete');

            deleteMedia(id);
        }
    };

    return (
        <div
            class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            onClick={handleAction}
        >
            <For each={mediaList()}>
                {(media) => <GalleryCard media={media} />}
            </For>
        </div>
    );
};

export default Gallery;
