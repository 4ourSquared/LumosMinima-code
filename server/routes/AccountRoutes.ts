import { Router, Request, Response } from "express";
import UserSchema from "../schemas/UserSchema";
import * as crypto from "crypto-js";
import jwt from "jsonwebtoken";
import request from "request";

// INFO: Per validare un token generato, bisogna utilizzare la funzione verify() di jwt (https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)

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

        if (!user || user.password !== crypto.SHA512(password).toString()) {
            return res.status(401).json({ message: "Credenziali non valide" });
        }

        const token = await jwt.sign(
            { userId: user._id, email: user.email, privilege: user.privilege },
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
            .json({ message: "Errore nel processo di login" });
    }
});

// Signup
accountRoutes.post("/signup", async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        const query_username = { username: req.body.username.toString() };
        const query_email = { email: req.body.email.toString() };

        const existingUser = await UserSchema.findOne({ query_username });
        const existingMail = await UserSchema.findOne({ query_email });

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

        // Effettua la richiesta POST per il login
        request.post(
            {
                url: "http://localhost:5000/accounting/login",
                json: true,
                body: {
                    username,
                    password,
                },
            },
            (error, response, body) => {
                if (error) {
                    console.error("Errore nella richiesta:", error);
                    return res
                        .status(500)
                        .json({ message: "Errore nella richiesta di login" });
                }

                // Gestisci la risposta dal server di login
                if (response.statusCode === 200) {
                    // Login riuscito, body contiene il token
                    return res.json(body);
                } else {
                    // Login non riuscito, body contiene il messaggio di errore
                    return res.status(response.statusCode).json(body);
                }
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Errore nella registrazione" });
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
