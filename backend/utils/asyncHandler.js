/**
 * The asyncHandler function is a higher-order function that wraps an asynchronous request handler and
 * ensures any errors are caught and passed to the next middleware.
 * @param requestHandler - The `requestHandler` parameter is a function that handles incoming HTTP
 * requests. It typically takes the `req` (request), `res` (response), and `next` parameters, and
 * performs some operations based on the request before sending a response. In the `asyncHandler`
 * function, this `
 * @returns The `asyncHandler` function is returning a new function that takes `req`, `res`, and `next`
 * as parameters. Inside this new function, it resolves the `requestHandler` function with the provided
 * `req`, `res`, and `next` parameters as arguments. If there is an error during the execution of the
 * `requestHandler`, it catches the error and passes it to the `
 */

const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch(
            (err)=>next(err)
        )
    }
}

export {asyncHandler};