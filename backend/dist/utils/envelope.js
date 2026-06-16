export function successResponse(data, meta) {
    return { status: "success", data, meta };
}
export function errorResponse(errors) {
    return { status: "error", data: null, errors };
}
