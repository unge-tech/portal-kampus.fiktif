// Simulasi Login
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = document.getElementById('roleSelect').value;
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', role === 'mahasiswa' ? 'Budi Santoso (NIM: 202301)' : role === 'dosen' ? 'Dr. Andi, M.Kom' : 'Administrator');
    window.location.href = 'dashboard.html';
});

// Load Dashboard
if (window.location.pathname.includes('dashboard.html')) {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    if (!role) {
        window.location.href = 'index.html';
    }
    document.getElementById('welcomeTextinnerText', `Selamat Datang, ${name} (${role.toUpperCase()})`);
    
    const contentArea = document.getElementById('contentArea');
    if (role === 'mahasiswa') {
        contentArea.innerHTML = `
            <div class="col-md-6">
                <div class="card p-3 shadow-sm">
                    <h4>Nilai Akademik (IDOR Vulnerable)</h4>
                    <p>ID Mahasiswa yang dilihat: <input type="number" id="mhsId" value="1" style="width: 50px;" onchange="loadNilai(this.value)"></p>
                    <div id="nilaiData" class="alert alert-info">Nilai Pemrograman Web: <strong>85 (A)</strong></div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card p-3 shadow-sm">
                    <h4>Unggah Tugas</h4>
                    <input type="file" class="form-control mb-2">
                    <button class="btn btn-primary btn-sm" onclick="alert('Tugas diunggah!')">Upload</button>
                </div>
            </div>`;
    } else if (role === 'dosen') {
        contentArea.innerHTML = `<div class="col-12"><div class="card p-3"><h4>Panel Dosen: Beri Nilai Mahasiswa</h4><p>Daftar tugas masuk mahasiswa tersedia untuk dinilai.</p></div></div>`;
    } else {
        contentArea.innerHTML = `<div class="col-12"><div class="card p-3"><h4>Panel Admin: Kelola Akun Pengguna</h4><p>Tambah/Hapus akun sivitas akademika fiktif.</p></div></div>`;
    }

    loadComments();
}

// Kerentanan 1: Stored XSS pada Forum Diskusi
function postComment() {
    const input = document.getElementById('chatInput').value;
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push(input);
    localStorage.setItem('comments', JSON.stringify(comments));
    document.getElementById('chatInput').value = '';
    loadComments();
}

function loadComments() {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    chatContainer.innerHTML = '';
    comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'border-bottom py-1';
        // SENGAJA MENGGUNAKAN innerHTML UNTUK MEMICU STORED XSS
        div.innerHTML = `<strong>Pengguna:</strong> ${c}`;
        chatContainer.appendChild(div);
    });
}

// Kerentanan 2: IDOR Simulation (Kontrol Akses Lemah pada Data Nilai)
function loadNilai(id) {
    const dataNilai = document.getElementById('nilaiData');
    // Siapa saja bisa mengganti ID di input untuk melihat data fiktif mahasiswa lain tanpa validasi token/session server
    if (id == 1) {
        dataNilai.innerHTML = `Mahasiswa ID 1 (Budi): Pemrograman Web - <strong>85 (A)</strong>`;
    } else if (id == 2) {
        dataNilai.innerHTML = `Mahasiswa ID 2 (Siti): Pemrograman Web - <strong>90 (A)</strong>`;
    } else {
        dataNilai.innerHTML = `Mahasiswa ID ${id} (Rahasia): Basis Data - <strong>75 (B)</strong>`;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}