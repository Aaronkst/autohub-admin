import { miniAppInstance } from "./instance";

const ADMIN_LIST_PATH = "service/bulletin_app__AutoHub/0.0.1/admin/list";

export const getAdmins = async (skip = 0) => {
    const res = await miniAppInstance.get(ADMIN_LIST_PATH, {
        user_token: "dummy",
        skip: skip,
    });

    if (res.data && res.data.result && res.data.result.length > 0) {
        return res.data.result[0].admins || [];
    }
    return [];
};
