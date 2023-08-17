import { Router, Request, Response } from "express";
import UserSchema from "../schemas/UserSchema";
import * as crypto from "crypto-js";
import jwt from "jsonwebtoken";


const accountRoutes = Router();

// Logout
accountRoutes.post("/logout", (req: Request, res: Response) => {});

// Login
accountRoutes.post("/login", async (req: Request, res: Response) => {
    const { password } = req.body.password;

    try {
        const query_username = { username: req.body.username.toString() };
        const user = await UserSchema.findOne(query_username);

        if (!user || user.password !== crypto.SHA512(password).toString()) {
            return res.status(401).json({ message: "Credenziali non valide" });
        }

        const token = jwt.sign({ userId: user._id }, "ChiaveDaImplementareTODO:", {
            expiresIn: "1h",
        });

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Errore nel processo di login" });
    }
});

// Signup
accountRoutes.post("/signup", async (req: Request, res: Response) => {
    const { email, username, password } = req.body.password;

    try {

        const query_username = { username: req.body.username.toString() };
        const query_email = { email: req.body.email.toString() };

        const existingUser = await UserSchema.findOne(query_username);
        const existingMail = await UserSchema.findOne(query_email);

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
        return res
            .status(500)
            .json({ message: "Errore nel processo di registrazione" });
    }
});

export default accountRoutes;
