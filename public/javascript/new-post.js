const newFormHandler = async function (event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const post_text = document.querySelector('input[name="post-text"]').value;
  const image = document.getElementById('post-image');

  const response = await fetch(`/api/post`, {
    method: "POST",
    body: JSON.stringify({
      title,
      post_text,
      image,
    }),

    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
};

document
  .querySelector(".new-post-form")
  .addEventListener("submit", newFormHandler);
