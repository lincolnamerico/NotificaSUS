import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { usuario } from "@/lib/db/schema";

const isProd = process.env.NODE_ENV === "production";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email?.endsWith("@pinhais.pr.gov.br")) {
        return false;
      }

      const email = profile.email;
      const nome = profile.name ?? email.split("@")[0];

      await db
        .insert(usuario)
        .values({ email, nome, papel: "gestor" })
        .onConflictDoUpdate({ target: usuario.email, set: { nome } });

      return true;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.email = profile.email;
        token.name = profile.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/gestao/login",
  },
  cookies: {
    sessionToken: {
      name: isProd ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        domain: ".pinhais.pr.gov.br",
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
      },
    },
  },
});
