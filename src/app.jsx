import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./app.css"

export default function App() {
    return (
        <div className="body">
            <header>
                <nav className="navbar bg-dark-subtle">
                    <img className="navbar-brand" height="50" src="images/logo.png" />
                    <menu className="navbar-nav">
                        <li className="nav-item"><a className="nav-link" href="index.html">Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="select.html">Select Pokémon</a></li>
                        <li className="nav-item"><a className="nav-link" href="battle.html">Battle</a></li>
                        <li className="nav-item"><a className="nav-link" href="leaderboard.html">Leaderboard</a></li>
                    </menu>
                </nav>
            </header>

            <main>App components will be displayed here.</main>

            <footer className="bg-dark-subtle">
                <span className="mx-3">German Rios-Lazo</span>
                <a className="mx-3" href="https://github.com/rioslazo6/startup" target="_blank">GitHub</a>
            </footer>
        </div>
    )
}