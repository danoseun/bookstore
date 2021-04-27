import db  from '../database/models';
import BaseService from '../services'
import { successResponse, successResponseWithData, errorResponse } from '../utils/response';
import { statusCodes } from '../utils/statuscode';
import { messages } from '../utils/message';
import { upload, removeFolder } from '../helpers/upload';

// create an instance of book model
const BookService = new BaseService(db.Book);



export const bookObj = {
    
    /**
     * bulk upload images to cloudinary
     */

     async uploadImage(req, res){
        try {
            if(!req.files){
              errorResponse(res, statusCodes.badRequest, messages.uploadError);
            }
            const results = await upload(req.files.image);
            removeFolder('tmp');
          } catch (error) {
            errorResponse(res, statusCodes.serverError, error.message);
          }
     },

     /**
      * 
      * @returns 20 featured books
      */
     async getTwentyFeaturedBooks(req, res){
       try {
         const result = await BookService.index({limit:20});
         successResponseWithData(res, statusCodes.success, messages.success, result);
       } catch(error){
        errorResponse(res, statusCodes.serverError, error.message);
       }
     },

     /**
      * @returns paginated books in the db
      */
     async allBooks(req, res){
      console.log('w', req.query.page);
      const regex = /^\d+$/;
      if(!req.query.page.match(regex)) errorResponse(res, statusCodes.badRequest, messages.badRequest);
      const page = Number(req.query.page);
       try {
         const allBooks = await BookService.findAndCountAll();
         const bookCount = allBooks.count;
         const numberOfBooksPerPage = 15;

         const currentPage = page || 1;
         const startFrom = req.query.offset ? Number(req.query.offset) : 0;
         if(bookCount < 1){
          successResponse(res, statusCodes.notFound, messages.notFound);
         }

         const allBooksResult = await BookService.index({
           offset: startFrom,
           limit: numberOfBooksPerPage
         });
         successResponseWithData(res, statusCodes.success, messages.success, allBooksResult);
       } catch(error){
          errorResponse(res, statusCodes.serverError, error.message);
       }
     },

     /**
      * {params} accepts an array of objects, each 
      * having quantity of product and price of each book
      */
     async getCartItemsTotal(req, res){
       const cart = req.body.cart;

       /**
        * check if slug in obj === slug in db
        * if equal, check if price is same as db
        * also check if qty requested is available
        */
       try{
        const result = await Promise.all(cart.map(book => BookService.show({slug: book.slug})))
       
        //console.log('HERE', result);
        let subTotal = 0;
        for(let i=0; i<result.length; i++){
          if(+result[i].amount !== +cart[i].amount){
           errorResponse(res, statusCodes.badRequest, messages.amountError(cart[i].slug));
          }
          if(result[i].quantity_available < cart[i].quantity_chosen){
           errorResponse(res, statusCodes.badRequest, messages.quantityOverLoad(cart[i].slug));
          }

          result[i].quantity_available = Number(result[i].quantity_available) - Number(cart[i].quantity_chosen);
          await result[i].save();
          subTotal += +result[i].amount*cart[i].quantity_chosen;
        }
        cart.push({subtotal:subTotal});
        successResponseWithData(res, statusCodes.success, messages.success, cart);
       } catch(error){
          errorResponse(res, statusCodes.serverError, error.message);
       }
     }
}

