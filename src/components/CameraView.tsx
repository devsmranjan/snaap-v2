import { createSignal } from 'solid-js';
import { effect } from 'solid-js/web';
import { useCameraContext } from '../states/Camera.context';

const CameraView = () => {
    const { stream, hasPermission } = useCameraContext();

    const [cameraViewRef, setCameraViewRef] = createSignal(null);

    effect(() => {
        if (hasPermission()) {
            const viewRef: HTMLVideoElement | null = cameraViewRef();

            if (!viewRef) {
                return;
            }

            (viewRef as HTMLVideoElement).srcObject = stream();
        }
    });

    return (
        <>
            {hasPermission() ? (
                <video ref={setCameraViewRef} autoplay playsinline muted />
            ) : (
                <p>no permission</p>
            )}
        </>
    );
};

export default CameraView;
