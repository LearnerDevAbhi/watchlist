import mongoose from "mongoose";
export const connenctDB =  async (uri: string)=>{
    try {
        await mongoose.connect(uri);
        console.log("Conection with MONGODB is Established")
    } catch (error) {
     console.log("Error while connection with DB")
     throw error
    }
}