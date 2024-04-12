import React from "react"
import { useNavigate } from "react-router-dom"

export function Leaderboard() {
    const navigate = useNavigate()
    const [leaderboardData, setLeaderboardData] = React.useState([])
    React.useEffect(() => {
        if (!sessionStorage.getItem("username")) {
            navigate("/") // Redirecting if not logged in.
        }
        async function loadLeaderboard() {
            setLeaderboardData([])
            try {
                // Getting latest leaderboard from the service.
                const response = await fetch("api/leaderboard")
                const data = await response.json()
                if (!ignore) {
                    setLeaderboardData(data)
                }
                // Saving locally.
                localStorage.setItem("leaderboard", JSON.stringify(leaderboardData))
            } catch {
                // Using local copy if there's an error.
                const leaderboardString = localStorage.getItem("leaderboard")
                if (leaderboardString) {
                    if (!ignore) {
                        setLeaderboardData(leaderboardString)
                    }
                }
            }
        }
        let ignore = false
        loadLeaderboard()
        return () => {
            ignore = true
        }
    }, [])

    const tableHeaders = []
    const tableRows = []
    if (leaderboardData.length) {
        let headers = []
        for (const [key, value] of Object.entries(leaderboardData[0])) {
            headers.push({ name: key, type: typeof value })
        }
        headers.forEach((header) => {
            tableHeaders.push(<th key={header.name}>{header.name}</th>)
        })
        for (const [i, row] of Object.entries(leaderboardData)) {
            tableRows.push(
                <tr key={i}>
                    <td>{row.username}</td>
                    <td>{row.battlesWon}</td>
                    <td>{row.totalBattles}</td>
                    <td>{row.winPercentage}</td>
                </tr>
            )
        }
    }

    return (
        <main className="container-fluid text-center">
            <table id="leaderboard" className="my-5 table table-responsive table-bordered table-striped table-hover">
                <thead>
                    <tr>{tableHeaders}</tr>
                </thead>
                <tbody>
                    {tableRows.length ? tableRows : <tr><td colSpan="4">No scores yet. Go battle!</td></tr>}
                </tbody>
            </table>
            <button className="btn btn-primary mb-5" onClick={() => navigate("/select")}>Back to team selection</button>
        </main>
    )
}