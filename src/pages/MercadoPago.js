import express from "express"
import cors from "cors"
import {MercadoPagoConfig, Preference} from "mercadopago"

const client = new MercadoPagoConfig({accessToken:""});
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/",(req,res) => {
    res.send("soy el server")
})

app.post("/create_preference", async (req,res) => {
    try {
        const body ={
            items:[
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.unit_price),
                    currency_id: "COP"
                }
            ],
            back_urls:{
                success: "https://www.youtube.com",
                failure: "https://www.youtube.com",
                pending: "https://www.youtube.com"
            },
            auto_return: "approved"
        }
        const preferences = new Preference(client);
        const result = await preferences.create({body});
        res.json({
            id: result.id
        })
    } catch(error){
        console.log('preference.error catch:',error)
    }
})