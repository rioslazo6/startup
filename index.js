function login() {
    const newUser = document.getElementById("registerCheckbox").checked
    const usernameInput = document.querySelector("#username")
    const passwordInput = document.querySelector("#password")
    const correctPassword = credentials[usernameInput.value]
    if (newUser) {
        if (usernameInput.value.trim().length === 0 || passwordInput.value.trim().length === 0) {
            window.alert("Please enter a valid username and password to register.")
        } else {
            credentials[usernameInput.value] = passwordInput.value // "Adding" new user to "database".
            localStorage.setItem("username", usernameInput.value)
            console.log(credentials)
            window.location.href = "select.html"
        }
    } else if (passwordInput.value === correctPassword) {
        localStorage.setItem("username", usernameInput.value)
        window.location.href = "select.html"
    } else {
        usernameInput.value = ""
        passwordInput.value = ""
        window.alert("Invalid credentials.\n\nHint: try username \"ash\" and password \"pika\".")
    }
}

// This is a "database" of the usernames and passwords.
const credentials = {
    ash: "pika",
    silver: "gold",
    zelda: "link",
    link: "zelda"
}