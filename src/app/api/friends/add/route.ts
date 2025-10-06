import { addFriendSchema } from "@/constants/validations/add-friend";
import { getUserSession } from "@/helpers/get-user-session";
import { fetchRedis } from "@/helpers/redis";
import { redisDB } from "@/lib/db";
import z from "zod";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body) return new Response('Ошибка запроса.', { status: 400 });

        // Проверка на наличие email
        const {email: emailToAdd} = addFriendSchema.parse(body.email);
        if (!emailToAdd) return new Response('Некорректный email.', { status: 400 });

        // Получение данных о текущем пользователе
        const user = await getUserSession();
        if (!user) return new Response('Вы не авторизованы.', { status: 401 });

        // Поиск пользователя по email
        const idToAdd = await fetchRedis("get", `user:email:${emailToAdd}`) as string;
        if (!idToAdd) return new Response('Такого пользователя не существует.', { status: 400 });

        if (idToAdd === user.id) return new Response('Ты не можешь добавить себя в друзья.', { status: 400 });

        // Если пользователю уже отправлен запрос
        const isAlreadyAdded = (await fetchRedis(
            "sismember", 
            `user:${idToAdd}:incoming_friend_requests`, 
            user.id)) as 0 | 1;
        if (isAlreadyAdded) return new Response('Пользователю с таким email уже отправлен запрос.', { status: 400 });

        // Если пользователь уже есть в друзьях
        const isAlreadyFriends = (await fetchRedis(
            'sismember',
            `user:${user.id}:friends`,
            idToAdd
            )) as 0 | 1
        if (isAlreadyFriends) return new Response('Пользователь с таким email уже есть в ваших друзьях.', { status: 400 });

        // Запрос корректный, отправляем запрос

        redisDB.sadd(`user:${idToAdd}:incoming_friend_requests`, user.id);

        return new Response('OK')

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Некорректный запрос.', { status: 422 })
        }
        return new Response('Ошибка сервера.', { status: 400 })
    }
}