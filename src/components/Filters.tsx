import { useCameraContext } from '../states/Camera.context';

const Filters = () => {
    const { availableFilters, setFilterColor } = useCameraContext();

    return (
        <div class="flex h-full flex-col items-center justify-center gap-2">
            {availableFilters().map((filterColor) => {
                return (
                    <button
                        class="relative h-16 w-16 overflow-hidden rounded-md"
                        onClick={() => setFilterColor(filterColor)}
                    >
                        <img
                            class="h-full w-full"
                            src="http://placekitten.com/g/200/200"
                            alt={filterColor}
                        />

                        <div
                            class="absolute inset-0 opacity-40"
                            style={{ 'background-color': filterColor }}
                        ></div>
                    </button>
                );
            })}
        </div>
    );
};

export default Filters;
