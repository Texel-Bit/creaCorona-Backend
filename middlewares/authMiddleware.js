const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ErrorCodesEnum = require('../structs/Errors/ErrorCodesEnum');
const WebSocketSingleton = require('./WebSocketSingleton');


class AuthManager {
    static async validatePassword(req, result, next) {
        const {  PasswordForValidate, storedPasswordHash } = req;
        try {
            const isValid = await bcrypt.compare(PasswordForValidate, storedPasswordHash);
            if (isValid) {
                next();
            } else {
                const error={status:ErrorCodesEnum.INTERNAL_SERVER_ERROR,printMessage:"Invalid Credentials"};
                next(error,null);
                        }
        } catch (error) {
            error.printMessage="Invalid Credentials"
            next(error,null);
        }
    }

    static authenticateJWT(req, result, next) {
        const token = req.header('authorization') ? req.header('authorization').split(' ')[1] : null;
        
        if (!token) {
            const error={status:ErrorCodesEnum.NETWORK_AUTHENTICATION_REQUIRED,printMessage:"Token is missing"};
            next(error,null);
        }

        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {

            if (error) {
                error.printMessage="Invalid Token"
                next(error,null);
            }
            req.user = user;
            next();
        });

    }

    static authenticateOptionalJWT(req, result, next) {
        const token = req.header('authorization') ? req.header('authorization').split(' ')[1] : null;
        
        if (!token) {
            next();
        }

        
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {

            if (error) {
                error.printMessage="Invalid Token"
                next(error,null);
            }
            req.user = user;
            next();
        });

    }

    static validateJWT(token,result, next) {

        const error={status: ErrorCodesEnum.NETWORK_AUTHENTICATION_REQUIRED, printMessage: "Token is missing"};

        if (!token) {
            next(error,null);
        }
    
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedContent) => {
            if (err) {
                next(error,null);
            }
            
            next(null, decodedContent);  // pass decodedContent as second argument
        });

    }

    static validateAdmin() {
       
       
        const error = { status: ErrorCodesEnum.UNAUTHORIZED, printMessage: "You can't access this" };
        return (req, res, next) => {
            if (!req) {
                return next(error);
            }
            

            AuthManager.authenticateJWT(req, res, (err) => {  // Changed result to res
                if (err) {
                    return next(error);
                }
                if(req.user && req.user.sysUserRole_idsysuserRole != 1) {                
                    return next(error);
                }
                next();
            });
        };
    }
   


    
    static validateSwaggerAdmin() {

        const error = { status: ErrorCodesEnum.UNAUTHORIZED, printMessage: "You can't access this" };
        return (req, res, next) => {

            if (!req) {
                res.redirect('/Login.html');
                return null;
            }
       
            const token = req.cookies.authToken;

            if(!token) { 
                res.redirect('/Login.html');
                return null;
            }
            req.headers.authorization = `Bearer ${token}`; 


            AuthManager.authenticateJWT(req, res, (err) => {  // Changed result to res
                if (err) {
                    res.redirect('/Login.html');
                    return null;
                }

                if(req.user && req.user.sysUserRole_idsysuserRole != 1) {                
                    res.redirect('/Login.html');
                    return null;
                }
                next();
            });
        };
    }
    
    
}



module.exports = AuthManager;
