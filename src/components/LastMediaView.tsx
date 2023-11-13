import { A } from '@solidjs/router';
import { useDbContext } from '../states/Database.context';

const LastMediaView = () => {
    const { latestMedia } = useDbContext();

    return (
        <>
            {latestMedia() !== null && (
                <A
                    href="/gallery"
                    class="absolute bottom-9 left-0 right-0 m-auto h-16 w-16 rounded-full "
                >
                    {latestMedia()?.type === 'video' ? (
                        <video
                            src={latestMedia()?.mediaUrl}
                            class="h-full w-full rounded-full object-cover"
                            autoplay={false}
                            muted
                        ></video>
                    ) : (
                        <img
                            src={latestMedia()?.mediaUrl}
                            alt=""
                            class="h-full w-full rounded-full object-cover"
                        />
                    )}
                </A>
            )}
        </>
    );
};

export default LastMediaView;
