import express from 'express';
const app = express();
import router from './router';
import {connenctDB} from './db/connection';
import 'dotenv/config';
import swaggerUi from "swagger-ui-express";
import * as auth from  './middleware/auth';
import seedFn from './db/seed'
import { swaggerSpec } from "./config/swagger";

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use('/api', router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
    res.send('App is running');
});
async function bootStrap() {
    try{
        await connenctDB(process.env.MONGO_URI || '')
        await seedFn();
        app.listen(PORT, () => {
            console.log('Server is running on port: ',PORT);
        });
       

    }catch(error){
        console.error("Error while starting server",error)
    }
    
}
bootStrap().catch(err=>{
    console.error("APP is not runnig",err)
})
