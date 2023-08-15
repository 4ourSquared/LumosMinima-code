import { Router, Request, Response } from "express";

const tokenRoutes =  Router();

tokenRoutes.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    console.log(`Segnale ricevuto a api/movimento/token/aree/${id}`);
    res.status(200).json("Successo");
});

export default tokenRoutes;