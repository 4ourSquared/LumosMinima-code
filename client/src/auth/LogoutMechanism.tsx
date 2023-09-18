import axios from "axios";

export default function useLogoutMechanism() {
    return async () => {

        try {
            axios.defaults.baseURL = "http://localhost:5000/";
            const response = await axios.post("/accounting/logout",{});
            return response.status === 200;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
}