import express from 'express';
import fileUpload from 'express-fileupload';
import { bookObj } from '../controllers/book';



const { uploadImage } = bookObj;

export const router = express.Router();

router.post('/api/v1/upload', fileUpload({useTempFiles: true}), uploadImage);
// router.put('/api/v1/tabs/:tabId', updateTab);
// router.get('/api/v1/tabs', getAllTabs);
// router.delete('/api/v1/tabs/:tabId', removeTab);
