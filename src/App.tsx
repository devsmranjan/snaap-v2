import CameraActions from './components/CameraActions';
import CameraView from './components/CameraView';
import Filters from './components/Filters';
import MediaOptions from './components/MediaOptions';
import { CameraProvider } from './states/Camera.context';

const App = () => {
    return (
        <div class="app-view">
            <CameraProvider>
                <div class="app-view__left ">
                    <Filters />
                </div>
                <div class="app-view__center">
                    <CameraView />
                </div>
                <div class="app-view__right">
                    <CameraActions />
                </div>

                <div class="app-view__bottom">
                    <MediaOptions />
                </div>
            </CameraProvider>
        </div>
    );
};

export default App;
