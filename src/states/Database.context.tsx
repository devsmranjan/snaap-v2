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
    latestMedia: Accessor<IMediaData | null>;
    mediaList: Accessor<IMediaData[]>;
    add: (type: 'video' | 'image', blob: Blob) => void;
    getAll: () => void;
    downloadMedia: (id: number | string) => void;
    deleteMedia: (id: number | string) => void;
}

interface IDbProps {
    children: JSX.Element;
}

export interface IMediaData {
    id: number;
    type: 'video' | 'image';
    blob: Blob;
    mediaUrl: string;
}

const DbContext = createContext<IDbContext>();

export const DbProvider = (props: IDbProps) => {
    const [db, setDb] = createSignal<IDBDatabase | null>(null);
    const [latestMedia, setLatestMedia] = createSignal<IMediaData | null>(null);
    const [mediaList, setMediaList] = createSignal<IMediaData[]>([]);

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

            updateLatest();
        };

        request.onerror = () => {
            console.log('db error');

            setDb(null);
        };
    })('snaap', 2);

    const add = (type: 'video' | 'image', blob: Blob) => {
        const database = db();

        if (!database) {
            return;
        }

        const transaction = database.transaction('media', 'readwrite');
        const store = transaction.objectStore('media');

        const id = Date.now();

        const request = store.add({ id, type, blob });

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

    const getAll = () => {
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

            console.log(mediaList);

            mediaList.forEach((media) => {
                const url = URL.createObjectURL(media.blob);

                media.mediaUrl = url;
            });

            setMediaList(mediaList);
        };

        request.onerror = () => {
            console.error('error getting data');
        };

        transaction.oncomplete = () => {
            console.log('transaction complete');
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

            if (!latest) {
                setLatestMedia(null);
                return;
            }

            const url = URL.createObjectURL(latest?.blob);

            console.log(url);

            setLatestMedia({ ...latest, mediaUrl: url });
        };

        request.onerror = () => {
            console.error('error getting data');
        };

        transaction.oncomplete = () => {
            console.log('transaction complete');
        };
    };

    const downloadMedia = (id: number | string) => {
        const database = db();

        if (!database) {
            return;
        }

        const transaction = database.transaction('media', 'readonly');
        const store = transaction.objectStore('media');

        // get all data
        const request = store.get(+id);

        request.onsuccess = () => {
            const media: IMediaData = request.result;

            if (!media) {
                return;
            }

            const url = URL.createObjectURL(media.blob);

            media.mediaUrl = url;

            if (media.type === 'video') {
                download(media.mediaUrl, `${media.id}.mp4`);

                return;
            }

            if (media.type === 'image') {
                download(media.mediaUrl, `${media.id}.png`);

                return;
            }
        };

        request.onerror = () => {
            console.error('error getting data');
        };

        transaction.oncomplete = () => {
            console.log('transaction complete');
        };
    };

    const download = (url: string, filename: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        a.remove();
    };

    const deleteMedia = (id: number | string) => {
        const database = db();

        if (!database) {
            return;
        }

        const transaction = database.transaction('media', 'readwrite');
        const store = transaction.objectStore('media');

        // get all data
        const request = store.delete(+id);

        request.onsuccess = () => {
            console.log('data deleted');

            const currentMediaList = mediaList();

            const updatedMediaList = currentMediaList.filter(
                (media) => media.id !== +id
            );

            setMediaList(updatedMediaList);
        };

        request.onerror = () => {
            console.error('error deleting data');
        };

        transaction.oncomplete = () => {
            console.log('transaction complete');
        };
    };

    return (
        <DbContext.Provider
            value={{
                db,
                setDb,
                add,
                latestMedia,
                mediaList,
                getAll,
                downloadMedia,
                deleteMedia,
            }}
        >
            {props.children}
        </DbContext.Provider>
    );
};

export const useDbContext = () => useContext(DbContext) as IDbContext;
