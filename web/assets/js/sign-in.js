// Initialize Awesome Notifications
const notifier = new AWN({
    position: "top-right" // Set position to top-right
});


async function signIn() {

    const user_dto = {
        email: document.getElementById("email").value,
        password: document.getElementById("pwd").value,
        verification: document.getElementById("vc").value
    };

    const response = await fetch(
            "SignIn",
            {
                method: "POST",
                body: JSON.stringify(user_dto),
                headers: {
                    "Content-Type": "application/json"
                }
            }
    );

    if (response.ok) {
        const json = await response.json();
        console.log(json);

        if (json.success) {
            window.location = "index.html";


        } else {

            notifier.warning(json.message);

        }
    } else {
        notifier.alert("Server Error Please Try Again Later");
    }
}

function changeVerify() {
    const vcElement = document.getElementById("vc");
    if (document.getElementById("verify-check").checked) {
        vcElement.readOnly = true; // Enable read-only
    } else {
        vcElement.readOnly = false; // Disable read-only
    }
}