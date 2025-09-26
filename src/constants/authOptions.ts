import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import { redisDB } from "@/lib/db";
import Google from "next-auth/providers/google";

/**
 * NextAuth options
 * @see https://next-auth.js.org/configuration/options
 * @see https://next-auth.js.org/configuration/providers/oauth
 */
export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(redisDB),
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        })
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

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }

    return { clientId, clientSecret }
}