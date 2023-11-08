import CameraActions from './components/CameraActions';
import CameraView from './components/CameraView';
import MediaOptions from './components/MediaOptions';
import { CameraProvider } from './states/Camera.context';

const App = () => {
    return (
        <CameraProvider>
            <CameraView />
            <CameraActions />
            <MediaOptions />
        </CameraProvider>
    );
};

export default App;
