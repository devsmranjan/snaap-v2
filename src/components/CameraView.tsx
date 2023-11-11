import { createSignal } from 'solid-js';
import { effect } from 'solid-js/web';

import { useCameraContext } from '../states/Camera.context';

const CameraView = () => {
    const { hasPermission, setCameraViewRef, filterColor } = useCameraContext();

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
        <div class="relative flex h-full w-full justify-center">
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

            <div
                class="absolute inset-0 h-full w-full"
                style={{
                    'background-color': filterColor(),
                }}
            ></div>
        </div>
    );
};

export default CameraView;
