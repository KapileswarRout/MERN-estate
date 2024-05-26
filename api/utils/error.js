//custom errorhandler

export const errorhandler = (statusCode,message) =>{
    const error = new Error(); //Error constructor is used for creating this error
    error.statusCode = statusCode;
    error.message = message;
    return error;
} 