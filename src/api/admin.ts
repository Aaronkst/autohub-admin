import { miniAppInstance } from "./instance";

const ADMIN_LIST_PATH = "service/bulletin_app__AutoHub/0.0.1/admin/list";

export const getAdmins = async (skip = 0, searchParams?: URLSearchParams) => {
    const query: Record<string, string | number> = { user_token: "dummy", skip };
    if (searchParams) {
        searchParams.forEach((value, key) => { query[key] = value; });
    }
    const res = await miniAppInstance.get(ADMIN_LIST_PATH, query);

    if (res.data && res.data.result && res.data.result.length > 0) {
        return res.data.result[0];
    }
    return null;
};
