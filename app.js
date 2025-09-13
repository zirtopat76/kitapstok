let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
const bookList = document.getElementById('bookList');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const quantityInput = document.getElementById('quantity');
const searchInput = document.getElementById('searchInput');
const homeBtn = document.getElementById('homeBtn');
const baykus = document.getElementById('baykus');
const owlSound = document.getElementById('owlSound');
const jungleSound = document.getElementById('jungleSound');

const authorColors = {};
const colors = ['#A8D5BA','#FFD3B6','#FFAAA5','#D5AAFF','#FFFAAA','#AAF0D1','#FFB3BA','#B0E0E6'];

function getAuthorColor(author){
    if(authorColors[author]) return authorColors[author];
    const color = colors[Object.keys(authorColors).length % colors.length];
    authorColors[author] = color;
    return color;
}

function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function showToast(message){
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(()=>{toast.classList.add('show')},50);
    setTimeout(()=>{toast.classList.remove('show'); setTimeout(()=>toast.remove(),500)},3000);
}

function normalizeString(str){
    return str.toLowerCase().replace(/İ/g,'i').replace(/I/g,'i').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

function renderBooks(books){
    bookList.innerHTML='';
    if(books.length===0){
        bookList.innerHTML='<p>Hiç kitap yok.</p>';
        return;
    }
    books.forEach((b,idx)=>{
        const card = document.createElement('div');
        card.className='card'+(b.quantity<=2?' low-stock':'');
        card.style.backgroundColor=getAuthorColor(b.author)+'AA';
        card.innerHTML=`
            <span>${b.title} - ${b.author} (${b.quantity} adet)</span>
            <div>
                <button onclick="deleteBook(${idx})">Sil</button>
                <button onclick="updateBook(${idx})">Stok Güncelle</button>
            </div>
        `;
        bookList.appendChild(card);
        card.classList.add('added');
        setTimeout(()=>card.classList.remove('added'),300);
    });
}

function addBook(){
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const quantity = parseInt(quantityInput.value)||0;
    if(!title) return alert('Başlık boş olamaz!');
    inventory.push({title,author,quantity});
    saveInventory();
    const keyword = normalizeString(searchInput.value.trim());
    const filtered = keyword? inventory.filter(b => normalizeString(b.title).includes(keyword) || normalizeString(b.author).includes(keyword)) : inventory;
    renderBooks(filtered);
    showToast(`Kitap eklendi: ${title}`);
    animateBaykus();
    titleInput.value=''; authorInput.value=''; quantityInput.value='';
}

function deleteBook(idx){
    if(confirm('Kitabı silmek istiyor musunuz?')){
        const removed = inventory.splice(idx,1)[0];
        saveInventory();
        renderBooks(inventory);
        showToast(`Kitap silindi: ${removed.title}`);
        animateBaykus();
    }
}

function updateBook(idx){
    const newQty = prompt('Yeni adet girin:', inventory[idx].quantity);
    if(newQty!==null){
        inventory[idx].quantity = parseInt(newQty)||0;
        saveInventory();
        renderBooks(inventory);
        showToast(`Stok güncellendi: ${inventory[idx].title}`);
        animateBaykus();
    }
}

function sortByTitle(){
    const keyword = normalizeString(searchInput.value.trim());
    const listToSort = keyword? inventory.filter(b=>normalizeString(b.title).includes(keyword)||normalizeString(b.author).includes(keyword)) : inventory;
    renderBooks([...listToSort].sort((a,b)=>a.title.toLowerCase()>b.title.toLowerCase()?1:-1));
    animateBaykus();
}

function sortByQuantity(){
    const keyword = normalizeString(searchInput.value.trim());
    const listToSort = keyword? inventory.filter(b=>normalizeString(b.title).includes(keyword)||normalizeString(b.author).includes(keyword)) : inventory;
    renderBooks([...listToSort].sort((a,b)=>b.quantity-a.quantity));
    animateBaykus();
}

searchInput.addEventListener('input', ()=>{
    const keyword = normalizeString(searchInput.value.trim());
    if(!keyword) bookList.innerHTML='';
    else renderBooks(inventory.filter(b=>normalizeString(b.title).includes(keyword)||normalizeString(b.author).includes(keyword)));
});

homeBtn.addEventListener('click', ()=>{
    searchInput.value='';
    bookList.innerHTML='';
    animateBaykus();
});

function animateBaykus(){
    baykus.style.transition='transform 0.15s';
    baykus.style.transform='rotate(-20deg)';
    setTimeout(()=>{baykus.style.transform='rotate(20deg)'},150);
    setTimeout(()=>{baykus.style.transform='rotate(0deg)'},300);
    owlSound.currentTime=0;
    owlSound.play();
}

// Jungle sesi başlat
window.addEventListener('load', ()=>{
    setTimeout(()=>{
        jungleSound.volume = 0.3;
        jungleSound.play();
    },500);
});

// Tüm butonlara ve baykuş ikonuna tıklanınca ses ve animasyon
document.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{ animateBaykus(); });
});
baykus.addEventListener('click', ()=>{ animateBaykus(); });

// Butonları bağla
document.getElementById('addBtn').addEventListener('click', addBook);
document.getElementById('sortTitleBtn').addEventListener('click', sortByTitle);
document.getElementById('sortQuantityBtn').addEventListener('click', sortByQuantity);
