import { IDatabase } from "./database-manager";
import { JsonDB, Config } from "node-json-db";
import * as path from "path";

export class LocalDataManager implements IDatabase {
  readonly object: JsonDB;

  constructor() {
    const url = path.resolve("./resources/");
    const db = new JsonDB(new Config("local_db", true, false, url));
    this.object = db;
  }

  async exists(query: string): Promise<boolean> {
    return await this.object.exists(query);
  }

  async read(query: string): Promise<any> {
    // Read
    return await this.object.getData(query);
  }

  async write(query: string, data: any): Promise<any> {
    // Write
    await this.object.push(query, data);
  }

  remove(id: string): void {
    // Remove
  }

  close(): void {
    // Close
  }
}
