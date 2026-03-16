import { miniAppInstance } from "./instance";

const ACCOUNT_REQUEST_LIST_PATH =
    "service/bulletin_app__AutoHub/0.0.0/account-requests/list";
const ACCOUNT_REQUEST_UPDATE_STATUS_PATH =
    "service/bulletin_app__AutoHub/0.0.0/account-requests/update-status";

export interface AccountRequestUser {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface AccountRequest {
    id: string;
    requestType: string;
    status: string;
    createdAt: string;
    user: AccountRequestUser;
}

export type AccountRequestList = {
    account_requests: AccountRequest[];
    total_counts: number;
};

export const getAccountRequests = async (skip = 0): Promise<AccountRequestList> => {
    const res = await miniAppInstance.get(ACCOUNT_REQUEST_LIST_PATH, {
        user_token: "dummy",
        skip,
    });

    if (res.data && res.data.result && res.data.result.length > 0) {
        const first = res.data.result[0];
        return {
            account_requests: first.account_requests || [],
            total_counts: first.total_counts || 0,
        };
    }

    return { account_requests: [], total_counts: 0 };
};

export const updateAccountRequestStatus = async (
    request_id: string,
    status: "approved" | "rejected"
) => {
    return miniAppInstance.patch(ACCOUNT_REQUEST_UPDATE_STATUS_PATH, {
        request_id,
        status,
    });
};
