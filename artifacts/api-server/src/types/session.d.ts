import "express-session";

declare module "express-session" {
  interface SessionData {
    oauthState?: string;
    user?: {
      id: string;
      username: string;
      discriminator: string;
      avatar: string | null;
      banner: string | null;
      accentColor: number | null;
      guilds: Array<{
        id: string;
        name: string;
        icon: string | null;
        owner: boolean;
      }>;
    };
  }
}
