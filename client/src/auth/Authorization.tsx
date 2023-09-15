import axios from "axios";

export enum Role {
	Invalid = -1,
	None = 0,
    Operatore = 1,
	Manutentore = 2,
	Amministratore = 3,
    Any = 4
}

export interface UserData {
	role: Role;
}

export default async function getAuthorizationLevel() : Promise<UserData>
{

    try {
        console.log("Spedisco la richiesta di autenticazione")
        axios.defaults.baseURL = "http://localhost:5000/";
        const response = await axios.get("/accounting/verify");
        if(response.status === 200)
        {
            const role: number = response.data.role
            return {role: role}
        }
        else if (response.status === 403)
            return {role:Role.None}
        else
            return {role:Role.Invalid}
    } catch (error) {
        console.log(error)
        return {role:Role.Invalid};
    }
}