
export interface IEditUser {
    id: number,
    userData: {
        username?: string;
        email: string;
        password: string;
        language?: string;
        theme?: string;
        role?: string;
    }
}