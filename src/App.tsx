import CameraActions from './components/CameraActions';
import CameraView from './components/CameraView';
import Filters from './components/Filters';
import LastMediaView from './components/LastMediaView';
import MediaOptions from './components/MediaOptions';
import RecordingTimer from './components/RecordingTimer';
import { CameraProvider } from './states/Camera.context';
import { DbProvider } from './states/Database.context';

const App = () => {
    return (
        <div class="app-view">
            <DbProvider>
                <CameraProvider>
                    <div class="app-view__float">
                        <RecordingTimer />
                    </div>
                    <div class="app-view__left ">
                        <Filters />
                    </div>
                    <div class="app-view__center">
                        <CameraView />
                    </div>
                    <div class="app-view__right">
                        <CameraActions />
                        <LastMediaView />
                    </div>

                    <div class="app-view__bottom">
                        <MediaOptions />
                    </div>
                </CameraProvider>
            </DbProvider>
        </div>
    );
};

export default App;
