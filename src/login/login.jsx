import React from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

export function Login({ authState, onAuthChange }) {
    const [newUser, setNewUser] = React.useState(false)
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const navigate = useNavigate()

    async function login() {
        let endpoint = newUser ? "/api/auth/create" : "/api/auth/login"
    
        if (username.trim().length === 0 || password.trim().length === 0) {
            setUsername("")
            setPassword("")
            window.alert("Please enter a valid username and password.")
            return
        }
    
        const response = await fetch(endpoint, {
            method: "post",
            body: JSON.stringify({ username: username, password: password }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
    
        if (response.ok) {
            sessionStorage.setItem("username", username)
            onAuthChange(username, true)
            navigate("/select")
        } else {
            setUsername("")
            setPassword("")
            window.alert("Invalid credentials.")
        }
    }

    function logout() {
        sessionStorage.clear()
        onAuthChange("", false)
        fetch("/api/auth/logout", {
            method: "delete",
        })
    }

    return (
        <main className="container-fluid text-center">
            <h1 className="great-value mt-5">Great Value</h1>
            <h1 className="carter-one-regular">PoKéMoN</h1>
            <h1 className="freshman mb-5">STADIUM</h1>
            {/* This will be shown if NOT logged in */}
            {!authState &&
                <div id="loginMenu">
                    <p className="mb-4">Please enter your credentials to play.</p>
                    <div>
                        <div className="row mb-3 text-center">
                            <div className="col-sm-4">
                                <label className="col-form-label" htmlFor="username">Username: </label>
                            </div>
                            <div className="col-sm">
                                <input className="form-control" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username here" />
                            </div>
                        </div>
                        <div className="row mb-5 align-items-center">
                            <div className="col-sm-4">
                                <label className="col-form-label" htmlFor="password">Password: </label>
                            </div>
                            <div className="col-sm">
                                <input className="form-control" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="mb-5">
                            <input className="form-check-input me-2" type="checkbox" defaultChecked={newUser} id="registerCheckbox" onChange={() => setNewUser(!newUser)} />
                            <label className="form-check-label" htmlFor="registerCheckbox">Register as a new user</label>
                        </div>
                        <button id="loginButton" className="btn btn-primary mb-5" onClick={() => login()}>{newUser ? "Register" : "Log in"}</button>
                    </div>
                </div>
            }
            {/* This will be shown if logged in */}
            {authState &&
                <div id="playMenu">
                    <div className="mb-5">Logged in as: <span id="usernameSpan" className="text-info">{sessionStorage.getItem("username")}</span></div>
                    <button type="button" className="mx-3 btn btn-primary" onClick={() => navigate("/select")}>Play</button>
                    <button type="button" className="mx-3 btn btn-danger" onClick={() => logout()}>Log out</button>
                </div>
            }
        </main>
    )
}