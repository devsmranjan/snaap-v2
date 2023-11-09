import { createSignal } from 'solid-js';
import { effect } from 'solid-js/web';

import { useCameraContext } from '../states/Camera.context';

const CameraView = () => {
    const { hasPermission, setCameraViewRef } = useCameraContext();

    const [viewRef, setViewRef] = createSignal(null);

    effect(() => {
        if (hasPermission()) {
            const ref: HTMLVideoElement | null = viewRef();

            if (!ref) {
                return;
            }

            setCameraViewRef(ref);
        }
    });

    return (
        <>
            {hasPermission() ? (
                <video
                    ref={setViewRef}
                    autoplay
                    playsinline
                    muted
                    class="h-full"
                />
            ) : (
                <p>no permission</p>
            )}
        </>
    );
};

export default CameraView;
