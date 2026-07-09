// ===========================
// EXAMPANIC LOGIN SYSTEM
// ===========================

async function loginUser() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter Email and Password.");
        return;
    }

    const btn = document.querySelector(".login-btn");
    btn.disabled = true;
    btn.innerHTML = "⏳ Logging in...";

    try {

        const { data, error } = await db.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert("❌ " + error.message);
            btn.disabled = false;
            btn.innerHTML = "Login →";
            return;
        }

        alert("✅ Login Successful!");

        window.location.href = "dashboard.html";

    } catch (err) {

        alert("❌ " + err.message);

        btn.disabled = false;
        btn.innerHTML = "Login →";

    }

}

// ===========================
// AUTO LOGIN CHECK
// ===========================

async function checkSession() {

    const {
        data: { session }
    } = await db.auth.getSession();

    if (session) {
        window.location.href = "dashboard.html";
    }

}

checkSession();
