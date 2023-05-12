import { StatusCodes } from 'http-status-codes';
import fetch, { BodyInit, RequestInit } from 'node-fetch';
import { BadRequestError } from '../utils/ApiError';

interface RequestOptions extends RequestInit {
    body?: BodyInit;
  }
  
  type QueryParams = Record<string, string>;
  
  type BaseApiOptions = {
    baseUrl: string;
  };
  
  type FetchFunction = <T>(url: string, body?: BodyInit, args?: QueryParams, requestInit?: RequestOptions) => Promise<T>;
  
  export const createBaseApi = (options: BaseApiOptions): {
    fetch: FetchFunction,
    get: <T>(url: string, args?: QueryParams, requestInit?: RequestOptions) => Promise<T>,
    post: <T>(url: string, body?: Record<string, any>, args?: QueryParams, requestInit?: RequestOptions) => Promise<T>
  }=> {
    const { baseUrl } = options;
  
    const fetch: FetchFunction = async (url, body, args, requestInit) => {
      try {
        const urlObj = new URL(url, baseUrl);
  
        if (args) {
          urlObj.search = new URLSearchParams(args).toString();
        }
  
        const requestOptions: any = { ...requestInit, body };
  
        const response: any = await fetch(urlObj.toString(), requestOptions);
  
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new BadRequestError(errorMessage);
        }
  
        if (response.status === StatusCodes.NO_CONTENT) {
          return;
        }
  
        return response.json();
      } catch (e: any) {
        throw new BadRequestError(e.message);
      }
    };
  
    const get = <T>(url: string, args?: QueryParams, requestInit?: RequestOptions): Promise<T> =>
      fetch(url, undefined, args, { ...requestInit, method: 'GET' });
  
    const post = <T>(url: string, body?: Record<string, any>, args?: QueryParams, requestInit?: RequestOptions): Promise<T> => {
      const bodyString = body ? JSON.stringify(body) : undefined;
  
      return fetch(url, bodyString, args, { ...requestInit, method: 'POST' });
    };
  
    return { fetch, get, post };
  }
  