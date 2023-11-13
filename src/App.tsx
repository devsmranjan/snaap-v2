import { Route, Router, Routes } from '@solidjs/router';
import { lazy } from 'solid-js';
import { CameraProvider } from './states/Camera.context';
import { DbProvider } from './states/Database.context';

const App = () => {
    const Home = lazy(() => import('./pages/Home'));
    const Gallery = lazy(() => import('./pages/Gallery'));

    return (
        <DbProvider>
            <CameraProvider>
                <Router>
                    <Routes>
                        <Route path="/" component={Home}></Route>
                        <Route path="/gallery" component={Gallery}></Route>
                    </Routes>
                </Router>
            </CameraProvider>
        </DbProvider>
    );
};

export default App;
