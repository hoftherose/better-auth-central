import { useFetch } from '#app'

export default ((url: string, opts?: any) => {
    try {
        if (url.startsWith('http') || url.startsWith('https')) url = new URL(url).pathname
    } catch {}
    return useFetch(url, opts)
}) as any
