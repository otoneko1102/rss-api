document.addEventListener("DOMContentLoaded", () => {
  const allCodeElements = document.querySelectorAll("code.code-container");

  allCodeElements.forEach((codeElement) => {
    const preElement = codeElement.parentElement;

    if (!preElement) {
      return;
    }

    const defaultText = "Copy";
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.textContent = defaultText;

    preElement.appendChild(copyButton);

    copyButton.addEventListener("click", () => {
      const textToCopy = codeElement.innerText;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          const classToAdd = "copied";
          copyButton.textContent = "Copied!";
          copyButton.classList.add(classToAdd);

          setTimeout(() => {
            copyButton.textContent = defaultText;
            copyButton.classList.remove(classToAdd);
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy", err);
          const classToAdd = "copied";
          copyButton.textContent = "Failed";
          copyButton.classList.add(classToAdd);

          setTimeout(() => {
            copyButton.textContent(defaultText);
            copyButton.classList.remove(classToAdd);
          }, 2000);
        });
    });
  });
});
