function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    // Example login validation
    console.log("Email:", email);
    console.log("Password:", password);

    alert("Login Successful!");

    // Redirect example
    // window.location.href = "dashboard.html";
}