const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const port = 5000;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
app.use('/uploads', express.static('uploads'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 1. Pastikan folder 'uploads' ada di dalam folder backend lu
const uploadDir = path.join(__dirname, 'uploads'); 
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 2. Setting storage Multer agar simpan di folder 'uploads' tsb
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Simpan di folder uploads milik backend
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  }
});

const upload = multer({ storage: storage });

app.use('/foto-alat', express.static('../ui-peminjaman/public/foto-alat'));
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'kafka_tools' 
});

db.connect((err) => {
    if (err) return console.error('Database mampet!', err);
    console.log('Database kafka_tools berjalan lancar kap.');
});

// FIXED: Kolom 'aktivitas' diganti 'pesan' biar sesuai sama database lu
const tulisLog = (id_user, pesan) => {
    db.query('INSERT INTO log_aktifitas (id_user, pesan, waktu) VALUES (?, ?, NOW())', [id_user, pesan]);
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) return res.status(500).json({ status: 'error', message: 'DB Error' });
        if (result.length > 0) {
            const user = result[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                tulisLog(user.id_user, `User ${username} berhasil login`);
                res.status(200).json({ status: 'success', message: 'Login Berhasil!', data: user });
            } else res.status(401).json({ status: 'gagal', message: 'Password salah bos!' });
        } else res.status(401).json({ status: 'gagal', message: 'Username tidak terdaftar!' });
    });
});

// FIXED: Dihapus kolom 'email' dari SELECT karena di database nggak ada
app.get('/api/users', (req, res) => {
    db.query('SELECT id_user, nama_lengkap, username, level, kelas, no_telp FROM users', (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal tarik user' });
        res.json({ status: 'success', data: result });
    });
});

// FIXED: Dihapus 'email' dari proses INSERT
app.post('/api/users', async (req, res) => {
    const { nama_lengkap, username, password, level, kelas, no_telp, id_admin } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const sql = 'INSERT INTO users (nama_lengkap, username, password, level, kelas, no_telp) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [nama_lengkap, username, hashedPassword, level, kelas, no_telp], (err) => {
            if (err) return res.status(500).json({ message: 'Gagal tambah user' });
            if(id_admin) tulisLog(id_admin, `Menambahkan user baru: ${username}`);
            res.json({ status: 'success', message: 'User Berhasil Dibuat!' });
        });
    } catch (e) { res.status(500).json({ message: "Error hashing" }); }
});

// FIXED: Dihapus 'email' dari proses UPDATE
app.put('/api/users/:id', async (req, res) => {
    const { nama_lengkap, username, password, level, kelas, no_telp, id_admin } = req.body;
    let sql = 'UPDATE users SET nama_lengkap = ?, username = ?, level = ?, kelas = ?, no_telp = ? WHERE id_user = ?';
    let params = [nama_lengkap, username, level, kelas, no_telp, req.params.id];
    
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        sql = 'UPDATE users SET nama_lengkap = ?, username = ?, password = ?, level = ?, kelas = ?, no_telp = ? WHERE id_user = ?';
        params = [nama_lengkap, username, hashedPassword, level, kelas, no_telp, req.params.id];
    }
    
    db.query(sql, params, (err) => {
        if (err) return res.status(500).json({ message: 'Gagal update user' });
        if(id_admin) tulisLog(id_admin, `Update data user id: ${req.params.id}`);
        res.json({ status: 'success', message: 'User Berhasil Diupdate!' });
    });
});

app.delete('/api/users/:id', (req, res) => {
    const { id_admin } = req.body; 
    db.query('DELETE FROM users WHERE id_user = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal hapus user' });
        if(id_admin) tulisLog(id_admin, `Menghapus user id: ${req.params.id}`);
        res.json({ status: 'success', message: 'Akun Berhasil Dibuang!' });
    });
});

app.get('/api/alat', (req, res) => {
    const sql = `SELECT a.*, k.nama_kategori FROM alat a LEFT JOIN kategori k ON a.id_kategori = k.id_kategori`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ status: 'error', data: [] });
        res.status(200).json({ status: 'success', data: results });
    });
});

// FIXED: Penambahan const sql biar db.query ga nyari variabel kosong
app.post('/api/alat', upload.single('foto'), (req, res) => {
    const { kode_alat, nama_alat, jumlah, id_kategori, kondisi, deskripsi, id_admin } = req.body;
    const gambar = req.file ? req.file.filename : null; 

    // Query SQL ditaruh di sini supaya bisa dibaca oleh db.query
    const sql = "INSERT INTO alat (kode_alat, nama_alat, stok, id_kategori, status_alat, deskripsi, gambar) VALUES (?, ?, ?, ?, ?, ?, ?)";
   
    db.query(sql, [kode_alat, nama_alat, jumlah, id_kategori, kondisi || 'baik', deskripsi, gambar], (err) => {
        if (err) {
            console.error("Error MySQL:", err); 
            return res.status(500).json({ message: 'Gagal simpan alat' });
        }
        if(id_admin) tulisLog(id_admin, `Menambah alat baru: ${nama_alat}`);
        res.json({ status: 'success', message: 'Alat & Foto Berhasil Ditambah!' });
    });
});

app.put('/api/alat/:id', (req, res) => {
    const { kode_alat, nama_alat, jumlah, id_kategori, kondisi, deskripsi, id_admin } = req.body;
    const sql = 'UPDATE alat SET kode_alat = ?, nama_alat = ?, stok = ?, id_kategori = ?, status_alat = ?, deskripsi = ? WHERE id_alat = ?';
    db.query(sql, [kode_alat, nama_alat, jumlah, id_kategori, kondisi, deskripsi, req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal update alat' });
        if(id_admin) tulisLog(id_admin, `Update data alat id: ${req.params.id}`);
        res.json({ status: 'success', message: 'Alat Berhasil Diupdate!' });
    });
});

app.delete('/api/alat/:id', (req, res) => {
    const { id_admin } = req.body;
    db.query('DELETE FROM alat WHERE id_alat = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal hapus alat' });
        if(id_admin) tulisLog(id_admin, `Hapus data alat id: ${req.params.id}`);
        res.json({ status: 'success', message: 'Alat dimusnahkan!' });
    });
});

app.get('/api/kategori', (req, res) => {
    db.query('SELECT * FROM kategori', (err, result) => res.json({ status: 'success', data: result }));
});

app.post('/api/kategori', (req, res) => {
    const { nama_kategori, kode_kategori, deskripsi, id_admin } = req.body;
    db.query('INSERT INTO kategori (nama_kategori, kode_kategori, deskripsi_kategori) VALUES (?, ?, ?)', 
    [nama_kategori, kode_kategori, deskripsi], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal tambah kategori' });
        if(id_admin) tulisLog(id_admin, `Menambah kategori: ${nama_kategori}`);
        res.json({ status: 'success', message: 'Kategori Berhasil Ditambah!' });
    });
});

app.put('/api/kategori/:id', (req, res) => {
    const { nama_kategori, kode_kategori, deskripsi, id_admin } = req.body;
    db.query('UPDATE kategori SET nama_kategori = ?, kode_kategori = ?, deskripsi_kategori = ? WHERE id_kategori = ?', 
    [nama_kategori, kode_kategori, deskripsi, req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal update kategori' });
        if(id_admin) tulisLog(id_admin, `Update kategori id: ${req.params.id}`);
        res.json({ status: 'success', message: 'Kategori Berhasil Diupdate!' });
    });
});

app.delete('/api/kategori/:id', (req, res) => {
    const { id_admin } = req.body;
    db.query('DELETE FROM kategori WHERE id_kategori = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal hapus kategori' });
        if(id_admin) tulisLog(id_admin, `Hapus kategori id: ${req.params.id}`);
        res.json({ status: 'success', message: 'Kategori Dibuang!' });
    });
});

app.get('/api/transaksi/semua', (req, res) => {
    const sql = `
        SELECT p.*, u.username as peminjam, a.nama_alat 
        FROM peminjaman p 
        JOIN users u ON p.id_user = u.id_user 
        JOIN alat a ON p.id_alat = a.id_alat 
        ORDER BY p.id_peminjaman DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ status: 'error', data: [] });
        const formatted = result.map(r => ({
            ...r,
            kode_peminjaman: 'TRX-' + r.id_peminjaman,
            tanggal_peminjaman: r.tgl_pinjam,
            tanggal_kembali_rencana: r.tgl_rencana_kembali
        }));
        res.json({ status: 'success', data: formatted });
    });
});

app.post('/api/pinjam', (req, res) => {
    const { id_user, id_alat, tgl_rencana_kembali } = req.body; 

    const sql = 'INSERT INTO peminjaman (id_user, id_alat, tgl_pinjam, tgl_rencana_kembali, status) VALUES (?, ?, CURDATE(), ?, "pending")';
    db.query(sql, [id_user, id_alat, tgl_rencana_kembali], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal kirim, database menolak!' });
        tulisLog(id_user, `Mengajukan peminjaman alat ID: ${id_alat}`);
        res.json({ status: 'success', message: 'Pengajuan peminjaman berhasil dikirim!' });
    });
});


app.put('/api/transaksi/acc/:id', (req, res) => {
    const { id_petugas } = req.body;
    db.query('UPDATE peminjaman SET status = "dipinjam" WHERE id_peminjaman = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal ACC transaksi' });
        if(id_petugas) tulisLog(id_petugas, `ACC peminjaman id: ${req.params.id}`);
        res.json({ status: 'success', message: 'Peminjaman Disetujui!' });
    });
});

app.put('/api/pengembalian/:id', (req, res) => {
    const { id } = req.params;
    const { denda } = req.body;

    const sql = "UPDATE peminjaman SET denda = ? WHERE id_peminjaman = ?";
    
    db.query(sql, [denda, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Data denda pengembalian berhasil diupdate!" });
    });
});


app.delete('/api/transaksi/:id', (req, res) => {
    const { id } = req.params;
    const { id_admin } = req.body; // Pastikan kirim id_admin kalau perlu log

    const sql = "DELETE FROM peminjaman WHERE id_peminjaman = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Data berhasil dihapus" });
    });
});

app.post('/api/pengembalian', (req, res) => {
    console.log("Data diterima dari frontend:", req.body);
    const { id_peminjaman, denda, id_petugas, id_alat } = req.body;

    // Pastikan data penting ada
    if (!id_peminjaman || !id_alat) {
        return res.status(400).json({ status: 'gagal', message: "Data tidak lengkap! id_alat atau id_peminjaman kosong." });
    }

    // Mulai Transaksi Database
    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ status: 'error', message: "Gagal memulai transaksi" });

        // 1. Update status peminjaman jadi dikembalikan
        const sqlPinjam = 'UPDATE peminjaman SET status = "dikembalikan", denda = ?, tgl_kembali = CURDATE() WHERE id_peminjaman = ?';
        
        db.query(sqlPinjam, [denda || 0, id_peminjaman], (err) => {
            if (err) {
                console.error("Gagal update status pinjam:", err);
                return db.rollback(() => res.status(500).json({ status: 'error', message: 'Gagal update status' }));
            }

            // 2. Tambah stok alat kembali
            db.query('UPDATE alat SET stok = stok + 1 WHERE id_alat = ?', [id_alat], (err) => {
                if (err) {
                    console.error("Gagal tambah stok alat:", err);
                    return db.rollback(() => res.status(500).json({ status: 'error', message: 'Gagal update stok' }));
                }

                // 3. Simpan permanen (Commit)
                db.commit((err) => {
                    if (err) {
                        console.error("Gagal commit:", err);
                        return db.rollback(() => res.status(500).json({ status: 'error', message: "Gagal commit database" }));
                    }
                    
                    // Tulis log jika yang balikin petugas/admin
                    if(id_petugas) tulisLog(id_petugas, `Memproses pengembalian peminjaman id: ${id_peminjaman}`);
                    
                    // KASIH RESPON SEKALI AJA DI SINI
                    res.json({ status: 'success', message: 'Alat berhasil dikembalikan dan stok bertambah!' });
                });
            });
        });
    });
});
app.get('/api/pengembalian/semua', (req, res) => {
    const sql = `
        SELECT p.*, u.username as peminjam, a.nama_alat 
        FROM peminjaman p 
        JOIN users u ON p.id_user = u.id_user 
        JOIN alat a ON p.id_alat = a.id_alat 
        WHERE p.status = 'dikembalikan'
        ORDER BY p.id_peminjaman DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ status: 'error', data: [] });
        const formatted = result.map(r => ({
            ...r,
            kode_peminjaman: 'TRX-' + r.id_peminjaman,
            tanggal_pengembalian: r.tgl_kembali
        }));
        res.json({ status: 'success', data: formatted });
    });
});

app.get('/api/peminjaman/saya/:id_user', (req, res) => {
    const sql = `SELECT p.*, a.nama_alat FROM peminjaman p JOIN alat a ON p.id_alat = a.id_alat WHERE p.id_user = ? AND p.status != 'dikembalikan' ORDER BY p.id_peminjaman DESC`;
    db.query(sql, [req.params.id_user], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', data: [] });
        const formatted = results.map(r => ({
            ...r, 
            kode_peminjaman: r.nama_alat, 
            tanggal_kembali_rencana: r.tgl_rencana_kembali 
        }));
        res.json({ status: 'success', data: formatted });
    });
});

app.get('/api/log', (req, res) => {
    db.query('SELECT l.*, u.username FROM log_aktifitas l LEFT JOIN users u ON l.id_user = u.id_user ORDER BY l.waktu DESC', (err, result) => {
        if(err) return res.status(500).json({status: 'error'});
        res.json({ status: 'success', data: result })
    });
});

app.listen(port, () => console.log(`Server jalan di http://localhost:${port}`));