export interface IDatabase {
  read(query: string): Promise<any>;
  write(query: string, data: any): void;
  exists(dataPath: string): Promise<boolean>;
  remove(id: string): void;
  close(): void;
}
