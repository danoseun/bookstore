import { errorResponse } from '../utils/response';
import { statusCodes } from '../utils/statuscode';
import { messages } from '../utils/message';
import BaseService from '../services';
import db from '../database/models';

const BookService = new BaseService(db.Book);

export const ratingValidator = {
    async validateRating(req, res, next){
        let { rating, slug } = req.body;
        if(!rating || rating === ''){
            console.log('here')
            errorResponse(res, statusCodes.badRequest, messages.invalidRating);
            return;
        }

        if(!slug || slug === ''){
            console.log('here')
            errorResponse(res, statusCodes.badRequest, messages.invalidRating);
            return;
        }
        
        if(!/^[1-5]$/.test(rating)){
            errorResponse(res, statusCodes.badRequest, messages.ratingMisnomer);
        }

        const foundBook = await BookService.show({slug: slug});
        //console.log('1', foundBook.slug);
         if(foundBook === null || foundBook === undefined){
            errorResponse(res, statusCodes.notFound, messages.notFound);
            return;
         }

        req.body.rating = rating;
        req.body.foundBook = foundBook;
        next();
    }
}