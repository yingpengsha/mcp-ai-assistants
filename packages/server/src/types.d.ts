declare namespace Service {
  export interface StandardJSONResponseWrapper<T = NonNullable<unknown>> {
    code: 0 | 1
    message: string
    data: T
  }
  export interface PaginationParams {
    pageNum: number
    pageSize: number
  }

  export interface PaginationResult<T> {
    list: T[]
    total: number
    pageNum: number
    pageSize: number
    totalPage: number
    hasNext: boolean
    hasPrev: boolean
    [key: string]: unknown
  }

  /**
   * @deprecated
   */
  export interface __OldPaginationParams {
    page?: number
    pageSize?: number
  }

  /**
   * @deprecated
   */
  export interface __OldPaginationInfo {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}
