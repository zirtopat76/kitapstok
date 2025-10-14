let books = JSON.parse(localStorage.getItem("books")) || [];
let readBooks = JSON.parse(localStorage.getItem("readBooks")) || [];

function saveData() {
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("readBooks", JSON.stringify(readBooks));
}

function updateBookCount() {
  const count = books.length;
  const counter = document.getElementById("bookCount");
  if (counter) counter.textContent = `Toplam kitap: ${count}`;
}

function showHome() {
  const c = document.getElementById("content");
  c.innerHTML = `
    <div class="home">
      <img src="icons/owl.png" alt="baykuş" style="width:120px;margin-top:20px;border-radius:50%;">
      <h2>Hoş geldin!</h2>
      <p>Kitap stoklarını buradan yönetebilirsin 📚</p>
    </div>
  `;
}

function showAddBook() {
  document.getElementById("content").innerHTML = `
    <h2>Yeni Kitap Ekle</h2>
    <input id="title" placeholder="Kitap adı" /><br>
    <input id="author" placeholder="Yazar adı" /><br>
    <input id="quantity" type="number" placeholder="Adet" /><br>
    <button onclick="addBook()">Ekle</button>
  `;
}

function addBook() {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const quantity = parseInt(document.getElementById("quantity").value) || 1;

  if (title === "" || author === "") return alert("Lütfen tüm alanları doldur.");

  books.push({ title, author, quantity });
  saveData();
  listBooks();
}

function listBooks() {
  const c = document.getElementById("content");
  if (books.length === 0) {
    c.innerHTML = "<p>Henüz kitap eklenmedi.</p>";
    return;
  }

  let html = `<h2>Kitap Listesi</h2><p id="bookCount" class="book-count"></p><ul>`;
  books.forEach((b, i) => {
    html += `<li>
      <span>${b.title} - ${b.author} (${b.quantity} adet)</span>
      <div>
        <button onclick="markAsRead(${i})">📘 Okudum</button>
        <button class="delete-btn" onclick="deleteBook(${i})">Sil</button>
      </div>
    </li>`;
  });
  html += `</ul>`;
  c.innerHTML = html;
  updateBookCount();
}

function showReadBooks() {
  const c = document.getElementById("content");
  if (readBooks.length === 0) {
    c.innerHTML = "<p>Henüz okunan kitap yok.</p>";
    return;
  }

  let html = `<h2>Okuduklarım</h2><ul>`;
  readBooks.forEach(b => {
    html += `<li>${b.title} - ${b.author}</li>`;
  });
  html += `</ul>`;
  c.innerHTML = html;
}

function markAsRead(index) {
  readBooks.push(books[index]);
  books.splice(index, 1);
  saveData();
  listBooks();
}

function deleteBook(index) {
  if (confirm("Bu kitabı silmek istediğine emin misin?")) {
    books.splice(index, 1);
    saveData();
    listBooks();
  }
}

function sortByName() {
  books.sort((a, b) => a.title.localeCompare(b.title, "tr"));
  saveData();
  listBooks();
}

window.onload = () => {
  showHome();
  const bg = document.getElementById("bgMusic");
  bg.volume = 0.3;
  bg.play().catch(() => {});
};
