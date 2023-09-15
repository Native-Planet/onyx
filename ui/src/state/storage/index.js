import _ from 'lodash';
import { api } from '../api';
import { reduce } from './reducer';
import { enableMapSet } from 'immer';
import { createState, createSubscription, reduceStateN } from '../base';

enableMapSet();

let numLoads = 0;

const useStorageState = createState(
    'Storage',
    (set, get) => ({
        loaded: false,
        hasCredentials: false,
        gcp: {
            isConfigured: () => {
                return api.thread({
                    inputMark: 'noun',
                    outputMark: 'json',
                    threadName: 'gcp-is-configured',
                    body: {}
                });
            },
            getToken: async () => {
                const token = await api.thread < GcpToken > ({
                    inputMark: 'noun',
                    outputMark: 'gcp-token',
                    threadName: 'gcp-get-token',
                    body: {}
                });
                get().set((state) => {
                    state.gcp.token = token;
                });
            }
        },
        s3: {
            configuration: {
                buckets: new Set(),
                currentBucket: '',
                region: ''
            },
            credentials: null
        }
    }),
    ['loaded', 's3', 'gcp'],
    [
        (set, get) =>
            createSubscription('storage', '/all', (e) => {
                const d = _.get(e, 'storage-update', false);
                if (d) {
                    reduceStateN(get(), d, reduce);
                } else if (e?.['s3-update']) {
                    const d = _.get(e, 's3-update', false);
                    reduceStateN(get(), d, reduce);
                }

                numLoads++;
                if (numLoads === 2) {
                    set({ loaded: true });
                }
            })
    ]
);

export default useStorageState;