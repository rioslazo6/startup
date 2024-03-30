document.addEventListener("DOMContentLoaded", function(event) {
    const username = sessionStorage.getItem("username")
    if (username) {
        document.getElementById("usernameSpan").textContent = username
        setDisplay("loginMenu", "none")
        setDisplay("playMenu", "block")
    } else {
        setDisplay("loginMenu", "block")
        setDisplay("playMenu", "none")
    }
})

async function login() {
    const newUser = document.getElementById("registerCheckbox").checked
    const usernameInput = document.querySelector("#username")
    const passwordInput = document.querySelector("#password")
    var endpoint = "/api/auth/login"
    if (document.getElementById("registerCheckbox").checked) {
        endpoint = "/api/auth/create"
    }

    if (usernameInput.value.trim().length === 0 || passwordInput.value.trim().length === 0) {
        usernameInput.value = ""
        passwordInput.value = ""
        window.alert("Please enter a valid username and password.")
        return
    }

    const response = await fetch(endpoint, {
        method: "post",
        body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })

    if (response.ok) {
        sessionStorage.setItem("username", usernameInput.value)
        window.location.href = "select.html"
    } else {
        usernameInput.value = ""
        passwordInput.value = ""
        window.alert("Invalid credentials.")
    }
}

function updateButton(checkbox) {
    document.querySelector("#loginButton").innerHTML = checkbox.checked ? "Register" : "Log in"
}

function play() {
    window.location.href = "select.html"
}

function logout() {
    sessionStorage.clear()
    fetch("/api/auth/logout", {
        method: "delete",
    }).then(() => (window.location.href = "/"))
}

function setDisplay(elementId, display) {
    const element = document.querySelector(`#${elementId}`)
    if (element) {
        element.style.display = display
    }
}