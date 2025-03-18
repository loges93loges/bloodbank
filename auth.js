document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const googleLogin = document.getElementById("googleLogin");
    const facebookLogin = document.getElementById("facebookLogin");
    const googleSignup = document.getElementById("googleSignup");
    const facebookSignup = document.getElementById("facebookSignup");

 const BASE_URL = "https://bloodlink-backend-dk99.onrender.com/api/auth";

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${BASE_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok && data.token) {
                    localStorage.setItem("authToken", data.token);
                    window.location.href = "index.html";
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("Login failed. Please try again.");
            }
        });
    }

    // Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value;

            try {
                const response = await fetch(`${BASE_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, role })
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    window.location.href = "login.html";
                }
            } catch (error) {
                console.error("Signup Error:", error);
                alert("Signup failed. Please try again.");
            }
        });
    }

    // Google & Facebook Login/Signup
    [googleLogin, googleSignup].forEach(button => {
        if (button) {
            button.addEventListener("click", () => {
                window.location.href = "http://localhost:5000/auth/google";
            });
        }
    });

    [facebookLogin, facebookSignup].forEach(button => {
        if (button) {
            button.addEventListener("click", () => {
                window.location.href = "http://localhost:5000/auth/facebook";
            });
        }
    });
});
