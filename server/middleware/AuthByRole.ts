import type {RequestHandler} from "express"

export enum Role {
	Invalid = -1,
	None = 0,
  Operatore = 1,
	Manutentore = 2,
	Amministratore = 3,
  Any = 4
}

const authByRole : (requiredRole:Role[]) => RequestHandler = (requiredRole:Role[]) => {
    return (req,res,next) => {
      const actualRole : number = parseInt(res.locals.role)

       let success: boolean = false
         
       if(requiredRole.at(0) === Role.Any)
         success = actualRole > Role.None
       else
        success = requiredRole.includes(actualRole)
      
        if(!success)
         res.status(500).json({
          error: "Privilegi insufficienti!"})
        else next()
    }  
 }

 export default authByRole;