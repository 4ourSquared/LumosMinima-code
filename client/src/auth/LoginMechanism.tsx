import axios from "axios";


export default async function UseLoginMechanism(username: string, password: string) : Promise<boolean> {

    try {
        axios.defaults.baseURL = "http://localhost:5000/";
        const response = await axios.post("/accounting/login", { username: username, password: password });
        const token = response.data;
        if(token){
            localStorage.setItem("token", JSON.stringify(token));
            return true;
        }
        else{
            return false
        }
    } catch (error) {
        return false;
    }
}
