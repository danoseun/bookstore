import express from 'express';
import fileUpload from 'express-fileupload';
import { bookObj, userObj } from '../controllers';
import { verifyToken } from '../middlewares/auth';
import { userValidator } from '../validations/user';
import { ratingValidator } from '../validations/rating';

const { validateRating } = ratingValidator;
const { validateUser } = userValidator;
const { uploadImage, getTwentyFeaturedBooks, allBooks, 
        getCartItemsTotal, addToCart, showBookDetails, rateBook, 
        addBookReaction, search } = bookObj;
const { logIn } = userObj

export const router = express.Router();

router.post('/api/v1/login', validateUser, logIn);
router.post('/api/v1/uploads', fileUpload({useTempFiles: true}), uploadImage);
router.get('/api/v1/books', allBooks);
router.get('/api/v1/books/:id', showBookDetails);
router.get('/api/v1/featuredbooks', getTwentyFeaturedBooks);
router.post('/api/v1/carts', verifyToken, getCartItemsTotal);
router.post('/api/v1/addtocart', verifyToken, addToCart);
router.post('/api/v1/rates', verifyToken, rateBook);
router.post('/api/v1/ratings', verifyToken, validateRating, rateBook)
router.post('/api/v1/reactions', verifyToken, addBookReaction)
router.get('/api/v1/search', search);
