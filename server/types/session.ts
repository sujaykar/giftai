import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    user?: {
      id: number;
      email: string;
      firstName: string | null;
      lastName: string | null;
      isVerified: boolean;
    };
  }
}