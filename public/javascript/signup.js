const signupFormHandler = async function (event) {
  event.preventDefault();

  const username = document
    .querySelector("#username-input-signup")
    .value.trim();
  const email = document.querySelector("#email-input-signup").value.trim();
  const password = document
    .querySelector("#password-input-signup")
    .value.trim();

  if (username && password && email) {
    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        email,
        username,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector(".signup-form")
  .addEventListener("submit", signupFormHandler);
