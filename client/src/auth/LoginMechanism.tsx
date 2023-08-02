export default function UseLoginMechanism() {
    return (username:String,password:String): boolean => {

        if(username.startsWith("manut"))
        {
            document.cookie="user-type=manutentore"
            return true
        }
        else if(username.startsWith("admin"))
        {
            document.cookie="user-type=amministratore"
            return true
        }
        return false
    }
}
