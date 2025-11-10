import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
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
        return token;
      }

      // Check if access token is expired and refresh if needed
      if (token.expiresAt && token.refreshToken) {
        const expiresAt = token.expiresAt as number;
        const now = Math.floor(Date.now() / 1000);

        // Refresh token if it expires in less than 5 minutes
        if (expiresAt < now + 300) {
          try {
            console.log("Access token expired or expiring soon, refreshing...");

            const response = await fetch(
              "https://oauth2.googleapis.com/token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  client_id: process.env.GOOGLE_CLIENT_ID!,
                  client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                  refresh_token: token.refreshToken as string,
                  grant_type: "refresh_token",
                }),
              }
            );

            if (!response.ok) {
              console.error("Failed to refresh token:", await response.text());
              // Clear tokens to force re-authentication
              token.accessToken = undefined;
              token.refreshToken = undefined;
              token.expiresAt = undefined;
              return token;
            }

            const refreshedTokens = await response.json();

            token.accessToken = refreshedTokens.access_token;
            token.expiresAt =
              Math.floor(Date.now() / 1000) +
              (refreshedTokens.expires_in || 3600);

            // Update refresh token if provided (Google may not always return it)
            if (refreshedTokens.refresh_token) {
              token.refreshToken = refreshedTokens.refresh_token;
            }

            console.log("Token refreshed successfully", {
              newExpiresAt: token.expiresAt,
            });
          } catch (error) {
            console.error("Error refreshing token:", error);
            // Clear tokens to force re-authentication
            token.accessToken = undefined;
            token.refreshToken = undefined;
            token.expiresAt = undefined;
          }
        }
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
