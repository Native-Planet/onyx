import { applyPatches, produceWithPatches, setAutoFreeze, enablePatches } from 'immer';
import { compose } from 'lodash/fp';
import _ from 'lodash';
import { create } from 'zustand';
import { FatalError } from '@urbit/http-api';
import { api } from './api';

setAutoFreeze(false);
enablePatches();

export function createStorageKey(name) {
    return `~${window.ship}/${window.desk}/${name}`;
}

// for purging storage with version updates
export function clearStorageMigration() {
    return {};
}

export const storageVersion = parseInt(import.meta.env.ALBUM_STORAGE_VERSION, 10);

export const stateSetter = (
    fn,
    set,
    get
) => {
    const old = get();
    const [state] = produceWithPatches(old, fn);
    set(state);
};

export const optStateSetter = (
    fn,
    set,
    get
) => {
    const old = get();
    const id = _.uniqueId();
    const [state, , patches] = produceWithPatches(old, fn);
    set({ ...state, patches: { ...state.patches, [id]: patches } });
    return id;
};

export const reduceState = (
    state,
    data,
    reducers
) => {
    const reducer = compose(reducers.map(r => sta => r(data, sta)));
    state.getState().set((state) => {
        reducer(state);
    });
};

export const reduceStateN = (
    state,
    data,
    reducers
) => {
    const reducer = compose(reducers.map(r => sta => r(data, sta)));
    state.set(reducer);
};

export const optReduceState = (
    state,
    data,
    reducers
) => {
    const reducer = compose(reducers.map(r => sta => r(data, sta)));
    return state.getState().optSet((state) => {
        reducer(state);
    });
};

export let stateStorageKeys = [];

export const stateStorageKey = (stateName) => {
    const key = createStorageKey(`${stateName}State`);
    stateStorageKeys = [...new Set([...stateStorageKeys, key])];
    return key;
};

window.clearStates = () => {
    stateStorageKeys.forEach((key) => {
        localStorage.removeItem(key);
    });
};

export function createSubscription(app, path, e) {
    const request = {
        app,
        path,
        event: e,
        err: () => { },
        quit: () => {
            throw new FatalError('subscription clogged');
        }
    };
    // TODO: err, quit handling (resubscribe?)
    return request;
}

export const createState = (
    name,
    properties,
    blacklist,
    subscriptions,
    clearedState
) => create((set, get) => ({
    clear: () => {
        set(clearedState);
    },
    initialize: async (api) => {
        await Promise.all(subscriptions.map(sub => api.subscribe(sub(set, get))));
    },
    set: fn => stateSetter(fn, set, get),
    optSet: (fn) => {
        return optStateSetter(fn, set, get);
    },
    patches: {},
    addPatch: (id, ...patch) => {
        set(({ patches }) => ({ patches: { ...patches, [id]: patch } }));
    },
    removePatch: (id) => {
        set(({ patches }) => ({ patches: _.omit(patches, id) }));
    },
    rollback: (id) => {
        set((state) => {
            const applying = state.patches[id];
            return { ...applyPatches(state, applying), patches: _.omit(state.patches, id) };
        });
    },
    ...(typeof properties === 'function' ? (properties)(set, get) : properties)
}), {
    blacklist,
    name: stateStorageKey(name),
    version: storageVersion,
    migrate: clearStorageMigration
});

export async function doOptimistically(state, action, call, reduce) {
    let num = undefined;
    try {
        num = optReduceState(state, action, reduce);
        await call(action);
        state.getState().removePatch(num);
    } catch (e) {
        console.error(e);
        if (num) {
            state.getState().rollback(num);
        }
    }
}

export async function pokeOptimisticallyN(state, poke, reduce) {
    let num = undefined;
    try {
        num = optReduceState(state, poke.json, reduce);
        await api.poke(poke);
        state.getState().removePatch(num);
    } catch (e) {
        console.error(e);
        if (num) {
            state.getState().rollback(num);
        }
    }
}