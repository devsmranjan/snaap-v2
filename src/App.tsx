import CameraActions from './components/CameraActions';
import CameraView from './components/CameraView';
import { CameraProvider } from './states/Camera.context';

const App = () => {
    return (
        <CameraProvider>
            <CameraView />
            <CameraActions/>
        </CameraProvider>
    );
};

export default App;
