import $api from "../http/index";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponce";
import { useContext } from "react";
import { Context } from "..";
import { IUser } from "../models/IUser";
export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login', {email, password})
    }
    static async registration(username:string,email: string, password: string, language:string, theme:string, role:string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/register', { username,email, password, language,theme,role })
    }
    static async logout(): Promise<void> {
        return $api.post('/logout', { withCredentials: true })
    }
    static async edit(
        id: number,
        userData: { username: string; email: string; password: string; language: string; theme: string; role: string }
    ): Promise<AxiosResponse<IUser>> {
        const response = await $api.put(`/user/${id}`, userData);
        console.log("Server response:", response.data); // Логируем ответ от сервера
        return response;
    }
}