const list = document.getElementById("clipList");
const search = document.getElementById("search");
const clearAll = document.getElementById("clearAll");

function renderClips(clips) {
    list.innerHTML = "";
    clips.forEach((clip, index) => {
        const li = document.createElement("li");
        const div = document.createElement("div")
        const textSpan = document.createElement("span");
        textSpan.textContent = clip.text.length > 50 ? clip.text.slice(0, 50) + '...' : clip.text;

        const copyBtn = document.createElement("button");
        copyBtn.classList.add("copy-button");
        copyBtn.innerHTML = '<svg width="18px" height="18px" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M10 8V7C10 6.05719 10 5.58579 10.2929 5.29289C10.5858 5 11.0572 5 12 5H17C17.9428 5 18.4142 5 18.7071 5.29289C19 5.58579 19 6.05719 19 7V12C19 12.9428 19 13.4142 18.7071 13.7071C18.4142 14 17.9428 14 17 14H16M7 19H12C12.9428 19 13.4142 19 13.7071 18.7071C14 18.4142 14 17.9428 14 17V12C14 11.0572 14 10.5858 13.7071 10.2929C13.4142 10 12.9428 10 12 10H7C6.05719 10 5.58579 10 5.29289 10.2929C5 10.5858 5 11.0572 5 12V17C5 17.9428 5 18.4142 5.29289 18.7071C5.58579 19 6.05719 19 7 19Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>'
        copyBtn.onclick = () => navigator.clipboard.writeText(clip.text);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-button");
        deleteBtn.textContent = "✕";
        deleteBtn.title = "Supprimer ce clip";

        deleteBtn.onclick = () => {
            chrome.storage.local.get(["clipboard"], (res) => {
                const storedClips = res.clipboard || [];
                storedClips.splice(index, 1);
                chrome.storage.local.set({ clipboard: storedClips }, () => {
                    renderClips(storedClips);
                });
            });
        };

        div.appendChild(copyBtn);
        div.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(div)
        list.appendChild(li);
    });
}


function loadClips() {
    chrome.storage.local.get(["clipboard"], (res) => {
        const clips = res.clipboard || [];
        renderClips(clips);
    });
}


clearAll.addEventListener("click", () => {
    chrome.storage.local.set({ clipboard: [] }, loadClips);
});


search.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    chrome.storage.local.get(["clipboard"], (result) => {
        const clips = result.clipboard || [];
        const filtered = clips.filter(c => c.text.toLowerCase().includes(query));
        renderClips(filtered);
    });
});


loadClips()


