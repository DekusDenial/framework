/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import NaviFactsModel from 'navi-data/models/navi-facts';
import { ColumnType } from 'navi-data/models/metadata/column';

export type RequestV1 = TODO;

export type RequestOptions = {
  clientId?: string;
  requestId?: string;
  customHeaders?: Dict<string>;
  timeout?: number;
  page?: number;
  perPage?: number;
  format?: string;
  cache?: boolean;
  queryParams?: Dict<string | number>;
  dataSourceName?: string;
};

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'ini'
  | 'in'
  | 'notin'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'isnull'
  | 'bet'
  | 'nbet'
  | 'contains';

export const SORT_DIRECTIONS = <const>['desc', 'asc'];

export type Parameters = Record<string, string>;

export type SortDirection = typeof SORT_DIRECTIONS[number];

export type Column = {
  cid?: string;
  field: string;
  parameters: Parameters;
  type: ColumnType;
  alias?: string | null;
};

export type Filter = {
  field: string;
  parameters: Parameters;
  type: ColumnType;
  operator: FilterOperator;
  values: (string | number | boolean)[];
};

export type Sort = {
  field: string;
  parameters: Parameters;
  type: ColumnType;
  direction: SortDirection;
};

// TODO: Remove V2 once V1 is no longer in use
export type RequestV2 = {
  filters: Filter[];
  columns: Column[];
  table: string;
  dataSource: string;
  sorts: Sort[];
  limit?: number | null;
  requestVersion: '2.0';
};

export enum QueryStatus {
  COMPLETE = 'COMPLETE',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED',
  TIMEDOUT = 'TIMEDOUT',
  FAILURE = 'FAILURE',
}

export enum TableExportResultType {
  CSV = 'CSV',
  JSON = 'JSON',
}

export interface AsyncQuery {
  requestId: string;
  request: RequestV1 | RequestV2;
  status: QueryStatus;
  result: AsyncQueryResult | null;
  createdOn: Date;
  updatedOn: Date;
  then: () => NaviFactsModel;
  cancel: () => void;
}

export type AsyncQueryResponse = {
  asyncQuery: {
    edges: [
      {
        node: {
          id: string;
          query: string;
          status: QueryStatus;
          result: AsyncQueryResult | null;
        };
      }
    ];
  };
};

export class FactAdapterError extends Error {
  name = 'FactAdapterError';
}

export interface AsyncQueryResult {
  httpStatus: number;
  contentLength: number;
  responseBody: string;
  recordCount: number;
}

export default interface NaviFactAdapter {
  fetchDataForRequest(request: RequestV1 | RequestV2, options: RequestOptions): Promise<TODO>;
  urlForFindQuery(request: RequestV1 | RequestV2, options: RequestOptions): string;
  urlForDownloadQuery(request: RequestV1 | RequestV2, options: RequestOptions): Promise<string>;
}
