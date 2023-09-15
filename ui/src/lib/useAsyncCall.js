import { useCallback, useState } from 'react';

export function useAsyncCall(cb, store) {
    const [_status, _setStatus] = useState('initial');
    const [error, setError] = useState(null);
    const setStatus = store ? (status) => store.setState({ status }) : _setStatus;
    const { status } = store ? store() : { status: _status };

    const call = useCallback(
        (...args) => {
            setStatus('loading');
            cb(...args)
                .then((result) => {
                    setStatus('success');
                    return result;
                })
                .catch((err) => {
                    setError(err);
                    setStatus('error');
                });
        },
        [cb]
    );

    return {
        call,
        status,
        setStatus,
        error
    };
}