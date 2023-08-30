import axios from "axios";

export async function isLogged() : Promise<boolean>
{
    try {
        console.log("Spedisco la richiesta di autenticazione")
        axios.defaults.baseURL = "http://localhost:5000/";
        const response = await axios.get("/accounting/verify", { withCredentials: true });
        return response.status === 200
    } catch (error) {
        console.log(error)
        return false;
    }
}

export async function isManutentore()
{
    //return getCookie("user-type") === "manutentore"
    return true
}

export async function isAmministratore()
{
    //return getCookie("user-type") === "amministratore"
    return true
}

/*
function getCookie(name:String) : String {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.pop()!.split(';').shift() ?? '';
}
*/