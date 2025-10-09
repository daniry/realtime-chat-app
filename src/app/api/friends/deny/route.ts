import { getUserSession } from '@/helpers/get-user-session';
import { redisDB } from '@/lib/db';
import z from 'zod';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { id: idToDeny } = z.object({ id: z.string() }).parse(body);
        if (!idToDeny)
            return new Response('Неверный формат запроса.', { status: 400 });

        const user = await getUserSession();
        if (!user) return new Response('Вы не авторизованы.', { status: 401 });

        await redisDB.srem(`user:${user.id}:incoming_friend_requests`, idToDeny)

        return new Response('OK')
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response('Некорректный запрос.', { status: 422 })
        }
        return new Response('Ошибка сервера.', { status: 400 })
    }
}
