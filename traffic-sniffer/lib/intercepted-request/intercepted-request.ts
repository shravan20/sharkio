import { LocalDataManager } from "../data-manager/local-database-manager";
import { IDatabase } from "../data-manager/database-manager";
import axios from "axios";
import { Request } from "express";
import { v4 } from "uuid";
import { Invocation, PathMetadataConfig, PathResponseData } from "../../types";
import { RequestKey } from "./request-key";

export class InterceptedRequest {
  static readonly defaultConfig: PathMetadataConfig = {
    bodyHistoryLimit: 10,
    recordBodies: true,
    recordHeaders: true,
    recordCookies: true,
    recordParams: true,
  };

  private id: string;
  private port: number;
  private service: string;
  private url: string;
  private method: string;
  private hitCount: number;
  private lastInvocationDate?: Date;
  private invocations: Invocation[];
  private config: PathMetadataConfig;
  private dataManager: IDatabase;

  constructor(key: RequestKey, service: string, port: number) {
    this.id = v4();
    this.service = service;
    this.port = port;
    this.method = key.method;
    this.url = key.url;
    this.hitCount = 0;
    this.lastInvocationDate = undefined;
    this.invocations = [];
    this.config = InterceptedRequest.defaultConfig;
    this.dataManager = new LocalDataManager();
    
  }

  private logInvocation(request: Request) {
    if (this.invocations.length >= this.config.bodyHistoryLimit) {
      this.invocations.shift();
    }

    let data = {
      id: v4(),
      timestamp: new Date(),
      body: this.config.recordBodies ? request.body : undefined,
      headers: this.config.recordBodies ? request.headers : undefined,
      cookies: this.config.recordBodies ? request.cookies : undefined,
      params: this.config.recordParams ? request.params : undefined,
    };

    this.invocations.push(data);
    this.storeLocalDb(data);
  }

  private async storeLocalDb(data: any) {
    let query = data.port;
    let hasItems = await this.dataManager.exists(query);
    let items: any[] = [];
    // console.log(query)
    if (hasItems) {
      items = await this.dataManager.read(query);
    }
    items = [...items, data];

    this.dataManager.write(this.service, items);
  }

  intercept(request: Request) {
    this.hitCount++;
    this.lastInvocationDate = new Date();
    this.logInvocation(request);
  }

  async execute(invocation: Invocation) {
    return await axios({
      url: this.url,
      method: this.method,
      params: invocation.params,
      headers: invocation.headers,
      data: invocation.body,
    });
  }

  stats(): PathResponseData {
    const {
      id,
      url,
      service,
      method,
      hitCount,
      lastInvocationDate,
      invocations,
    } = this;

    return {
      id,
      service,
      url,
      method,
      hitCount,
      lastInvocationDate,
      invocations,
    };
  }
}
