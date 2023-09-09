import axios from "axios";

export enum Role {
	Invalid = -1,
	None = 0,
    Base = 1,
    Operatore = 2,
	Manutentore = 3,
	Amministratore = 4,
    Any = 5
}

export interface UserData {
	role: Role;
}

export default async function getAuthorizationLevel() : Promise<UserData>
{
    const map = new Map([
        ["base",Role.Base],
        ["operatore",Role.Operatore],
        ["manutentore",Role.Manutentore],
        ["amministratore",Role.Amministratore]
    ])

    try {
        console.log("Spedisco la richiesta di autenticazione")
        axios.defaults.baseURL = "http://localhost:5000/";
        const response = await axios.get("/accounting/verify");
        if(response.status === 200)
        {
            const role: string = response.data.role
            return {role: map.get(role)!}
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