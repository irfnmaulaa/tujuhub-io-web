export type ApiResponse<D=null> = {
    status: string;
    message?: string;
    data?: D;
}

export type PaginationFields = {
    request: {
        page: number;
        size: number;
    };
    current_page: number;
    filtered: {
        count: number;
        from: number;
        to: number;
    };

    total_count: number;
    pages_count: number;
    is_last_page: boolean;
}

export type PaginationResponse<D=null> = {
    items: D;
} & PaginationFields

export type ApiPaginationResponse<D=null> = {
    status: string;
    message?: string;
    data?: D & PaginationFields
}

export type ApiResponseError<D=null> = {
    status: string;
    message: string;
    errors?: D;
}