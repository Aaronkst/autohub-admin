import axios from "axios";

export const login = async (email: string, password: string) => {
    // STEP 1 — Get OAuth Token
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const oauthRes = await axios.post(
        "/oauth-api/baas/auth/v1.0/oauth2/token",
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            auth: {
                username: "094cd4608a31d4e24ca76a7ab6c4cfcf",
                password: "bfc56493aceb75c079ad3fc9b11e430640ccb5283f59eb66"
            }
        }
    );

    const accessToken = oauthRes.data.access_token;
    if (!accessToken) {
        throw new Error("Failed to retrieve access token");
    }

    // STEP 2 — Login API
    const loginRes = await axios.post(
        "/login-api/service/bulletin_app__AutoHub/0.0.1/login",
        {
            email,
            password
        },
        {
            headers: {
                "Content-Type": "application/json",
                "access-token": accessToken
            }
        }
    );

    const data = loginRes.data;

    if (data.resCode !== "0") {
        // Attempt to parse out an error message, otherwise fallback
        throw new Error(data.resMsg || "Login failed");
    }

    // Ensure there's a token in the response
    const userToken = data.result?.[0]?.token;
    if (!userToken) {
        throw new Error("Missing user token in response");
    }

    return {
        accessToken: userToken,
        user: data.result?.[0]?.User,
    };
};
