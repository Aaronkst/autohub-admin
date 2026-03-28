import { miniAppInstance } from "./instance";

const ORDER_LIST_PATH = "service/bulletin_app__AutoHub/0.0.0/orders/list";
const ORDER_DETAILS_PATH = "service/bulletin_app__AutoHub/0.0.0/orders/details";

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

export type OrderDetailsOrder = {
    id: string;
    bulletin_app__order_type__CST: "car_part" | "car_sales" | "booking" | (string & {});
    bulletin_app__data_id__CST: string;
    bulletin_app__price__CST: number;
    createdDate: string;
};

export type BookingData = {
    id: string;
    bulletin_app__booking_from_date__CST: string;
    bulletin_app__booking_to_date__CST: string;
    bulletin_app__booking_type__CST: string;
    bulletin_app__driver_id__CST: string;
    bulletin_app__car_id__CST: string;
    createdDate: string;
};

export type SaleCarData = {
    id: string;
    bulletin_app__sale_car_model__CST: string;
    bulletin_app__sale_car_seats__CST: string | number;
    bulletin_app__sales_car_color__CST: string;
    createdDate: string;
};

export type CarPartData = {
    id: string;
    bulletin_app__car_parts_category_id__CST: string;
    createdDate: string;
};

export type ServiceBookingData = {
    bulletin_app__order_id__CST: string;
    bulletin_app__sc_booking_date__CST: string;
    bulletin_app__sc_id__CST: string;
    bulletin_app__service_id__CST: string;
    id: string;
}

export type OrderDetails = {
    order?: Partial<OrderDetailsOrder> | null;
    booking_data?: Partial<BookingData> | null;
    sale_car_data?: Partial<SaleCarData> | null;
    car_part_data?: Partial<CarPartData> | null;
    service_booking?: Partial<ServiceBookingData> | null;
};

export const getOrders = async (skip = 0, searchParams?: URLSearchParams): Promise<GetOrdersOutput> => {
    const query: Record<string, string | number> = { user_token: "dummy", skip };
    if (searchParams) {
        searchParams.forEach((value, key) => { query[key] = value; });
    }
    const res = await miniAppInstance.get(ORDER_LIST_PATH, query);

    if (res.data && res.data.result && res.data.result.length > 0) {
        const first = res.data.result[0];
        return {
            orders: first.orders || [],
            total_count: first.total_count || 0,
        };
    }

    return { orders: [], total_count: 0 };
};

export const getOrderDetails = async (order_id: string): Promise<OrderDetails | null> => {
    const res = await miniAppInstance.get(ORDER_DETAILS_PATH, {
        user_token: "dummy",
        order_id,
    });

    const payload = res?.data?.result?.[0] ?? res?.data?.result ?? res?.data ?? null;
    if (!payload || typeof payload !== "object") return null;

    if (
        "order" in payload ||
        "booking_data" in payload ||
        "sale_car_data" in payload ||
        "car_part_data" in payload ||
        "service_booking" in payload
    ) {
        return payload as OrderDetails;
    }

    return { order: payload as Partial<OrderDetailsOrder> };
};
