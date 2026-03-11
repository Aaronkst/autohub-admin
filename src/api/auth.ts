import { AxiosError } from "axios";
import { miniAppInstance } from "./instance";

export const login = async (
    email: string,
    password: string
): Promise<any | null> => {
    try {
        const response = await miniAppInstance.post(
            "service/bulletin_app__AutoHub/0.0.1/login",
            {
                email,
                password
            }
        );

        if (response.data.resCode === "0") {
            const result = response.data.result[0];
            miniAppInstance.userToken = result.token;
            localStorage.setItem("kbz_user_token", result.token);
            return result.User;
        } else {
            return null;
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        if (error instanceof AxiosError) {
            console.error(error.response?.data || error.message);
        }
    }
};
