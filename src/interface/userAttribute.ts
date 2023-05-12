export interface UserAttributes {
    otp: any;
    id: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    salt: string;
    address?: string;
    verified: boolean;
    role: string;
    gender?: string;
    date_birth?: Date;
    googleId?: string;
    facebookId?: string;
    googleToken?: string;
    faceBookToken?: string;
    country?: string;
    day?: string;
    month?: string;
    year?: string;
    lan?: string;
    currency?: string;
    isAceptedPrivacy?: boolean;
    isAceptedTerms?: boolean;
    socials?: Array<String>;
    is_premium: boolean;
    isLoggedIn?: boolean;
  }
  export interface UserPayload {
    id: string;
    email: string;
    verified: boolean;
    isLoggedIn?: boolean;
    role: string;
    is_premium: boolean;
  }
  
  