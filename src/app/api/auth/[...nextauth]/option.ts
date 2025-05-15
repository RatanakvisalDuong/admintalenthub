import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string | null;
            roleId: number;
            accessToken: string;
              expires: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
        email: string;
        name: string | null;
        roleId: number;
        accessToken: string;
        exp: number;
    }
}


let tempUserId = ''
let tempToken = ''
let tempRoleId = 0
let tempEmail = ''
let tempName = ''

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                return {
                    email: credentials.email,
                    password: credentials.password,
                } as any; 
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    jwt: {
        maxAge: 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ user } ) {
            if (user && user.email && (user as any).password) {
                try {
                    const response = await axios.post(`${process.env.API_URL}admin_login`, {
                        email: user.email,
                        password: (user as any).password,
                    });

                    const data = response.data;

                    tempToken = data.token || '';
                    tempUserId = data.id || '';
                    tempEmail = data.email || '';
                    tempName = data.name || 'Admin';
                    tempRoleId = data.role_id || '';

                    return true;
                } catch (error: any) {
                    console.error("JWT login error:", error.response?.data || error.message);
                    throw new Error("Invalid login");
                }
            }
            return true;
        },
        async jwt({ token, account}) {
            if (account) {
                token.accessToken = tempToken;
                token.userId = tempUserId;
                token.email = tempEmail;
                token.name = tempName || "Admin";
                token.roleId = tempRoleId;
            }

            return token;
        },
        
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.id = token.userId;
            session.user.email = token.email;
            session.user.name = token.name;
            session.user.roleId = token.roleId;
            session.user.expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            return session;
        },
    },
};

export default NextAuth(authOptions);
