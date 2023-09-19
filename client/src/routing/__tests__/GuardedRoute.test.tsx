import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import GuardedRoute from "../GuardedRoute";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import * as authmodule from '../../auth/Authorization'
import {Role} from '../../auth/Authorization'


describe("Funzionamento delle guarded routes", ()=>{
test("Valutazione della condizione di guardia TRUE", async ()=>{

    //mock della funzione
    jest.spyOn(authmodule, 'default').mockImplementation(async () => {return {role:Role.Amministratore}});
    function TestParagraph() {
        return <p>Funziona</p>
    }

    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route element={<GuardedRoute requiredRole={Role.Any} redirectRoute="/" />}>
                    <Route path="/" element={<TestParagraph />}/>
                </Route>
            </Routes>
        </MemoryRouter>
    )
    await waitFor(() => {
        const element = screen.getByText("Funziona");
        expect(element).toBeInTheDocument();
    })
}
)

test("Valutazione della condizione di guardia FALSE e conseguente redirect", async ()=>{

    jest.spyOn(authmodule, 'default').mockImplementation(async () => {return {role:Role.None}});
    function TestParagraph1() {
        return <p>YES</p>
    }

    function TestParagraph2() {
        return <p>NO</p>
    }

    render(
        <MemoryRouter initialEntries={["/yes"]}>
            <Routes>
                <Route path="no" element={<TestParagraph2/>}></Route>
                <Route element={<GuardedRoute requiredRole={Role.Amministratore} redirectRoute="/no" />}>
                    <Route path="yes" element={<TestParagraph1 />}/>
                </Route>
            </Routes>
        </MemoryRouter>
    )
    await waitFor(() => {
        const element = screen.getByText("NO");
        expect(element).toBeInTheDocument();
    })
})
})