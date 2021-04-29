import Joi from 'joi';
import db  from '../database/models';
import { errorResponse } from '../utils/response';
import { statusCodes } from '../utils/statuscode';
import { messages } from '../utils/message';
import { comparePassword } from '../helpers/password';
import BaseService from '../services';


const UserService = new BaseService(db.User);

export const userValidator = {

    /** This functions validates user input data
        * @param {object} req - The request object
        * @param {object} res - The response oject
        * @param {function} next
        * @returns {object} JSON representing the failure message
        */
    async validateUser(req, res, next) {
      let {
        username, password
      } = req.body;

      const schema = Joi.object().keys({ 
        username: Joi.string().required(),
        password: Joi.string().required()
      });

      const dataToValidate = { 
        username,
        password
      } 

    const validation = schema.validate(dataToValidate);

      if (validation.error) {
          errorResponse(res, statusCodes.badRequest, validation.error.details[0].message);
          return;
      }

      const result = await UserService.show({username: username});
      if(result === undefined || result === null){
        errorResponse(res, statusCodes.unauthorized, messages.unAuthorized);
      }
      const compare = comparePassword(password, result.dataValues.password);
      if(!compare){
        errorResponse(res, statusCodes.unauthorized, messages.unAuthorized);
      }
        
        req.body = result.dataValues;
        return next();
    }
  };