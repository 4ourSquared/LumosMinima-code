import { Router, Request, Response } from "express";
import UserSchema from "../schemas/UserSchema";
import sha512 from "js-sha512";
import jwt from "jsonwebtoken";

// INFO: Per validare un token generato, bisogna utilizzare la funzione verify() di jwt (https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)
const JWT_KEY = "1KqcotIgrWMVyZq3SgC7uMIlRX8TNvEZ73hSenTUKt4dlyORcYfw4wehb0YvV4tD" //64 byte
const accountRoutes = Router();

// Logout
accountRoutes.post("/logout", (req: Request, res: Response) => {
        const token = req.cookies['auth-jwt']
      
        if (!token) {
          return res.status(401).json({
            status: 'error',
            error: 'Unauthorized',
          });
        }
      
        return res.cookie("auth-jwt", JSON.stringify(token), {
            sameSite: 'strict',
            maxAge: -1,
            httpOnly: true, //fondamentale
          }).status(200).send();
});

// Login
accountRoutes.post("/login", async (req: Request, res: Response) => {
    console.log("Ricevuta richiesta di login");
    const { username, password } = req.body;

    try {
        const query_username = { username: username };
        const user = await UserSchema.findOne(query_username);

        if (!user || user.password !== password) {
            
            if(!user){ 
                console.log("Username non trovato");
            }

            else{
                console.log("Password errata");
                console.log(password);
                console.log(user.password);
            }

            return res.status(401).json({ message: "Credenziali non valide" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, privilege: user.privilege },
            "JWT_KEY", 
            {expiresIn: "1h"}
        );
        
        console.log("JWT firmato!")
        console.log(token)
        return res.cookie("auth-jwt",token, {
            sameSite: 'strict',
            maxAge: 60 * 60 * 2, //il cookie dopo 2 ore sparisce dal browser
            httpOnly: true, //fondamentale
          }).status(200).send()
          
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Errore nel processo di login" });
    }
});

// Signup
accountRoutes.post("/signup", async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        const query_username = { username: req.body.username.toString() };
        const query_email = { email: req.body.email.toString() };

        const existingUser = await UserSchema.findOne( query_username);
        const existingMail = await UserSchema.findOne( query_email );

        if (existingUser) {
            return res.status(409).json({ message: "Username già in uso" });
        }

        if (existingMail) {
            return res.status(409).json({ message: "Email già in uso" });
        }

        const hashedPassword = sha512.sha512(password).toString();

        const newUser = new UserSchema({
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();

        return res.status(200).send()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Errore nella registrazione" });
    }
});


accountRoutes.get("/verify", async (req: Request, res: Response) => {
    let token = req.cookies['auth-jwt']
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
                        {
                            console.log(err)
                            res.status(500).json({error: "Autenticazione del token fallita!"})
                        }
                        else
                            res.status(200).json({result: "Successo"})
         })
    }
})

export default accountRoutes;
