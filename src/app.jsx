import React from "react"
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom"
import { Login } from "./login/login"
import { Select } from "./select/select"
import { Battle } from "./battle/battle"
import { Leaderboard } from "./leaderboard/leaderboard"
import "bootstrap/dist/css/bootstrap.min.css"
import "./app.css"

export default function App() {
    const [username, setUsername] = React.useState(sessionStorage.getItem("username") || "")
    const authenticated = !!username
    const [authState, setAuthState] = React.useState(authenticated)

    return (
        <BrowserRouter>
            <div className="body">
                <header>
                    <nav className="navbar bg-dark-subtle">
                        <img className="navbar-brand" height="50" src="images/logo.png" />
                        <menu className="navbar-nav">
                            <li className="nav-item"><NavLink className="nav-link" to="">{authState ? "Home" : "Log In"}</NavLink></li>
                            {authState && <li className="nav-item"><NavLink className="nav-link" to="select">Select Pokémon</NavLink></li>}
                            {authState && <li className="nav-item"><NavLink className="nav-link" to="battle">Battle</NavLink></li>}
                            {authState && <li className="nav-item"><NavLink className="nav-link" to="leaderboard">Leaderboard</NavLink></li>}
                        </menu>
                    </nav>
                </header>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Login
                                authState={authState}
                                onAuthChange={(username, authState) => {
                                    setUsername(username)
                                    setAuthState(authState)
                                }}
                            />
                        } exact
                    />
                    <Route path="/select" element={<Select username={username}/>} />
                    <Route path="/battle" element={<Battle />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                <footer className="bg-dark-subtle">
                    <span className="mx-3">German Rios-Lazo</span>
                    <a className="mx-3" href="https://github.com/rioslazo6/startup" target="_blank">GitHub</a>
                </footer>
            </div>
        </BrowserRouter>
    )
}

function NotFound() {
    return (
        <main className="container-fluid text-center">
            <div>Page not found.</div>
        </main>
    )
}