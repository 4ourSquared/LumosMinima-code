import axios from "axios";


export default async function UseLoginMechanism(username: String, password: String) : Promise<boolean> {

    try {
        const response = await axios.post("/login", { username, password });
        const token = response.data.token;
        localStorage.setItem("token", token);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
