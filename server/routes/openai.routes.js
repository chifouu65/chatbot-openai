import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi} from 'openai';

dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: 'https://api.openai.com/v1',
});

const openai = new OpenAIApi(config);

const fetchProducts = async () => {
    try {
        const response = await fetch('https://api.pierrette-essentielle.com/api/products?populate=*&[filters][categories][id]=2&[filters][price][$lte]=50&sort=price'
        ,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer 4dcc75be011d7d3b82cd71c8219728b6cac10d3987b40ae8c6e84a4743de3b4918ee4980535d9c582b5e1d8400df88f9946204668a912724031c1ba0553a8a9e40c48296be4f8205bfa17449c03d2bfb271accca12871b316d968b9fe71733fba773c96549c6ea70c347c077e8c1abcf20a76b3e1073fdd3f4c71c6dfbdd0ac3'
                }
            }
        ).then((response) => {
            return response.json();
        }
        ).catch((error) => {
            console.log(error);
        }
        );
        const products = response.data;
        return products;
    } catch (error) {
        console.log(error);
        return error;
    }
}

const products = await fetchProducts();


router.route('/test').get((req, res) => {
  res.status(200).json({ products });
})

const generatePrompt = (prompt) => {
    const context = `
    Tu es un chatbot du nom de PierretteBot qui répond aux questions des clients sur les produits.
    Ce qui va suivre est une conversation entre un humain et un chatbot 
    d'un site de vente en ligne.
    `
    const website_info = `
    nom du site: Pierrette Essentielle \n 
    numéro de téléphone: +33 7 50 34 94 97 \n 
    developer: noah.lhote56@gmail.com \n
    adresse: 123 rue de la pierre, Paris, France \n 
    email: es@pierrette-essentielle.com \n 
    `
    const website_products = `
    liste des produits: \n
    ${products.map((product) => {
        const { title, price, desc } = product.attributes;
        return `
        nom du produit: ${title} \n
        prix: ${price} \n
        description: ${desc} \n
        `
    })}
    `

    return `
    ${context}
    \n
    si on te demande les informations sur le site de vente en ligne: ${website_info}
    \n
    liste des produits: ${website_products}
    \n
    You: ${prompt}
    \n 
    `
}

console.log(generatePrompt("bonjour"));

router.route('/').post(async (req, res) => {

    const { prompt } = req.body;

    const promptt = generatePrompt(prompt);
   
    if (prompt.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a text",
            }
        });
        return;
    } else if (prompt.trim().length > 300) {
        res.status(400).json({
            error: {
                message: "Please enter a text with less than 300 characters",
            }
        });
        return;
    }

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: promptt,
            temperature: 0,
            max_tokens: 500,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: ["You:"],
        })
        .then((response) => {
            return response.data.choices[0].text;
        })
        .catch((error) => {
            console.log(error);
        });
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error });
    }
})

export default router;