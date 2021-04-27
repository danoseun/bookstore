import express from 'express';
import fileUpload from 'express-fileupload';
import { bookObj } from '../controllers/book';



const { uploadImage, getTwentyFeaturedBooks, allBooks, getCartItemsTotal } = bookObj;

export const router = express.Router();

router.post('/api/v1/uploads', fileUpload({useTempFiles: true}), uploadImage);
router.get('/api/v1/books', allBooks);
router.get('/api/v1/featuredbooks', getTwentyFeaturedBooks);
router.post('/api/v1/cart', getCartItemsTotal);
