function login() {
    const usernameInput = document.querySelector("#username")
    const passwordInput = document.querySelector("#password")
    const correctPassword = credentials[usernameInput.value]
    if (passwordInput.value === correctPassword) {
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