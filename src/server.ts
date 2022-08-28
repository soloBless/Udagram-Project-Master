import express, { Request, response, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
 
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  app.use("./util/tmp", deleteLocalFiles)
  app.use("/filteredimage?image_url={{}}", filterImageFromURL)

  app.get("/filteredimage/", async(req: Request, res: Response) => {
     
    // GET /filteredimage?image_url={{URL}}
   
    try{
      let { image_url } :{image_url:string} = req.query;
     
      if (!image_url){
      return res.status(400).send("image URL required");
              }
    //call filterImageFromURL(image_url) to filter the image
    //send the resulting file in the response   
    const image_path = await filterImageFromURL(image_url);   
               res.status(200).sendFile(image_path)
                
    //deletes any files on the server on finish of the response     
               res.on('finish', () => deleteLocalFiles([image_path]))
            }
        catch{     
           return res.status(400).send('Bad Gateway!, Image cannot be filtered')
        }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();