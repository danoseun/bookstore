import db  from '../database/models';
import { Op } from 'sequelize';
import BaseService from '../services';
import { redisClient } from '../index';
import { successResponse, successResponseWithData, errorResponse } from '../utils/response';
import { statusCodes } from '../utils/statuscode';
import { messages } from '../utils/message';
import { upload, removeFolder } from '../helpers/upload';
import bookreaction from '../database/models/bookreaction';

// create an instance of book model
const BookService = new BaseService(db.Book);

// create an instance of rating model
const RatingService = new BaseService(db.Rating);

// create an instance of bookreaction model
const BookReactionService = new BaseService(db.BookReaction);



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
      //console.log('w', req.query.page);
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
       try {
        const result = await Promise.all(cart.map(book => BookService.show({slug: book.slug})))
      
        let subTotal = 0;
        for(let i=0; i<result.length; i++){
          if(Number(result[i].amount) !== Number(cart[i].amount)){
           errorResponse(res, statusCodes.badRequest, messages.amountError(cart[i].slug));
          }
          if(result[i].quantity_available < +cart[i].quantity_chosen){
           errorResponse(res, statusCodes.badRequest, messages.quantityOverLoad(cart[i].slug));
          }

          result[i].quantity_available = Number(result[i].quantity_available) - Number(cart[i].quantity_chosen);
          await result[i].save();
          subTotal += +result[i].amount*cart[i].quantity_chosen;
        }
        let cartObj = {cart};
        cartObj.subtotal = subTotal;
        redisClient.set(req.authData.payload.username, JSON.stringify(cartObj), 'EX', 86400);
        successResponseWithData(res, statusCodes.success, messages.success, cartObj);
       } catch(error){
          errorResponse(res, statusCodes.serverError, error.message);
       }
     },

     /**
      * add/update cart
      */
     async addToCart(req, res){
          let cartObj;
          const newCart = req.body;

          redisClient.get(req.authData.payload.username, async(err, cart) => {
            if(err){
              errorResponse(res, statusCodes.serverError, err.message);
            }
    
            cartObj = JSON.parse(cart);

            try {
                const result = await BookService.show({slug:newCart.slug});
                if(result.quantity_available < +newCart.quantity_chosen){
                  errorResponse(res, statusCodes.badRequest, messages.quantityOverLoad(newCart.slug));
                }
                if(+result.amount !== +newCart.amount){
                  errorResponse(res, statusCodes.badRequest, messages.amountError(newCart.slug));
                }

                cartObj.cart.push(newCart);
                result.quantity_available = Number(result.quantity_available) - Number(newCart.quantity_chosen);
                await result.save();
                cartObj.subtotal += Number(newCart.amount)*Number(newCart.quantity_chosen);
                redisClient.set(req.authData.payload.username, JSON.stringify(cartObj), 'EX', 1200);
                successResponseWithData(res, statusCodes.success, messages.success, cartObj);
            } catch(error){
              errorResponse(res, statusCodes.serverError, error.message);
            }
          })
     },

     /**
      * Show details of book
      */
     async showBookDetails(req, res){
       try{
         const result = await BookService.show({slug: req.params.id});
         if(result === null || result === undefined){
            errorResponse(res, statusCodes.notFound, messages.notFound);
            return;
         }
          successResponseWithData(res, statusCodes.success, messages.success, result.dataValues);
       } catch(error){
          errorResponse(res, statusCodes.serverError, error.message);
       }
     },

     /**
      * Rate Book and Average Rating
      */
     async rateBook(req, res){
       const { foundBook, rating } = req.body;
       const bookSlug = foundBook.slug;
       const { id:authorId } = req.authData.payload;
       const ratingObj = {
         authorId,
         bookSlug,
         rating
       }
        try {
          await RatingService.create(ratingObj);

          const bookRatings = await RatingService.index({
            where: { bookSlug }
          })

          let bookRatingStar = 0;
      
          if (!bookRatings.length) return bookRatingStar;
      
          let sum = 0;
          bookRatings.forEach((values) => {
            sum += Number(values.rating);
          });
          bookRatingStar = sum / bookRatings.length;
          bookRatingStar.toFixed(1);
          successResponseWithData(res, statusCodes.created, messages.created, bookRatingStar);
        } catch(error){
         errorResponse(res, statusCodes.serverError, error.message);
        }
     },

     /**
      * Realtime book like/remove like
      */
     async addBookReaction(req, res){
       const { slug } = req.body;
       const userId = req.authData.payload.id;

       const where = {
        [Op.and]: [
          { bookSlug: slug },
          { likedBy: userId }
        ]
      }

       try {
        const bookReaction = await BookReactionService.showWithOptions(where);
        if(bookReaction){
          await db.BookReaction.destroy({ where });
          const reactionCount = await BookReactionService.index({
            where: { bookSlug:slug }
          })
          return successResponseWithData(res, statusCodes.success, messages.reactionRemoved, reactionCount.length);
        }

        const create = await BookReactionService.create({
          isLiked: true,
          likedBy: userId,
          bookSlug: slug
        })

        const reactionCount = await BookReactionService.index({
          where: { bookSlug:slug }
        })

        successResponseWithData(res, statusCodes.created, messages.created, reactionCount.length);
       } catch(error){
          errorResponse(res, statusCodes.serverError, error.message);
       }
     },

     /**
      * Search controller
      */
     async search(req, res){
      let { offset, limit, order, sort, ...rest } = req.query;
      offset = offset ? Number(offset) : 0;
      limit = limit ? Number(limit) : 10;
      let options = {};
  
      if (Object.keys(rest).length) {
          for (const key in rest) {
            if (rest.hasOwnProperty(key)) {
              const value =    
                key === "q" ? { [Op.iLike]: `%${rest[key]}%` } : rest[key];
              const field = key === "q" ? ("title" || "author") : key;
              options[field] = value;
            }
          }
        }
  
      try {
          const data = await BookService.findAndCountAllOptions({
              where: options,
              order: [[sort || "updatedAt", order || "DESC"]],
              offset,
              limit
            });
              if(data.rows.length > 0){
                return successResponseWithData(res, statusCodes.success, messages.success, data.rows);
              // return res
              // .status(200)
              // .json({ data: data.rows, offset, limit, total: data.count });
           }
             else {
                return errorResponse(res, statusCodes.notFound, messages.notFound);
            }
            
      } catch(error) {
        return errorResponse(res, statusCodes.serverError, error.message);
      }
     }
}