export interface PageQueryRequest {
  page: number;
  pageSize: number;
  sortColumn? : string;
  sortAscending? : boolean;
}
