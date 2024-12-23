import axios from "axios";
import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/AuthResponce";
import AuthService from "../services/AuthService";
import $api, {API_URL} from "../http";
import { IEditUser } from "../models/editUsers";
import { RefreshResponse } from "../models/response/RefreshResponce";
export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this)
    }
    setAuth(bool: boolean) {
        this.isAuth = bool;
    }
    setUser(user: IUser) {
        this.user = user;
    }
    setLoading(bool: boolean) {
        this.isLoading = bool;
    }
    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.userData.accessToken);
            this.setAuth(true);
            console.log("Stored token:", localStorage.getItem('token'));
            this.setUser(response.data.userData.user);
        } catch (e) {
            console.log(e)
        }
    }
    async registration(username: string, email: string, password: string, language: string, theme: string, role: string) {
        try {
            const response = await AuthService.registration(username, email, password, language, theme, role);

            localStorage.setItem('token', response.data.userData.accessToken);
            this.setAuth(true);
            this.setUser(response.data.userData.user);
        } catch (e) {
            if (e instanceof Error) {
                // e is narrowed to Error!
                console.log(e.message);
            }
        }
    }
    async logout() {
        try {
            const response = await $api.post('/logout');
            console.log(response);
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
            console.log("Logout response:", response.data);
        } catch (e) {
            console.error("Logout error:", e);
        }
    }
    async  checkAuth() {
        this.setLoading(true); // Включаем загрузку
        try {
            console.log("[Auth] Sending refresh request...");
            const response = await axios.get<RefreshResponse>(`${API_URL}/refresh`, {
                withCredentials: true,
            });

            console.log("[Auth] Refresh response:", response.data);

            // Сохраняем токен и обновляем состояние
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);

            console.log("[Auth] Authentication successful");
        } catch (e: any) {
            console.error("[Auth] Authentication failed:", e.response?.data?.message || e.message);
            this.setAuth(false);
        } finally {
            this.setLoading(false); // Отключаем загрузку
        }
    }

    async edit(id: number, userData: { username: string, email: string, password: string, language: string, theme: string, role: string }) {
        try {
          const response = await AuthService.edit(id, userData);
          if (response.data) {
            this.setUser(response.data);
            return response.data;
          } else {
            throw new Error("Invalid response structure from server");
          }
        } catch (e) {
          console.error("Error in edit method:", e);
          throw e;
        }
      }
}