import { Response } from "express";

class ApiResponse {

    private res: Response;
    private statusCode: number = 200;
    private message: string = "Success";
    private responseData: any = null;

    constructor(res: Response) {
        this.res = res;
    }

    static create(res: Response): ApiResponse {
        return new ApiResponse(res);
    }

    status(code: number): this {
        this.statusCode = code;
        return this;
    }

    withMessage(message: string): this {
        this.message = message;
        return this;
    }

    withData(data: any): this {
        this.responseData = data;
        return this;
    }

    send() {
        const isSuccess = this.statusCode >= 200 && this.statusCode < 300;

        return this.res.status(this.statusCode).json({
            success: isSuccess,
            statusCode: this.statusCode,
            message: this.message,
            data: this.responseData
        });
    }
}

export {ApiResponse};