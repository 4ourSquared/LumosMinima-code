import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserItem from "../types/UserItem";
import Footer from "./Footer";
import Header from "./Header";

export const UserTable: React.FC = () => {
    const [users, setUsers] = useState<UserItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await axios.get<UserItem[]>(
                    "http://localhost:5000/accounting/userList"
                );
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        loadUsers();
    }, []);

    return (
        <>
        <Header/>
        <div className="row table-responsive">
            <table className=" table table-hover align-middle caption-top">
                <caption>Lista degli Utenti</caption>
                <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Privilegio</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    {users.map((user) => (
                        <tr key={user.username}>
                            <th scope="row">{user.username}</th>
                            <td>{user.email}</td>
                            <td>{user.privilege}</td>
                            <td>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        navigate(
                                            `/accounting/users/${user.username}`
                                        )
                                    }
                                >
                                    Modifica
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <Footer/>
        </>
    );
};

export default UserTable;