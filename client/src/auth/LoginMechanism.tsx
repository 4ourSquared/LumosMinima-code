import axios from "axios";
import sha512 from "js-sha512";


export default function useLoginMechanism() : (username:string,password:string) => Promise<boolean> {
    
    return async (username: string, password: string) => {

        try {
            axios.defaults.baseURL = "http://localhost:5000/";
            const response = await axios.post("/accounting/login", { username: username, password: sha512.sha512(password) });
            const token = response.data;
            if(token){
                //localStorage.setItem("token", JSON.stringify(token));
                //NON SICURO!
                return true;
            }
            else{
                return false
            }
        } catch (error) {
            return false;
        }
    }
}
