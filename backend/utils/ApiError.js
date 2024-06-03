class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        error = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.error = error;

        if(stack)
            this.stack = stack;
        else
        Error.captureStackTrace(this, this.constructor);
    }
}

export {ApiError};

// export const ApiError = (statusCode, message) => {
//     const error = new Error();
//     error.statusCode = statusCode;
//     error.message = message;
//     return error;
// };