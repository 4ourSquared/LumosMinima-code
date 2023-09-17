import axios from 'axios'
import useLogout from '../../auth/LogoutMechanism'

describe("Test della funzione di logout", ()=>{
    test("Login con successo", async ()=>{
        const spy = jest.spyOn(axios,"post").mockImplementation(async ()=>{return {status:200}})

        const logout = useLogout()
        const result = await logout()

        expect(result).toBe(true)

    })

    test("Login fallisce",async ()=>{
        jest.spyOn(axios,"post").mockImplementation(async ()=>{return {status:500}})

        const logout = useLogout()
        const result = await logout()

        expect(result).toBe(false)
    })

    test("Login fallisce a causa di un errore del client",async ()=>{
        jest.spyOn(axios,"post").mockImplementation(()=>{throw new Error()})

        const username = "utente"
        const password = "test"

        const logout = useLogout()
        const result = await logout()

        expect(result).toBe(false)

    })

})