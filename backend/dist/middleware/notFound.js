import { errorResponse } from "../utils/envelope.js";
export function notFound(req, res) {
    res.status(404).json(errorResponse([{ message: `Route not Found ${req.method}` }]));
}
