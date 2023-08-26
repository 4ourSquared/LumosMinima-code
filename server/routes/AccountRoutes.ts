import { Router, Request, Response } from "express";
import UserSchema from "../schemas/UserSchema";
import * as crypto from "crypto-js";
import jwt from "jsonwebtoken";


// INFO: Per validare un token generato, bisogna utilizzare la funzione verify() di jwt (https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)

const accountRoutes = Router();

// Logout
accountRoutes.post("/logout", (req: Request, res: Response) => {});

// Login
accountRoutes.post("/login", async (req: Request, res: Response) => {
    console.log("Ricevuta richiesta di login");
    const {username, password } = req.body;

    try {
        const query_username = { username: username };
        const user = await UserSchema.findOne(query_username);

        if (!user || user.password !== crypto.SHA512(password).toString()) {

            if(!user){ 
                console.log("Username non trovato");
            }

            else{
                console.log("Password errata");
                console.log(crypto.SHA512(password).toString());
                console.log(user.password);
            }

            return res.status(401).json({ message: "Credenziali non valide" });
        }

        const token = await jwt.sign({ userId: user._id, username: user.username, privilege: user.privilege }, "ChiaveDaImplementareTODO:", {
            expiresIn: "1h",
        });

        return res.json({ token });
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

        const token = jwt.sign(
            { userId: newUser._id },
            "ChiaveDaImplementareTODO:",
            {
                expiresIn: "1h",
            }
        );

        return res.json({ token });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Errore nel processo di registrazione" });
    }
});

accountRoutes.get("/checkToken", async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Token non presente" });
    }

    try {
        const decodedToken = jwt.verify(token, "ChiaveDaImplementareTODO:");
        console.log(decodedToken);
        return res.status(200).json({ message: "Token valido", isValid: true });
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Token non valido", isValid: false });
    }
});

export default accountRoutes;
