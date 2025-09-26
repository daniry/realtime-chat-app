import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import { redisDB } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(redisDB),
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            const findUser = await redisDB.get(`user:${token.id}`) as User | null;
            if (!findUser)  {
                token.id = user!.id;
                return token;
            }
            return {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
                picture: findUser.image,
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    name: token.name,
                    email: token.email,
                    image: token.picture,
                }
            }
            return session;
        },
        redirect() {
            return '/dashboard'
        }
    }
}

