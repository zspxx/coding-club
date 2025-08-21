import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyArQwewNEX6No0tqMbsim-GYl534MbhG_M",
  authDomain: "test-4a5d0.firebaseapp.com",
  projectId: "test-4a5d0",
  storageBucket: "test-4a5d0.firebasestorage.app",
  messagingSenderId: "1007166716238",
  appId: "1:1007166716238:web:8cde7320cf4c73b04a061f",
  measurementId: "G-NVS0BRV8N0",
  databaseURL: "https://test-4a5d0-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const commentInput = document.getElementById("comment-input");
const submitBtn = document.getElementById("submit-comment");
const commentsList = document.getElementById("comments-list");

const borderColors = ['#a0aec0','#718096','#4a5568','#2b6cb0','#2c5282'];

let currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  currentUser = prompt("Enter your nickname:") || "Anonymous";
  localStorage.setItem("currentUser", currentUser);
}

const changeNickBtn = document.createElement("button");
changeNickBtn.textContent = "Change Nickname";
changeNickBtn.style.cssText = `
  margin-bottom: 10px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background-color: #153353ff;
  color: white;
  font-family: 'Courier New', Courier, monospace;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  animation: pulse 1.5s infinite;
`;
changeNickBtn.onmouseover = () => {
  changeNickBtn.style.backgroundColor = "#2c5282";
  changeNickBtn.style.transform = "scale(1.05)";
};
changeNickBtn.onmouseout = () => {
  changeNickBtn.style.backgroundColor = "#153353ff";
  changeNickBtn.style.transform = "scale(1)";
};
changeNickBtn.onclick = () => {
  const newNick = prompt("Enter new nickname:", currentUser);
  if (newNick && newNick.trim()) {
    currentUser = newNick.trim();
    localStorage.setItem("currentUser", currentUser);
  }
};
document.body.insertBefore(changeNickBtn, document.body.firstChild);

function getRandomBorderColor() {
  return borderColors[Math.floor(Math.random() * borderColors.length)];
}

function addCommentToDOM(id, data) {
  const { text, user, borderColor } = data;
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");
  commentDiv.setAttribute("data-id", id);
  commentDiv.setAttribute("data-user", user);
  commentDiv.style.border = `2px solid ${borderColor}`;
  commentDiv.style.maxWidth = "300px";
  commentDiv.style.wordWrap = "break-word";
  commentDiv.style.overflowY = "auto";

  const author = document.createElement("strong");
  author.textContent = user + ": ";
  commentDiv.appendChild(author);

  const textSpan = document.createElement("span");
  textSpan.textContent = text;
  commentDiv.appendChild(textSpan);

  if (user === currentUser) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.marginLeft = "10px";
    editBtn.onclick = () => startEditing(id, textSpan);
    commentDiv.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "5px";
    deleteBtn.onclick = () => deleteComment(id);
    commentDiv.appendChild(deleteBtn);
  }

  commentsList.appendChild(commentDiv);
}

submitBtn.addEventListener("click", () => {
  const text = commentInput.value.trim();
  if (!text) return;

  const newCommentRef = push(ref(db, "comments"));
  set(newCommentRef, {
    text: text,
    user: currentUser,
    borderColor: getRandomBorderColor(),
    timestamp: Date.now()
  });

  commentInput.value = "";
});

onValue(ref(db, "comments"), (snapshot) => {
  commentsList.innerHTML = "";
  snapshot.forEach((child) => {
    addCommentToDOM(child.key, child.val());
  });
});

function startEditing(id, textSpan) {
  const oldText = textSpan.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = oldText;
  input.style.width = "70%";

  textSpan.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => finishEditing(id, input));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
    if (e.key === "Escape") { input.value = oldText; input.blur(); }
  });
}

function finishEditing(id, input) {
  const newText = input.value.trim() || "Empty comment";
  update(ref(db, "comments/" + id), { text: newText });
}

function deleteComment(id) {
  remove(ref(db, "comments/" + id));
}
