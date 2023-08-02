export function isLogged() : boolean
{
    return getCookie("user-type") !== ""
}

export function isManutentore()
{
    return getCookie("user-type") === "manutentore"
}

export function isAmministratore()
{
    return getCookie("user-type") === "amministratore"
}

function getCookie(name:String) : String {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.pop()!.split(';').shift() ?? '';
}