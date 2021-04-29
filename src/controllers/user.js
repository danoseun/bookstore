import db  from '../database/models';
import BaseService from '../services';
import { successResponse, successResponseWithData, errorResponse } from '../utils/response';
import { statusCodes } from '../utils/statuscode';
import { messages } from '../utils/message';
import { createToken } from '../middlewares/auth';


// create an instance of user model
const UserService = new BaseService(db.User);


export const userObj = {
    /**
     * Log user in
     */
    async logIn(req, res){
        const userdetail = req.body;
        delete userdetail.password;

        const token = createToken(req.body);
        successResponseWithData(res, statusCodes.success, messages.success, token);
    }
}