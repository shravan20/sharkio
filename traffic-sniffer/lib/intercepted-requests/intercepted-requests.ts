import { Request } from "express";
import { InterceptedRequest, RequestKey } from "../intercepted-request/";
import { Invocation, PathResponseData } from "../../types/types";
import { RequestsMap } from "./requests-map";

export class InterceptedRequests {
  private requests: RequestsMap;

  constructor() {
    this.requests = new RequestsMap();
  }

  private ensureRequest(key: RequestKey, service: string, port: number) {
    if (this.requests.has(key)) {
      return this.requests.get(key)!;
    } else {
      const request = new InterceptedRequest(key, service, port);
      this.requests.set(key, request);
      return request;
    }
  }

  interceptRequest(request: Request, service: string, port: number) {
    const { method, path } = request;
    const key = new RequestKey(method, path);
    const interceptedRequest = this.ensureRequest(key, service, port);
    interceptedRequest.intercept(request);
  }

  execute(
    url: string,
    method: string,
    invocation: Invocation,
    service: string,
    port: number
  ) {
    const interceptedRequest = this.ensureRequest(
      new RequestKey(method, url),
      service,
      port
    );
    return interceptedRequest.execute(invocation);
  }

  stats(): PathResponseData[] {
    const result: PathResponseData[] = [];

    for (const request of this.requests.values()) {
      result.push(request.stats());
    }

    return result;
  }

  invalidate() {
    this.requests.clear();
  }
}
