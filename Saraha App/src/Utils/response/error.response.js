export const ErrorRespone = ({ status = 400, message = "error", extra = undefined }) => {
    const error = new Error(
        typeof message === "string" ? message : message?.message
    );

    error.status = status;
    error.extra = extra;

    throw error;
};

export const BadRequestException = (message = "bad request exception ", extra) => {
    return ErrorRespone({ status: 400, message, extra });
}   




export const ConflictException = (message = "Conflict exception ", extra) => {
    return ErrorRespone({ status: 409, message, extra });
}   




export const NotfoundException = (message = "Not found exception ", extra) => {
    return ErrorRespone({ status: 404, message, extra });
}   

export const ForbiddenException = (message = "Forbidden exception ", extra) => {
    return ErrorRespone({ status: 403, message, extra });
}   

export const UnauthorizedException = (message = "Unauthorized exception ", extra) => {
    return ErrorRespone({ status: 401, message, extra });
}   
export const globalErrorHandler = (err, req, res, next) => {
    const status = err.status ?? 500;
    const extra = err.extra || undefined;

    return res
        .status(status)
        .json({ message: err.message, stack: err.stack, extra });
};