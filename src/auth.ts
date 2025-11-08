import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/spreadsheets",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in - store tokens
      if (account) {
        console.log("Storing tokens in JWT:", {
          hasAccessToken: !!account.access_token,
          hasRefreshToken: !!account.refresh_token,
          expiresAt: account.expires_at,
        });
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.id = user?.id || token.sub;
      }
      // Return token (persist existing token if account is not present)
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id || token.sub) as string;
      }
      // Add access token to session for API calls
      (session as any).accessToken = token.accessToken as string | undefined;

      // Debug logging (remove in production)
      if (!(session as any).accessToken) {
        console.warn("Access token not found in session token:", {
          hasToken: !!token,
          tokenKeys: Object.keys(token),
          hasAccessTokenInToken: !!token.accessToken,
        });
      }

      return session;
    },
  },
});
