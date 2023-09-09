import type {RequestHandler} from "express";
import jwt from "jsonwebtoken";

const JWT_KEY =
    "gQbdVpDZY6tnLCHSRAEBND0K4rwvR7TN9zYMdQW0WBEKp6upCqnKJLarxgtpnT18LwACXJ65QZMdV3FwxankYKibK8H5dEME5VPpuwXy302avLrByYJSLx6AU4paJp13h7A0PtZ9UgpfCq8W8BfRH4J6e6HcyMS6i5kk1xfdXHmnAe1JpKdBE8cQ2PjYCuKgaNAVNaBXhduMxE2wnnvkD8AFiGzCPSchrrCL2K9nGwU7KQ2d6p9hvCZrU6vAkeNP"; //256 byte
    
const verifyToken : RequestHandler = (req,res,next) => {
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
                res.locals.role = decoded.privilege
                next()
            }
        });
    }
}

export default verifyToken;