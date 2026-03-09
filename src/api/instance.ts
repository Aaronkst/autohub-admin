import axios, { type AxiosInstance } from "axios";

class MiniAppInstance {
  client: AxiosInstance;
  accessToken: string = "";
  userToken: string = "";

  constructor() {
    this.client = axios.create({
      baseURL: "https://uat-miniapp.kbzpay.com"
    })

    // Set auto request headers.
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers["access-token"] = this.accessToken;
      }
      if (this.userToken) {
        config.headers["X-User-Token"] = this.userToken;
      }
      return config;
    });

    // initialize with an access token
    this.getAccessToken();
  }

  private async getAccessToken(): Promise<boolean> {
    const searchParams = new URLSearchParams();
    searchParams.append("client_id", "094cd4608a31d4e24ca76a7ab6c4cfcf")
    searchParams.append("client_secret", "bfc56493aceb75c079ad3fc9b11e430640ccb5283f59eb66")
    searchParams.append("grant_type", "client_credentials");

    const response = await this.client.post("/baas/auth/v1.0/oauth2/token", searchParams);

    if (response.data.access_token) {
      this.accessToken = response.data.access_token;
      return true;
    } else {
      return false;
    }
  }

  async post(path: string, body?: Record<string, unknown> | FormData) {
    if (!this.accessToken) {
      await this.getAccessToken();
    }
    return this.client.post(path, body)
  }

  async get(path: string, query?: Record<string, string | number>) {
    if (!this.accessToken) {
      await this.getAccessToken();
    }
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query ?? {})) {
      searchParams.append(key, value.toString());
    }
    return this.client.get(path + "?" + searchParams.toString());
  }
}

export const miniAppInstance = new MiniAppInstance();
