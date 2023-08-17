import { Router, Request, Response } from "express";
import UserSchema, { IUserSchema } from "../schemas/UserSchema";
import bodyParser from "body-parser";
import * as crypto from "crypto-js";
import jwt from "jsonwebtoken";
import https from "https";
import fs from "fs";

const accountRoutes = Router();

// Logout
accountRoutes.post("/logout", (req: Request, res: Response) => {});

// Login
accountRoutes.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await UserSchema.findOne({ username });

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
    const { email, username, password } = req.body;

    try {
        const existingUser = await UserSchema.findOne({ username: username });
        const existingMail = await UserSchema.findOne({ email: email });

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
