import { A } from '@solidjs/router';

const Navbar = () => {
    return (
        <>
            <nav class="fixed start-0 top-0 z-20 w-full border-b border-gray-200 bg-white ">
                <div class="mx-auto flex max-w-screen-xl flex-wrap items-center gap-4 p-4">
                    <A href="/" class="flex items-center ">
                        <span class="material-symbols-rounded text-3xl font-semibold">
                            arrow_left_alt
                        </span>
                    </A>

                    <span class="self-center whitespace-nowrap text-2xl font-semibold">
                        Gallery
                    </span>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
