export const currentHost = `${window.location.protocol}//${window.location.hostname}` + (window.location.port ? `:${window.location.port}` : '')
export const currentApiHost = import.meta.env.VITE_API_URL || ''

export function getHostUrl(rawUrl: string) {
    const url = new URL(rawUrl)
    const port = url.port ? `:${url.port}` : ''
    return `${url.protocol}//${url.hostname}` + port
}

export function getDomain(rawUrl: string) {
    const url = new URL(rawUrl)
    const port = url.port ? `:${url.port}` : ''
    return url.hostname + port
}