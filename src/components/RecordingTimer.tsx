import { createEffect, createSignal } from 'solid-js';
import { useCameraContext } from '../states/Camera.context';

const RecordingTimer = () => {
    const { recording } = useCameraContext();
    const [timer, setTimer] = createSignal(0);
    const [timerInterval, setTimerInterval] = createSignal<number | null>(null);

    createEffect(() => {
        if (recording()) {
            const interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);

            setTimerInterval(interval);
        } else {
            setTimer(0);

            const interval = timerInterval();

            if (interval !== null) {
                clearInterval(interval);
            }
        }
    });

    const formatTime = (timer: number) => {
        console.log(timer);
        const seconds = timer % 60;
        const minutes = Math.floor(timer / 60);
        const hours = Math.floor(timer / 3600);

        const pad = (num: number) => {
            return num.toString().padStart(2, '0');
        };

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    return (
        <>
            {recording() ? (
                <div class="flex items-center gap-2 rounded-md bg-gray-600/[.4] pb-1 pl-3 pr-3 pt-1 text-lg text-white">
                    <div class="h-2 w-2 rounded bg-red-500"></div>
                    <p>{formatTime(timer())}</p>
                </div>
            ) : null}
        </>
    );
};

export default RecordingTimer;
