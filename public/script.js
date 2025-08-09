// script.js
document.addEventListener("DOMContentLoaded", () => {
  const allCodeElements = document.querySelectorAll("code.code-container");

  allCodeElements.forEach((codeElement) => {
    const preElement = codeElement.parentElement;
    if (!preElement) return;

    const wrapper = document.createElement("div");
    wrapper.className = "code-wrapper";

    preElement.parentNode.insertBefore(wrapper, preElement);
    wrapper.appendChild(preElement);

    const defaultText = "Copy";
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.textContent = defaultText;

    wrapper.appendChild(copyButton);

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
        });
    });
  });
});
