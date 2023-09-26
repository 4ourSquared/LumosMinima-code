import axios from 'axios'
import useLogin from '../../auth/LoginMechanism'

describe("Test della funzione di login", ()=>{
    test("Login con successo", async ()=>{
        const spy = jest.spyOn(axios,"post").mockImplementation(async ()=>{return {status:200}})

        const username = "utente"
        const password = "test"

        const login = useLogin()
        const result = await login(username,password)

        expect(spy).toHaveBeenNthCalledWith(1,
            "/accounting/login", 
            {   
                username: "utente", 
                password: "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff" 
            }, 
            {withCredentials: true}
        )

        expect(result).toBe(true)

    })

    test("Login fallisce",async ()=>{
        jest.spyOn(axios,"post").mockImplementation(async ()=>{return {status:500}})

        const username = "utente"
        const password = "test"

        const login = useLogin()
        const result = await login(username,password)

        expect(result).toBe(false)
    })

    test("Login fallisce a causa di un errore del client",async ()=>{
        jest.spyOn(axios,"post").mockImplementation(()=>{throw new Error()})

        const username = "utente"
        const password = "test"

        const login = useLogin()
        const result = await login(username,password)

        expect(result).toBe(false)

    })

})