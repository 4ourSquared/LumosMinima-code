import { Router, Request, Response } from "express";
import UserSchema from "../schemas/UserSchema";
import * as crypto from "crypto-js";
import jwt from "jsonwebtoken";


// INFO: Per validare un token generato, bisogna utilizzare la funzione verify() di jwt (https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)
const JWT_KEY = "1KqcotIgrWMVyZq3SgC7uMIlRX8TNvEZ73hSenTUKt4dlyORcYfw4wehb0YvV4tD" //64 byte
const accountRoutes = Router();

// Logout
accountRoutes.post("/logout", (req: Request, res: Response) => {});

// Login
accountRoutes.post("/login", async (req: Request, res: Response) => {
    console.log("Ricevuta richiesta di login");
    const { password } = req.body;

    try {
        const query_username = { username: req.body.username.toString() };
        const user = await UserSchema.findOne(query_username);

        if(user){
            console.log(user.username);
            console.log(user.password);
            console.log(crypto.SHA512(password).toString());
            console.log(password);
        }

        if (!user || user.password !== crypto.SHA512(password).toString()) {
            return res.status(401).json({ message: "Credenziali non valide" });
        }

        const token = await jwt.sign({ userId: user._id }, "JWT_KEY", {
            expiresIn: "1h",
        });

        return res.cookie("auth-jwt", JSON.stringify(token), {
            //secure: true,        cosa faccio? il protocollo è http o https?
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, //il cookie dopo 1 mese sparisce dal browser
            httpOnly: true, //fondamentale
          }).status(200);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Errore nel processo di login" });
    }
});

// Signup
accountRoutes.post("/signup", async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {

        const query_username = { username: req.body.username.toString() };
        const query_email = { email: req.body.email.toString() };

        const existingUser = await UserSchema.findOne({query_username});
        const existingMail = await UserSchema.findOne({query_email});

        if (existingUser) {
            return res.status(409).json({ message: "Username già in uso" });
        }

        if (existingMail) {
            return res.status(409).json({ message: "Email già in uso" });
        }

        const hashedPassword = crypto.SHA512(password).toString();

        const newUser = new UserSchema({
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();

        /* renderei il login un'operazione successiva alla registrazione per aumentare la sicurezza 
        const token = jwt.sign(
            { userId: newUser._id },
            "ChiaveDaImplementareTODO:",
            {
                expiresIn: "1h",
            }
        );

        return res.json({ token });
        */
        return res.status(200)
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Errore nel processo di registrazione" });
    }
});

accountRoutes.get("/verify", async (req: Request, res: Response) => {
    const token = req.cookies['auth-jwt']
    console.log(token)
    if(!token) 
    {
        res.status(403).json({ error: "Nessun token fornito!" })
        console.log("nessun token fornito")
    }
    else {
        jwt.verify( token, 
                    JWT_KEY, 
                    (err:any) => {
                        if(err) 
                            res.status(500).json({error: "Autenticazione del token fallita!"})
                        else
                            res.status(200).json({result: "Successo"})
         })
    }
})

export default accountRoutes;
