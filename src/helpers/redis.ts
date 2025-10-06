const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const AUTH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
    command: Command,
    ...args: (string | number)[]
) {
    if (!UPSTASH_REDIS_REST_URL || !AUTH_TOKEN) {
        throw new Error('UPSTASH_REDIS_REST_URL or AUTH_TOKEN not set')
    }
    
    const commandUrl = `${UPSTASH_REDIS_REST_URL}/${command}/${args.join('/')}`

    const response = await fetch(commandUrl, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error(`Error executing Redis command: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result
}