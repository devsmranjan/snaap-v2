import { IMediaData } from '../states/Database.context';

interface IGalleryCardProps {
    media: IMediaData;
}

const GalleryCard = (props: IGalleryCardProps) => {
    console.log('rerenderd');

    return (
        <div class="relative h-96 rounded-lg border border-gray-200 bg-white shadow">
            {props.media?.type === 'video' ? (
                <video
                    src={props.media?.mediaUrl}
                    class="h-96  rounded-lg object-cover"
                    autoplay
                    muted
                    loop
                ></video>
            ) : (
                <img
                    src={props.media?.mediaUrl}
                    alt=""
                    class="h-96 rounded-lg object-cover"
                />
            )}

            {props.media?.type === 'video' && (
                <div class="absolute right-2 top-2">
                    <span class="material-symbols-rounded font-medium text-green-600">
                        play_circle
                    </span>
                </div>
            )}

            <div class="absolute bottom-2 left-0 right-0 flex justify-center ">
                <button
                    type="button"
                    class="rounded-s-md bg-green-500 px-2 pt-1 text-sm font-normal  text-white"
                    data-id={props.media?.id}
                    data-action="download"
                    data-key="gallary-action"
                >
                    <span class="material-symbols-rounded">download</span>
                </button>
                <button
                    type="button"
                    class="rounded-e-md  bg-red-500 px-2 pt-1  text-sm  font-normal  text-white"
                    data-id={props.media?.id}
                    data-action="delete"
                    data-key="gallary-action"
                >
                    <span class="material-symbols-rounded">delete</span>
                </button>
            </div>
        </div>
    );
};

export default GalleryCard;
