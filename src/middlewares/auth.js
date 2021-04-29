import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { statusCodes } from '../utils/statuscode';
import { messages } from '../utils/message';
import { errorResponse } from '../utils/response';

dotenv.config();

export const createToken = (payload) => {
  const token = jwt.sign({ payload }, process.env.SECRETKEY);
  return `Bearer ${token}`;
};

/**
 * This function verifies
 * that user token is valid
 * */
export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return errorResponse(res, statusCodes.forbidden, messages.noToken)
    // return res.status(403).json({
    //   status: 403,
    //   error: 'No token supplied'
    // });
  }
  token = token.split(' ')[1];
     
    jwt.verify(token, process.env.SECRETKEY, (error, authData) => {

      if (error) {
        if (error.message.includes('signature')) {
            return errorResponse(res, statusCodes.forbidden, messages.invalidToken);
        //   return res.status(403).json({
        //     status: 403,
        //     error: 'Invalid token supplied'
        //   });
        }
        return errorResponse(res, statusCodes.forbidden, error.message);
      }
      req.authData = authData;
      return next();
    }); 
};