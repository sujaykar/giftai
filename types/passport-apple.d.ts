declare module 'passport-apple' {
  import { Strategy as PassportStrategy } from 'passport';
  
  export interface AppleStrategyOptions {
    clientID: string;
    teamID: string;
    keyID: string;
    privateKeyLocation: string;
    callbackURL: string;
    scope?: string[];
    passReqToCallback?: boolean;
  }
  
  export interface AppleProfile {
    id: string;
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
    photos?: Array<{ value: string }>;
  }
  
  export type VerifyCallback = (
    accessToken: string,
    refreshToken: string,
    profile: AppleProfile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;
  
  export type VerifyCallbackWithRequest = (
    req: any,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: AppleProfile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;
  
  export class Strategy extends PassportStrategy {
    constructor(
      options: AppleStrategyOptions,
      verify: VerifyCallback | VerifyCallbackWithRequest
    );
    name: string;
  }
}