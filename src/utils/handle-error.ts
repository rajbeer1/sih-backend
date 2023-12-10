import e, { Response } from 'express';

const handleErrors = (error: any, res: Response) => {

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    const err = error.errors || null;

    if (err) {

        const errors = error.errors

        return res.status(400).json({
            status: false,
            message: message,
            errors: errors.map((e: any) => {
                return {
                    field: e.property,
                    message: Object.values(e.constraints)[0]
                }
            })
        });
    }

    return res.status(statusCode).json({
        status: false,
        message: message,
    });

};

export { handleErrors }