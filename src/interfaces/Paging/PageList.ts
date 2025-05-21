import type { MetaData } from "./MetaData";

export interface PageList<T> {
  metaData: MetaData;
  list: T[];
}
