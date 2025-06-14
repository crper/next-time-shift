export const staticPath = (path: string) => {
    if (process.env.NODE_ENV === 'production') {
        return `/next-time-shift${path}`;
    }
    return path;
};