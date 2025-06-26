const contextMenu = document.getElementById("context-menu");
const copyOption = document.getElementById("copy-option");
const shareOption = document.getElementById("share-option");

window.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    const selection = window.getSelection().toString().trim();
    copyOption.style.display = selection ? "block" : "none";

    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.display = "block";
});

window.addEventListener("click", () => {
    contextMenu.style.display = "none";
});

copyOption.addEventListener("click", () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        navigator.clipboard.writeText(selectedText).then(() =>
            alert("Selected text copied to clipboard!")
        );
    }
});

shareOption.addEventListener("click", () => {
    if (navigator.share) {
        navigator.share({title: document.title, url: window.location.href}).then();
    } else {
        alert("Sharing not supported in this browser.");
    }
});