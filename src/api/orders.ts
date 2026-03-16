import { miniAppInstance } from "./instance";

const ORDER_LIST_PATH = "service/bulletin_app__AutoHub/0.0.0/orders/list";

export interface OrderUser {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface Order {
    id: string;
    price: number;
    resourceId: string | null;
    type: string;
    user: OrderUser;
}

export interface GetOrdersOutput {
    orders: Order[];
    total_count: number;
}

export const getOrders = async (skip = 0): Promise<GetOrdersOutput> => {
    const res = await miniAppInstance.get(ORDER_LIST_PATH, {
        user_token: "dummy",
        skip,
    });

    if (res.data && res.data.result && res.data.result.length > 0) {
        const first = res.data.result[0];
        return {
            orders: first.orders || [],
            total_count: first.total_count || 0,
        };
    }

    return { orders: [], total_count: 0 };
};

