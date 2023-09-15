export const isDev = import.meta.env.DEV;

export async function runWithAsyncHandling(
    run,
    handler) {
    try {
        return await run();
    } catch (error) {
        return await handler(error);
    }
}