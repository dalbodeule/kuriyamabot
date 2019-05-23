import * as request from "request-promise";

export default class Geocode {
  private key: string;
  private uri: string;

  constructor(key: string) {
    this.key = key;
    this.uri = "https://dapi.kakao.com/v2/local/search/address.json";
  }

  public async get(query: string, page?: number,
                   size?: number): Promise<responseSuccess> {
    const options = {
      uri: this.uri,
      qs: {
        query,
        page,
        size,
      },
      headers: {
        Authorization: `KakaoAK ${this.key}`,
      },
      json: true,
    };

    const result = await request(options);
    return result;
  }
}

export interface responseSuccess {
  meta: {
    total_count: number,
    pageable_count: number,
    is_end: boolean,
  };
  documents?: document[];
}

export interface document {
  address_name: string;
  address_type: "REGION" | "ROAD" | "REGION_ADDR" | "ROAD_ADDR";
  x: string;
  y: string;
  address: address;
  road_address: road_address;
}

export interface address {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_3depth_h_name: string;
  h_code: string;
  b_code: string;
  mountain_yn: string;
  main_address_no: string;
  sub_address_no: string | null;
  zip_code: number;
  x: string;
  y: string;
}

export interface road_address {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  road_name: string;
  underground_yn: "Y" | "N";
  main_building_no: string;
  sub_building_no: string | null;
  building_name: string;
  zone_no: string;
  x: string;
  y: string;
}
