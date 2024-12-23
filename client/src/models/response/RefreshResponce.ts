import { IUser } from "../IUser";

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}