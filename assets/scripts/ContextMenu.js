const contextMenu = document.getElementById("context-menu");
const copyOption = document.getElementById("copy-option");
const shareOption = document.getElementById("share-option");
let storedSelectedText = "";

window.addEventListener("contextmenu", e => {
    e.preventDefault();
    storedSelectedText = window.getSelection().toString();
    copyOption.style.display = storedSelectedText.trim() ? "block" : "none";
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.display = "block";
});

window.addEventListener("click", () => contextMenu.style.display = "none");

copyOption.addEventListener("click", () => {
    if (storedSelectedText) {
        const textarea = document.createElement('textarea');
        textarea.value = storedSelectedText;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showTemporaryMessage("Selected text copied to clipboard!");
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showTemporaryMessage("Failed to copy text.");
        }
        document.body.removeChild(textarea);
    }
});


shareOption.addEventListener("click", () => {
    if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href }).then();
    } else {

        showTemporaryMessage("Sharing not supported in this browser.");
    }
});

function showTemporaryMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.textContent = message;
    messageBox.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    `;
    document.body.appendChild(messageBox);

    setTimeout(() => messageBox.style.opacity = '1', 10);
    setTimeout(() => {
        messageBox.style.opacity = '0';
        messageBox.addEventListener('transitionend', () => messageBox.remove());
    }, 3000);
}
