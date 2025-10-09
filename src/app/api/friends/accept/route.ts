import { getUserSession } from '@/helpers/get-user-session';
import { fetchRedis } from '@/helpers/redis';
import { redisDB } from '@/lib/db';
import z from 'zod';

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const { id: idToAdd } = z.object({ id: z.string() }).parse(body);
		if (!idToAdd)
			return new Response('Неверный формат запроса.', { status: 400 });

		const user = await getUserSession();
		if (!user) return new Response('Вы не авторизованы.', { status: 401 });

		// Проверка, что оба пользователя не являются друзьями
		const isAlreadyFriends = await fetchRedis(
			'sismember',
			`user:${user.id}:friends`,
			idToAdd
		);
		if (isAlreadyFriends)
			return new Response('Пользователь уже есть в ваших друзьях.', {
				status: 400,
			});

		const hasFriendRequest = await fetchRedis(
			'sismember',
			`user:${user.id}:incoming_friend_requests`,
			idToAdd
		);
		if (!hasFriendRequest)
			return new Response('Нет запроса в друзья', { status: 400 });

		await redisDB.sadd(`user:${user.id}:friends`, idToAdd)
		await redisDB.sadd(`user:${idToAdd}:friends`, user.id)
		// await redisDB.srem(`user:${idToAdd}:outbound_friend_requests`, user.id) // TODO: Удалить запрос из списка исходящих запросов
		await redisDB.srem(`user:${user.id}:incoming_friend_requests`, idToAdd) // Удалить запрос из списка входящих запросов

		return new Response('OK')
	} catch (error) {
		console.log(error)
		if (error instanceof z.ZodError) {
			return new Response('Некорректный запрос.', { status: 422 })
		}
		return new Response('Ошибка сервера.', { status: 400 })
	}
}
