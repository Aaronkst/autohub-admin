import { miniAppInstance } from "./instance";

export interface ServiceAndCenterData {
  serviceCenter: {
    id: string;
    name: string;
    address: string;
    owner_id: string;
    lat: number;
    long: number;
  },
  service: {
    id: string;
    name: string;
    price: number
  }
}

export const getServiceCenterDetails = async (service_center_id: string, service_id: string): Promise<ServiceAndCenterData | null> => {
  const res = await miniAppInstance.get("/service/bulletin_app__AutoHub/0.0.0/service/details", {
    service_center_id,
    service_id,
  });

  if(!res.data.result?.data || res.data.resCode !== "0") {
    return null
  }

  return res.data.result.data;
};