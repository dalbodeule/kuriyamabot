import * as request from 'request-promise'

export default class Geocode {
  private key: string
  private uri: string
  
  constructor (key: string) {
    this.key = key
    this.uri = 'https://us1.locationiq.com/v1/search.php'
  }

  async get(query: string, page?: number,
    size?: number): Promise<responseSuccess> {
    const options = {
      uri: this.uri,
      qs: {
        key: this.key,
        q: query,
        format: 'json',
        limit: page
      },
      json: true
    }

    let result = await request(options)
    return result
  }
}

export type responseSuccess = Array<place>

export interface place {
  place_id: number,
  license: string,
  osm_type: string,
  osm_id: string,
  boundingbox: Array<string>
  lat: string,
  lon: string,
  display_name: string,
  class: string,
  type: string,
  importance: number,
  icon: string,
  address?: Address,
  extratag?: any,
  namedetails?: any,
  geojson?: string,
  geokml?: string,
  svg?: string,
  geotext?: string 
}

export interface Address {
  attraction?: string,
  house_number?: string,
  road?: string,
  neightbourhood?: string,
  hamlet?: string,
  village?: string,
  town?: string,
  region?: string,
  commercial?: string,
  suburb?: string,
  city_district?: string,
  city?: string,
  county?: string,
  state?: string,
  state_district?: string,
  postcode?: string,
  country?: string,
  country_code?: string,
  name?: string
}