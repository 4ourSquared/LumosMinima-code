import { Router, Request, Response } from "express";
import UserSchema from "../schemas/UserSchema";
import sha512 from "js-sha512";
import jwt from "jsonwebtoken";
import axios from "axios";

// INFO: Per validare un token generato, bisogna utilizzare la funzione verify() di jwt (https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)
const JWT_KEY =
    "gQbdVpDZY6tnLCHSRAEBND0K4rwvR7TN9zYMdQW0WBEKp6upCqnKJLarxgtpnT18LwACXJ65QZMdV3FwxankYKibK8H5dEME5VPpuwXy302avLrByYJSLx6AU4paJp13h7A0PtZ9UgpfCq8W8BfRH4J6e6HcyMS6i5kk1xfdXHmnAe1JpKdBE8cQ2PjYCuKgaNAVNaBXhduMxE2wnnvkD8AFiGzCPSchrrCL2K9nGwU7KQ2d6p9hvCZrU6vAkeNP"; //256 byte
const accountRoutes = Router();

// Logout
accountRoutes.post("/logout", (req: Request, res: Response) => {
    const token = req.cookies["auth-jwt"];

    if (!token) {
        return res.status(401).json({
            status: "error",
            error: "Unauthorized",
        });
    }

    return res
        .cookie("auth-jwt", token, {
            sameSite: "strict",
            maxAge: -1,
            httpOnly: true, //fondamentale
        })
        .status(200)
        .send();
});

// Login
accountRoutes.post("/login", async (req: Request, res: Response) => {
    console.log("Ricevuta richiesta di login");
    const { username, password } = req.body;

    try {
        const query_username = { username: username.toString() };
        const user = await UserSchema.findOne(query_username);

        if (!user || user.password !== password) {
            if (!user) {
                console.log("Username non trovato");
            } else {
                console.log("Password errata");
                console.log(password);
                console.log(user.password);
            }

            return res.status(401).json({ message: "Credenziali non valide" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, privilege: user.privilege },
            JWT_KEY,
            { expiresIn: "1h" }
        );

        console.log("JWT firmato!");
        console.log(token);

        return res
            .cookie("auth-jwt", token, {
                sameSite: "strict",
                maxAge: 60 * 60 * 2 * 1000, //il cookie dopo 2 ore sparisce dal browser
                httpOnly: true, //fondamentale
            })
            .status(200)
            .send();
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Errore nel processo di login" });
    }
});

// Signup
accountRoutes.post("/signup", async (req: Request, res: Response) => {
    const { username, email, password, privilege } = req.body;

    try {
        const query_username = { username: username.toString() };
        const query_email = { email: email.toString() };

        const existingUser = await UserSchema.findOne(query_username);
        const existingMail = await UserSchema.findOne(query_email);

        if (existingUser) {
            return res.status(409).json({ message: "Username già in uso" });
        }

        if (existingMail) {
            return res.status(409).json({ message: "Email già in uso" });
        }

        const hashedPassword = sha512.sha512(password).toString();

        const newUser = new UserSchema({
            email: email,
            username: username,
            password: hashedPassword,
            privilege: privilege,
        });
        await newUser.save();

        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Errore nella registrazione" });
    }
});

accountRoutes.get("/verify", async (req: Request, res: Response) => {
    let token = req.cookies["auth-jwt"];
    console.log(token);
    if (!token) {
        res.status(403).json({ error: "Nessun token fornito!" });
        console.log("nessun token fornito");
    } else {
        jwt.verify(token, JWT_KEY, (err: any, decoded: any) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    error: "Autenticazione del token fallita!",
                });
            } else {
                res.status(200).json({ role: decoded.privilege });
            }
        });
    }
});

/*
 * CREAZIONE DEI DEMO USER
*/


const DOMAIN: string = "@admin.com"; // Inserire qui il dominio dell'azienda
const PASSWORD: string = "password"; // Inserire qui la password dell'admin

async function createAdmin() {
    if(await UserSchema.findOne({username: "admin"})){
        console.log("Admin già presente");
        return;
    }

    const res = await axios
        .post("http://localhost:5000/accounting/signup", {
            username: "admin",
            email: "admin" + DOMAIN,
            password: PASSWORD,
            privilege: "amministratore",
        });

    if(res.status == 200)
        console.log("Admin creato correttamente");
    else
        console.log("Errore nella creazione dell'admin");
}

async function createUsers(id: number) {
    if(await UserSchema.findOne({username: "user" + id})){
        console.log("User" + id + " già presente");
        return;
    }

    const res = await axios
        .post("http://localhost:5000/accounting/signup", {
            username: "user" + id,
            email: "user" + id + DOMAIN,
            password: PASSWORD,
            privilege: "base",
        });

    if(res.status == 200)
        console.log("User" + id + " creato correttamente");
    else
        console.log("Errore nella creazione dell'user" + id);
}

async function createManutentore(id: number) {
    if(await UserSchema.findOne({username: "manutentore" + id})){
        console.log("Manutentore" + id + " già presente");
        return;
    }

    const res = await axios
        .post("http://localhost:5000/accounting/signup", {
            username: "manutentore" + id,
            email: "manutentore" + id + DOMAIN,
            password: PASSWORD,
            privilege: "manutentore",
        });

    if(res.status == 200)
        console.log("Manutentore" + id + " creato correttamente");
    else
        console.log("Errore nella creazione del manutentore" + id);
}

createAdmin();
for(let i = 1; i <= 10; i++){
    createUsers(i);
}
for(let i = 1; i <= 10; i++){
    createManutentore(i);
}


export default accountRoutes;
