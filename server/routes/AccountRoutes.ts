import { Router, Request, Response } from "express";
import UserSchema, {IUserSchema} from "../schemas/UserSchema";

const accountRoutes = Router();

// Logout
accountRoutes.post("/logout", (req: Request, res: Response) => {});

// Login
accountRoutes.post("/login", (req: Request, res: Response) => {});

export default accountRoutes;