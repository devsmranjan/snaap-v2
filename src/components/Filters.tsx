import { useCameraContext } from '../states/Camera.context';

const Filters = () => {
    const { availableFilters, setFilterColor, filterColor } =
        useCameraContext();

    return (
        <div class="flex h-full flex-col items-center justify-center gap-2">
            {availableFilters().map((color) => {
                return (
                    <button
                        class={`relative h-16 w-16 overflow-hidden rounded-md border-2 border-transparent ${
                            filterColor() === color ? 'border-white' : ''
                        }`}
                        onClick={() => setFilterColor(color)}
                    >
                        <img
                            class="h-full w-full"
                            src="http://placekitten.com/g/200/200"
                            alt={color}
                        />

                        <div
                            class="absolute inset-0 opacity-40"
                            style={{ 'background-color': color }}
                        ></div>
                    </button>
                );
            })}
        </div>
    );
};

export default Filters;
