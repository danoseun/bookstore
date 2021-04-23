import { upload, removeFolder } from '../helpers/upload';




export const bookObj = {
    
    /**
     * inserts user details into db
     */

     async uploadImage(req, res){
        try {
            if(!req.files){
              return res.status(400).json({
                  error: 'No files attached'
              });
            }

    
            const results = await upload(req.files.image);
            console.log('1', results);
            removeFolder('tmp');
          } catch (error) {
            return res.status(500).json({
              status: 500,
              error: error.message
            });
          }
     }
}