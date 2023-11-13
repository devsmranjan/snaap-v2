import {
    Accessor,
    JSX,
    Setter,
    createContext,
    createSignal,
    useContext,
} from 'solid-js';

interface IDbContext {
    db: Accessor<IDBDatabase | null>;
    setDb: Setter<IDBDatabase | null>;
    add: (type: 'video' | 'image', mediaUrl: string) => void;
    latestMedia: Accessor<IMediaData | null>;
}

interface IDbProps {
    children: JSX.Element;
}

interface IMediaData {
    id: number;
    type: 'video' | 'image';
    mediaUrl: string;
}

const DbContext = createContext<IDbContext>();

export const DbProvider = (props: IDbProps) => {
    const [db, setDb] = createSignal<IDBDatabase | null>(null);
    const [latestMedia, setLatestMedia] = createSignal<IMediaData | null>(null);

    ((dbName: string, version?: number) => {
        console.log('Init...');

        if (!('indexedDB' in window)) {
            console.error("This browser doesn't support IndexedDB");
            return;
        }

        const request = indexedDB.open(dbName, version);

        request.onupgradeneeded = () => {
            console.log('db upgraded and also for initial db creation');

            const db = request.result;

            db.createObjectStore('media', { keyPath: 'id' });
        };

        request.onsuccess = () => {
            console.log('db opened successfully');

            const db = request.result;

            setDb(db);
        };

        request.onerror = () => {
            console.log('db error');

            setDb(null);
        };
    })('snaap', 2);

    const add = (type: 'video' | 'image', mediaUrl: string) => {
        const database = db();

        if (!database) {
            return;
        }

        const transaction = database.transaction('media', 'readwrite');
        const store = transaction.objectStore('media');

        const id = Date.now();

        const request = store.add({ id, type, mediaUrl });

        request.onsuccess = () => {
            console.log('data added');
        };

        request.onerror = () => {
            console.error('error adding data');
        };

        transaction.oncomplete = () => {
            console.log('transaction complete');

            updateLatest();
        };
    };

    const updateLatest = () => {
        const database = db();

        if (!database) {
            return;
        }

        const transaction = database.transaction('media', 'readonly');
        const store = transaction.objectStore('media');

        // get all data
        const request = store.getAll();

        request.onsuccess = () => {
            const mediaList: IMediaData[] = request.result;

            if (!mediaList) {
                return;
            }

            const latest = mediaList.at(-1) ?? null;

            setLatestMedia(latest);
        };

        request.onerror = () => {
            console.error('error getting data');
        };

        transaction.oncomplete = () => {
            console.log('transaction complete');
        };
    };

    return (
        <DbContext.Provider value={{ db, setDb, add, latestMedia }}>
            {props.children}
        </DbContext.Provider>
    );
};

export const useDbContext = () => useContext(DbContext) as IDbContext;
