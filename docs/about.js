const commentInput = document.getElementById('comment-input');
const submitBtn = document.getElementById('submit-comment');
const commentsList = document.getElementById('comments-list');

const borderColors = [
  '#a0aec0',
  '#718096', 
  '#4a5568',
  '#2b6cb0', 
  '#2c5282', 
];

let currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
  currentUser = prompt("Enter your nickname:") || "Anonymous";
  localStorage.setItem('currentUser', currentUser);
}

const changeNickBtn = document.createElement('button');
changeNickBtn.textContent = "Change Nickname";
changeNickBtn.style.marginBottom = "10px";
changeNickBtn.style.padding = "8px 14px";
changeNickBtn.style.border = "none";
changeNickBtn.style.borderRadius = "6px";
changeNickBtn.style.backgroundColor = "#153353ff";
changeNickBtn.style.color = "white";
changeNickBtn.style.fontFamily = "'Courier New', Courier, monospace";
changeNickBtn.style.fontSize = "15px";
changeNickBtn.style.cursor = "pointer";
changeNickBtn.style.transition = "transform 0.3s ease, background-color 0.3s ease";
changeNickBtn.style.animation = "pulse 1.5s infinite";

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
    localStorage.setItem('currentUser', currentUser);
  }
};
document.body.insertBefore(changeNickBtn, document.body.firstChild);


window.onload = () => {
  const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
  savedComments.forEach(comment => addCommentToDOM(comment.text, comment.id, comment.borderColor, comment.user));
};

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function getRandomBorderColor() {
  return borderColors[Math.floor(Math.random() * borderColors.length)];
}

function addCommentToDOM(text, id = generateId(), borderColor = null, user = currentUser) {
  if (!borderColor) borderColor = getRandomBorderColor();

  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comment');
  commentDiv.setAttribute('data-id', id);
  commentDiv.setAttribute('data-user', user);
  commentDiv.style.border = `2px solid ${borderColor}`;
  commentDiv.style.maxWidth = "300px";
  commentDiv.style.wordWrap = "break-word";
  commentDiv.style.overflowY = "auto";

  const author = document.createElement('strong');
  author.textContent = user + ": ";
  commentDiv.appendChild(author);

  const textSpan = document.createElement('span');
  textSpan.textContent = text;
  commentDiv.appendChild(textSpan);

  if (user === currentUser) {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.marginLeft = '10px';
    editBtn.onclick = () => startEditing(commentDiv, textSpan);
    commentDiv.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.onclick = () => deleteComment(commentDiv);
    commentDiv.appendChild(deleteBtn);
  }

  commentsList.appendChild(commentDiv);
}

submitBtn.addEventListener('click', () => {
  const text = commentInput.value.trim();
  if (!text) return;

  addCommentToDOM(text);
  saveComments();

  commentInput.value = '';
});

function saveComments() {
  const comments = [];
  document.querySelectorAll('.comment').forEach(commentDiv => {
    const id = commentDiv.getAttribute('data-id');
    const text = commentDiv.querySelector('span').textContent;
    const borderColor = commentDiv.style.borderColor || '#000';
    const user = commentDiv.getAttribute('data-user');
    comments.push({ id, text, borderColor, user });
  });
  localStorage.setItem('comments', JSON.stringify(comments));
}

function deleteComment(commentDiv) {
  commentDiv.remove();
  saveComments();
}

function startEditing(commentDiv, textSpan) {
  const oldText = textSpan.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = oldText;
  input.style.width = '70%';

  commentDiv.replaceChild(input, textSpan);
  input.focus();

  input.addEventListener('blur', () => finishEditing(commentDiv, input));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    } else if (e.key === 'Escape') {
      input.value = oldText;
      input.blur();
    }
  });
}

function finishEditing(commentDiv, input) {
  const newText = input.value.trim() || 'Empty comment';
  const span = document.createElement('span');
  span.textContent = newText;
  commentDiv.replaceChild(span, input);
  saveComments();
}