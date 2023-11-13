import CameraActions from '../components/CameraActions';
import CameraView from '../components/CameraView';
import Filters from '../components/Filters';
import LastMediaView from '../components/LastMediaView';
import MediaOptions from '../components/MediaOptions';
import RecordingTimer from '../components/RecordingTimer';

const Home = () => {
    return (
        <div class="app-view">
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
        </div>
    );
};

export default Home;
