import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

const style = `
  #root { max-width: 100% !important; margin: 0 !important; padding: 0 !important; text-align: left !important; width: 100vw; height: 100vh; }
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
  body { background: #f1f5f9; color: #334155; overflow: hidden; }
  
  .login-wrapper { background: linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('zzz3.jpg.jpg') center/cover no-repeat; height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; position: fixed; }
  .login-card { background: rgba(255, 255, 255, 0.95); padding: 40px; border-radius: 20px; width: 100%; max-width: 400px; text-align: center; position: relative; z-index: 10; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }
  .login-card h2 { color: #0f172a; font-weight: 800; font-size: 28px; letter-spacing: 2px; margin-bottom: 25px; }
  .input-gaya { width: 100%; padding: 14px; border: 2px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; outline: none; transition: 0.3s; font-size: 14px; background: #f8fafc; color: #334155; }
  .input-gaya:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
  
  .layout-pro { display: flex; height: 100vh; width: 100vw; overflow: hidden; }
  .sidebar { width: 260px; background: #0f172a; color: white; display: flex; flex-direction: column; padding: 25px 20px; flex-shrink: 0; box-shadow: 5px 0 15px rgba(0,0,0,0.1); }
  .menu-item { padding: 12px 15px; margin-bottom: 8px; border-radius: 8px; cursor: pointer; color: #94a3b8; transition: 0.2s; font-size: 14px; font-weight: 500; }
  .menu-item:hover, .menu-item.active { background: #3b82f6; color: white; }
  
  .main-content { flex: 1; padding: 35px; overflow-y: auto; background: #f8fafc; min-width: 0; }
  .panel { background: white; padding: 25px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; overflow-x: auto; }
  
  table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 400px; }
  th, td { padding: 15px; text-align: left; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
  th { background: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border-radius: 4px; }
  
  .btn { padding: 10px 18px; border-radius: 8px; border: none; color: white; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; }
  .btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-blue { background: #3b82f6; } .btn-green { background: #10b981; } .btn-red { background: #ef4444; } .btn-orange { background: #f59e0b; }
  
  .input-sm { padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 14px; width: 100%; margin-bottom: 15px; background: #fff; color: #334155 !important; }
  .input-sm:focus { border-color: #3b82f6; }

  .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.75); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px); }
  .modal-content { background: white; padding: 40px; border-radius: 24px; width: 100%; max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); max-height: 90vh; overflow-y: auto; }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.9) translateY(-20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

  .detail-grid { display: flex; gap: 20px; align-items: start; }
  .detail-foto { width: 200px; height: 200px; object-fit: cover; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; }
  .detail-info { flex: 1; }
  .detail-info h4 { font-size: 20px; color: #0f172a; margin-bottom: 5px; }
  .detail-info p { font-size: 14px; color: #64748b; line-height: 1.6; }
  .label-tag { background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-block; margin-bottom: 10px; }

  @media print { .sidebar, .no-print { display: none !important; } .main-content { padding: 0; } .panel { box-shadow: none; border: 1px solid #ddd; } }
`;

function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user_kafka')));
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const [data, setData] = useState({ alat: [], users: [], kategori: [], transaksi: [], pengembalian: [], saya: [], log: [] });
  
  const [editKat, setEditKat] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editAlat, setEditAlat] = useState(null);
  const [editPinjam, setEditPinjam] = useState(null);
  const [viewDetail, setViewDetail] = useState(null); 
  const [detailModal, setDetailModal] = useState(null); 
  const [searchUser, setSearchUser] = useState('');
const [searchKembali, setSearchKembali] = useState('');
const [searchLog, setSearchLog] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPinjam, setSearchPinjam] = useState('');
  const [filterKat, setFilterKat] = useState('');
  const [selectedAlat, setSelectedAlat] = useState(null);
  const [tglPinjamReq, setTglPinjamReq] = useState('');
  const [searchKategori, setSearchKategori] = useState('');

  const role = (user?.level || 'peminjam').toLowerCase();

  const refreshData = async () => {
    const fetchApi = async (url) => { 
      try { const r = await fetch(url); const d = await r.json(); return d.data || []; } catch (e) { return []; } 
    };
    
  
    const [alat, kat, users, trans, kembali, saya, log] = await Promise.all([
      fetchApi('http://localhost:5000/api/alat'),
      fetchApi('http://localhost:5000/api/kategori'),
      role === 'admin' ? fetchApi('http://localhost:5000/api/users') : Promise.resolve([]),
      (role === 'admin' || role === 'petugas') ? fetchApi('http://localhost:5000/api/transaksi/semua') : Promise.resolve([]),
      (role === 'admin' || role === 'petugas') ? fetchApi('http://localhost:5000/api/pengembalian/semua') : Promise.resolve([]),
      role === 'peminjam' ? fetchApi(`http://localhost:5000/api/peminjaman/saya/${user?.id_user}`) : Promise.resolve([]),
      role === 'admin' ? fetchApi('http://localhost:5000/api/log') : Promise.resolve([])
    ]);
    setData({ alat, kategori: kat, users, transaksi: trans, pengembalian: kembali, saya, log });
  };

  const handleKembalikan = async (id_peminjaman, id_alat) => {
    const confirm = window.confirm("Yakin mau balikin alat ini sekarang?");
    if (!confirm) return;

    try {
    
const r = await fetch('http://localhost:5000/api/pengembalian', {
    method: 'POST', // <-- Pastikan ini POST, bukan PUT
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        id_peminjaman: id_peminjaman, 
        denda: 0,
        id_alat: id_alat,
        id_petugas: user.id_user 
    })
});
      
      const res = await r.json();
      if (r.ok) {
          alert(res.message);
          refreshData(); 
      } else {
          alert("Gagal: " + res.message);
      }
    } catch (e) {
      alert("Server backend lagi ngambek bos!");
      console.error(e);
    }
  };

  useEffect(() => { 
    if(!user) return navigate('/'); 
    refreshData(); 
  }, [activeMenu]);

  const apiAction = async (url, method, body, callback = null) => {
    try {
      const options = { method, headers: { 'Content-Type': 'application/json' } };
      if (body && method !== 'DELETE') options.body = JSON.stringify(body);
      const r = await fetch(url, options);
      const res = await r.json(); 
      alert(res.message); 
      refreshData();
      if(callback) callback(); 
    } catch (e) { alert("Server backend mati Bos!"); }
  };

  const filteredAlat = data.alat.filter(a => {
      const matchName = (a.nama_alat || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchKat = filterKat === '' || (a.id_kategori && a.id_kategori.toString() === filterKat);
      return matchName && matchKat;
  });

  const monthlyStats = data.transaksi.reduce((acc, curr) => {
      if(!curr.tanggal_peminjaman) return acc;
      const date = new Date(curr.tanggal_peminjaman);
      const monthName = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
      acc[monthName] = (acc[monthName] || 0) + 1;
      return acc;
  }, {});

  const chartData = Object.entries(monthlyStats).map(([month, count]) => ({
      name: month.split(' ')[0], 
      jumlah: count
  })).reverse(); 

  const simpanAlat = async () => {
    // 1. Persiapkan data agar sesuai dengan nama kolom di database (stok & status_alat)
    const formData = new FormData();
    formData.append('kode_alat', editAlat.kode_alat || `ALT-${Date.now()}`);
    formData.append('nama_alat', editAlat.nama_alat);
    formData.append('stok', editAlat.stok || editAlat.jumlah || 0); // Ubah dari 'jumlah' ke 'stok'
    formData.append('id_kategori', editAlat.id_kategori);
    formData.append('status_alat', editAlat.status_alat || editAlat.kondisi || 'baik'); // Ubah dari 'kondisi' ke 'status_alat'
    formData.append('deskripsi', editAlat.deskripsi || '');
    formData.append('id_admin', user.id_user);
    
    // Pastikan fotoFile ada isinya sebelum di-append
    if (editAlat.fotoFile) {
        formData.append('foto', editAlat.fotoFile);
    }

    try {
        const r = await fetch('http://localhost:5000/api/alat', { 
            method: 'POST', 
            body: formData 
        });
        
        const res = await r.json();
        
        if (r.ok) {
            alert(res.message);
            refreshData();
            setEditAlat(null);
        } else {
            // Tampilkan error dari server jika status bukan 200
            alert("Gagal simpan: " + (res.message || "Kesalahan server"));
        }
    } catch(e) { 
        alert("Error: Pastikan backend berjalan dan database terkoneksi.");
        console.error(e);
    }
};

  return (
    <div className="layout-pro">
      <style>{style}</style>
      <div className="sidebar no-print">
        <div style={{textAlign:'center', marginBottom:'30px', borderBottom:'1px solid #1e293b', paddingBottom:'20px'}}>
          <h2 style={{color:'#38bdf8', letterSpacing:'1px', marginBottom:'5px'}}>KAFKA TOOLS</h2>
          <span style={{fontSize:'10px', background:'#3b82f6', color:'white', padding:'3px 10px', borderRadius:'10px', textTransform:'uppercase', fontWeight:'bold'}}>{role}</span>
        </div>
        <div className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`} onClick={()=>setActiveMenu('dashboard')}>🏠 Dashboard</div>
        
        {role === 'admin' && (
          <>
            <div className={`menu-item ${activeMenu === 'user' ? 'active' : ''}`} onClick={()=>setActiveMenu('user')}>👥 Kelola User</div>
            <div className={`menu-item ${activeMenu === 'alat' ? 'active' : ''}`} onClick={()=>setActiveMenu('alat')}>🛠️ Kelola Alat</div>
            <div className={`menu-item ${activeMenu === 'kategori' ? 'active' : ''}`} onClick={()=>setActiveMenu('kategori')}>📂 Kategori Alat</div>
          </>
        )}
        
        {(role === 'admin' || role === 'petugas') && (
          <>
            <div className={`menu-item ${activeMenu === 'pinjam_admin' ? 'active' : ''}`} onClick={()=>setActiveMenu('pinjam_admin')}>📊 Data Peminjaman</div>
            <div className={`menu-item ${activeMenu === 'kembali_admin' ? 'active' : ''}`} onClick={()=>setActiveMenu('kembali_admin')}>🔄 Data Pengembalian</div>
          </>
        )}
        
        {role === 'peminjam' && (
          <div className={`menu-item ${activeMenu === 'pinjam' ? 'active' : ''}`} onClick={()=>setActiveMenu('pinjam')}>📦 Pinjam Alat</div>
        )}

        {role === 'admin' && (
           <div className={`menu-item ${activeMenu === 'log' ? 'active' : ''}`} onClick={()=>setActiveMenu('log')}>📝 Log Aktifitas</div>
        )}
        
        <div style={{flex:1}}></div>
        <button className="btn btn-red" onClick={()=>{localStorage.clear(); navigate('/')}}>🚪 LOGOUT</button>
      </div>

      <div className="main-content">
        <h2 style={{ marginBottom: '25px', color: '#000000' }}>Halo {user?.username}! 👋</h2>
        

        
        
        {/* --- DASHBOARD & STATISTIK --- */}
        {activeMenu === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div className="panel" style={{ borderLeft: '6px solid #3b82f6', marginBottom: 0, padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>Total Pengguna</p>
                <h2 style={{ fontSize: '32px', color: '#000000' }}>{data.users.length}</h2>
              </div>
              <div className="panel" style={{ borderLeft: '6px solid #8b5cf6', marginBottom: 0, padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>Total Alat</p>
                <h2 style={{ fontSize: '32px', color: '#000000' }}>{data.alat.length}</h2>
              </div>
              <div className="panel" style={{ borderLeft: '6px solid #f59e0b', marginBottom: 0, padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>Pending Approval</p>
                <h2 style={{ fontSize: '32px', color: '#000000' }}>{role === 'peminjam' ? data.saya.filter(t => t.status === 'pending').length : data.transaksi.filter(t => t.status === 'pending').length}</h2>
              </div>
              <div className="panel" style={{ borderLeft: '6px solid #10b981', marginBottom: 0, padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>Peminjaman Aktif</p>
                <h2 style={{ fontSize: '32px', color: '#000000' }}>{role === 'peminjam' ? data.saya.filter(t => t.status === 'dipinjam').length : data.transaksi.filter(t => t.status === 'dipinjam').length}</h2>
              </div>
            </div>

            {(role === 'admin' || role === 'petugas') && (
              <div className="panel" style={{ padding: '30px' }}>
                <h4 style={{ marginBottom: '25px' }}>📈 Grafik Peminjaman Alat (Bulanan)</h4>
                <div style={{ width: '100%', height: 250 }}> 
                  {chartData.length > 0 ? (
                    <ResponsiveContainer>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="jumlah" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p style={{fontSize:'14px', color:'#64748b', textAlign: 'center', marginTop: '100px'}}>Belum ada data transaksi peminjaman untuk ditampilkan grafiknya.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* --- KELOLA ALAT --- */}

        
        {activeMenu === 'alat' && role === 'admin' && (
          <div className="panel">
            {!editAlat ? (
              <>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <h4>🛠️ Inventaris Alat</h4>
                  <button className="btn btn-blue" onClick={() => setEditAlat({isNew: true})}>➕ Tambah Alat</button>
                </div>
                
                <div style={{display:'flex', gap:'15px', marginBottom:'20px'}}>
                    <input className="input-sm" placeholder="🔍 Cari nama alat..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} style={{flex:2}} />
                    <select className="input-sm" value={filterKat} onChange={(e)=>setFilterKat(e.target.value)} style={{flex:1}}>
                        <option value="">📂 Semua Kategori</option>
                        {data.kategori.map(k => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
                    </select>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>KODE</th>
                      <th>NAMA ALAT</th>
                      <th>KATEGORI</th>
                      <th>JUMLAH</th>
                      <th>KONDISI</th>
                      <th>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlat.map((a, i) => (
                      <tr key={a.id_alat}>
                        <td>{i + 1}</td>
                        <td><b>{a.kode_alat || '-'}</b></td>
                        <td><b>{a.nama_alat}</b></td>
                        <td><span className="label-tag">{a.nama_kategori}</span></td>
                        <td>{a.stok || a.jumlah || 0} unit</td>
                        <td>
                          <span style={{color: (a.status_alat === 'rusak' || a.kondisi === 'rusak') ? '#ef4444' : '#10b981', fontWeight:'bold', fontSize:'12px'}}>
                            {(a.status_alat || a.kondisi || 'BAIK').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-blue" onClick={() => setViewDetail(a)} style={{marginRight:'5px'}} title="Detail Alat">👁️</button>
                          <button className="btn btn-orange" onClick={()=>setEditAlat(a)} style={{marginRight:'5px'}} title="Edit Alat">✏️</button> 
                          <button className="btn btn-red" onClick={()=>apiAction(`http://localhost:5000/api/alat/${a.id_alat}`,'DELETE', {id_admin: user.id_user})} title="Hapus Alat">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                  <h3 style={{marginBottom:'25px'}}>{editAlat.isNew ? '🚀 Tambah Alat Baru' : '✏️ Edit Data Alat'}</h3>
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Kode Alat (Opsional):</label>
                  <input className="input-sm" value={editAlat.kode_alat||''} onChange={(e)=>setEditAlat({...editAlat, kode_alat:e.target.value})} placeholder="Contoh: ALT-001" />

                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Nama Alat:</label>
                  <input className="input-sm" value={editAlat.nama_alat||''} onChange={(e)=>setEditAlat({...editAlat, nama_alat:e.target.value})} placeholder="Contoh: Kamera Canon" />
                  
                  <div style={{display:'flex', gap:'15px'}}>
                    <div style={{flex:1}}>
                      <label style={{fontSize:'12px', fontWeight:'bold'}}>Jumlah Stok:</label>
                      <input className="input-sm" type="number" value={editAlat.stok || editAlat.jumlah || ''} onChange={(e)=>setEditAlat({...editAlat, jumlah:e.target.value})} placeholder="Angka" />
                    </div>
                    <div style={{flex:1}}>
                      <label style={{fontSize:'12px', fontWeight:'bold'}}>Kondisi Alat:</label>
                      <select className="input-sm" value={editAlat.status_alat || editAlat.kondisi || 'baik'} onChange={(e)=>setEditAlat({...editAlat, kondisi:e.target.value})}>
                          <option value="baik">✅ Baik</option>
                          <option value="rusak">❌ Rusak</option>
                      </select>
                    </div>
                  </div>

                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Kategori:</label>
                  <select className="input-sm" value={editAlat.id_kategori||''} onChange={(e)=>setEditAlat({...editAlat, id_kategori:e.target.value})}>
                      <option value="">-- Pilih Kategori --</option>
                      {data.kategori.map(k => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
                  </select>

                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Deskripsi Produk:</label>
                  <textarea className="input-sm" style={{height:'80px', resize:'none'}} value={editAlat.deskripsi || ''} onChange={(e)=>setEditAlat({...editAlat, deskripsi:e.target.value})} placeholder="Masukkan deskripsi alat..." />

                  {editAlat.isNew && (
                    <>
                      <label style={{fontSize:'12px', fontWeight:'bold'}}>Upload Foto Alat (File Manager):</label>
                      <input type="file" accept="image/*" className="input-sm" onChange={(e) => setEditAlat({...editAlat, fotoFile: e.target.files[0]})} />
                    </>
                  )}

                  <div style={{display:'flex', gap:'15px', marginTop:'20px'}}>
                      <button className="btn btn-green" style={{flex:1, padding:'15px'}} onClick={simpanAlat}>Simpan</button>
                      <button className="btn btn-red" style={{flex:1}} onClick={()=>setEditAlat(null)}>Batal / Kembali</button>
                  </div>
              </div>
            )}
          </div>
        )}

        {/* --- KELOLA USER --- */}
        {activeMenu === 'user' && role === 'admin' && (
          <div className="panel">
            {!editUser ? (
              <>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <h4>👥 Kelola Pengguna</h4>
                  <button className="btn btn-blue" onClick={() => setEditUser({isNew:true})}>➕ Tambah User</button>
                </div>
                
                <input className="input-sm" style={{marginBottom:'20px'}} placeholder="🔍 Cari nama lengkap atau username..." value={searchUser} onChange={(e)=>setSearchUser(e.target.value)} />
                
                <table>
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>NAMA LENGKAP</th>
                      <th>USERNAME</th>
                      <th>NO TELP</th>
                      <th>KELAS</th>
                      <th>LEVEL</th>
                      <th>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users
                      .filter(u => 
                        (u.username || '').toLowerCase().includes(searchUser.toLowerCase()) || 
                        (u.nama_lengkap || '').toLowerCase().includes(searchUser.toLowerCase())
                      )
                      .map((u, i) => (
                      <tr key={u.id_user}>
                        <td>{i + 1}</td>
                        <td>{u.nama_lengkap || '-'}</td>
                        <td><b>{u.username}</b></td>
                        <td>{u.no_telp || '-'}</td>
                        <td>{u.kelas || '-'}</td>
                        <td style={{ textTransform: 'capitalize' }}>{u.level}</td>
                        <td>
                          <button className="btn btn-blue" onClick={() => setDetailModal({type: 'user', data: u})} style={{ marginRight: '5px' }} title="Detail User">👁️</button>
                          <button className="btn btn-orange" onClick={() => setEditUser(u)} style={{ marginRight: '5px' }} title="Edit User">✏️</button>
                          <button className="btn btn-red" onClick={() => apiAction(`http://localhost:5000/api/users/${u.id_user}`, 'DELETE', {id_admin: user.id_user})} title="Hapus User">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                  <h3 style={{marginBottom:'25px'}}>{editUser.isNew ? '👥 Tambah User' : '✏️ Edit Profile'}</h3>

                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Nama Lengkap:</label>
                  <input className="input-sm" value={editUser.nama_lengkap||''} onChange={(e)=>setEditUser({...editUser, nama_lengkap:e.target.value})} placeholder="Nama Lengkap Asli" />
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Username:</label>
                  <input className="input-sm" value={editUser.username||''} onChange={(e)=>setEditUser({...editUser, username:e.target.value})} placeholder="Username" />
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Password:</label>
                  <input className="input-sm" type="password" value={editUser.password||''} onChange={(e)=>setEditUser({...editUser, password:e.target.value})} placeholder="Password" />
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Kelas:</label>
                  <input className="input-sm" value={editUser.kelas || ''} onChange={(e)=>setEditUser({...editUser, kelas:e.target.value})} placeholder="Contoh: XI PPLG 1" />
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>No Telepon:</label>
                  <input className="input-sm" value={editUser.no_telp || ''} onChange={(e)=>setEditUser({...editUser, no_telp:e.target.value})} placeholder="08..." />
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Email (Opsional):</label>
                  <input className="input-sm" value={editUser.email || ''} onChange={(e)=>setEditUser({...editUser, email:e.target.value})} placeholder="nama@email.com" />
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Level:</label>
                  <select className="input-sm" value={editUser.level||'peminjam'} onChange={(e)=>setEditUser({...editUser, level:e.target.value})}>
                      <option value="peminjam">Peminjam</option>
                      <option value="petugas">Petugas</option>
                      {!editUser.isNew && editUser.level === 'admin' && <option value="admin">Admin</option>}
                  </select>

                  <div style={{display:'flex', gap:'15px', marginTop:'20px'}}>
                      <button className="btn btn-green" style={{flex:1, padding:'15px'}} onClick={()=>{
                          const b = {nama_lengkap: editUser.nama_lengkap, username:editUser.username, password:editUser.password, level:editUser.level, kelas: editUser.kelas, no_telp: editUser.no_telp, email: editUser.email, id_admin: user.id_user};
                          if(editUser.isNew) apiAction('http://localhost:5000/api/users','POST',b, ()=>setEditUser(null));
                          else apiAction(`http://localhost:5000/api/users/${editUser.id_user}`,'PUT',b, ()=>setEditUser(null));
                      }}>Simpan</button>
                      <button className="btn btn-red" style={{flex:1}} onClick={()=>setEditUser(null)}>Batal / Kembali</button>
                  </div>
              </div>
            )}
          </div>
        )}

        {/* --- KATEGORI ALAT --- */}
        {activeMenu === 'kategori' && role === 'admin' && (
          <div className="panel">
            {!editKat ? (
              <>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <h4>📂 Kategori Alat</h4>
                  <button className="btn btn-blue" onClick={() => setEditKat({isNew: true})}>➕ Tambah Kategori</button>
                </div>
                <input 
      className="input-sm" 
      style={{marginBottom:'20px', width: '100%'}} 
      placeholder="🔍 Cari nama kategori..." 
      value={searchKategori} // Pastikan state ini sudah lu buat
      onChange={(e) => setSearchKategori(e.target.value)} 
    />
                <table>
                    <thead>
                      <tr><th>NO</th><th>KODE KATEGORI</th><th>NAMA KATEGORI</th><th>DESKRIPSI</th><th>AKSI</th></tr>
                    </thead>
                  <tbody>
  {data.kategori
    // TAMBAHKAN FILTER INI SEBELUM .map()
    .filter(k => (k.nama_kategori || '').toLowerCase().includes(searchKategori.toLowerCase()))
    .map((k, i) => (
      <tr key={k.id_kategori}>
        <td>{i+1}</td>
        <td><span style={{background:'#e2e8f0', padding:'4px 8px', borderRadius:'6px', fontWeight:'bold', fontSize:'12px'}}>{k.kode_kategori || '-'}</span></td>
        <td><b>{k.nama_kategori}</b></td>
        <td><small style={{color:'#64748b'}}>{k.deskripsi_kategori || k.deskripsi || '-'}</small></td>
        <td>
  {/* 👇 INI TOMBOL DETAIL YANG BARU DITAMBAH 👇 */}
  <button 
    className="btn btn-blue" 
    onClick={() => setDetailModal({type: 'kategori', data: k})} 
    style={{marginRight:'5px'}} 
    title="Detail Kategori"
  >
    👁️
  </button>

  <button className="btn btn-orange" onClick={()=>setEditKat(k)} style={{marginRight:'5px'}} title="Edit Kategori">✏️</button> 
  <button className="btn btn-red" onClick={()=>apiAction(`http://localhost:5000/api/kategori/${k.id_kategori}`,'DELETE', {id_admin: user.id_user})} title="Hapus Kategori">🗑️</button>
</td>
      </tr>
    ))
  }
</tbody>
                </table>
              </>
            ) : (
              <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                  <h3 style={{marginBottom:'25px'}}>{editKat.isNew ? '📂 Tambah Kategori' : '✏️ Edit Kategori'}</h3>
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Kode Kategori:</label>
                  <input className="input-sm" value={editKat.kode_kategori || ''} onChange={(e)=>setEditKat({...editKat, kode_kategori:e.target.value})} placeholder="#ELC" />
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Nama Kategori:</label>
                  <input className="input-sm" value={editKat.nama_kategori || ''} onChange={(e)=>setEditKat({...editKat, nama_kategori:e.target.value})} placeholder="Nama" />
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Deskripsi:</label>
                  <textarea className="input-sm" style={{height:'100px', resize:'none'}} value={editKat.deskripsi_kategori || editKat.deskripsi || ''} onChange={(e)=>setEditKat({...editKat, deskripsi:e.target.value})} placeholder="..." />
                  
                  <div style={{display:'flex', gap:'15px', marginTop:'20px'}}>
                      <button className="btn btn-green" style={{flex:1, padding:'15px'}} onClick={()=>{
                          const b = {nama_kategori:editKat.nama_kategori, kode_kategori: editKat.kode_kategori, deskripsi:editKat.deskripsi, id_admin: user.id_user};
                          if(editKat.isNew) apiAction('http://localhost:5000/api/kategori','POST', b, ()=>setEditKat(null));
                          else apiAction(`http://localhost:5000/api/kategori/${editKat.id_kategori}`,'PUT', b, ()=>setEditKat(null));
                      }}>Simpan</button>
                      <button className="btn btn-red" style={{flex:1}} onClick={()=>setEditKat(null)}>Batal / Kembali</button>
                  </div>
              </div>
            )}
          </div>
        )}

        {/* --- DATA PEMINJAMAN --- */}
        {activeMenu === 'pinjam_admin' && (
          <div className="panel">
            {!editPinjam ? (
              <>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <h4>📊 Data Peminjaman</h4>
                  {role === 'admin' && <button className="btn btn-blue" onClick={() => setEditPinjam({isNew: true})}>➕ Tambah Peminjaman</button>}
                </div>
                
                <input className="input-sm" style={{marginBottom:'20px'}} placeholder="🔍 Cari nama user..." value={searchPinjam} onChange={(e)=>setSearchPinjam(e.target.value)} />
                
                <table>
                  <thead>
                    <tr><th>NO</th><th>KODE TRX</th><th>USER</th><th>TGL PINJAM</th><th>TGL KEMBALI RENCANA</th><th>STATUS</th><th>AKSI</th></tr>
                  </thead>
                  <tbody>
                    {data.transaksi
                      .filter(t => t.status !== 'dikembalikan')
                      .filter(t => (t.peminjam||'').toLowerCase().includes(searchPinjam.toLowerCase()))
                      .map((t, i) => (
                      <tr key={t.id_peminjaman}>
                        <td>{i+1}</td>
                        <td><b>{t.kode_peminjaman}</b></td>
                        <td>{t.peminjam}</td>
                        <td>{new Date(t.tanggal_peminjaman).toLocaleDateString('id-ID')}</td>
                        <td><span style={{color: '#ef4444', fontWeight: 'bold'}}>{new Date(t.tanggal_kembali_rencana).toLocaleDateString('id-ID')}</span></td>
                        <td><span style={{background:t.status==='pending'?'#fef3c7':'#dcfce7', color:t.status==='pending'?'#d97706':'#10b981', padding:'4px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:'bold'}}>{t.status.toUpperCase()}</span></td>
                        <td>
                          <button className="btn btn-blue" onClick={() => setDetailModal({type: 'peminjaman', data: t})} style={{marginRight:'5px'}} title="Detail Transaksi">👁️</button>

                        
                          {t.status === 'pending' && (role === 'petugas' || role === 'admin') && 
                          
  <button 
    className="btn btn-green" 
    onClick={() => apiAction(`http://localhost:5000/api/transaksi/acc/${t.id_peminjaman}`, 'PUT', {id_petugas: user.id_user})} 
    style={{marginRight:'5px'}} 
    title="ACC Peminjaman"
  >
    ✅
  </button>
}
                          
                          {t.status === 'dipinjam' && (role === 'admin' || role === 'petugas') && 
  <button className="btn btn-orange" onClick={()=>{
    const d = window.prompt("Masukkan Denda (Rp). Ketik 0 jika tidak ada:", 0);
    if (d !== null) {
      // Panggil rute POST /api/pengembalian yang benar
      apiAction(`http://localhost:5000/api/pengembalian`, 'POST', {
          id_peminjaman: t.id_peminjaman,
          denda: d,
          id_alat: t.id_alat,       // <-- Ini penting buat nambah stok!
          id_petugas: user.id_user
      });
    }
  }} style={{marginRight:'5px'}} title="Proses Pengembalian">🔚</button>
}
{role === 'admin' && (
    <button 
      className="btn btn-red" 
      onClick={() => {
        if(window.confirm("Yakin mau hapus data transaksi ini?")) {
           apiAction(`http://localhost:5000/api/transaksi/${t.id_peminjaman}`, 'DELETE', {id_admin: user.id_user});
        }
      }} 
      title="Hapus Transaksi"
    >
      🗑️
    </button>
  )}
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                <h3 style={{marginBottom:'25px'}}>➕ Tambah Peminjaman Manual</h3>
                  <>
                    <label style={{fontSize:'12px', fontWeight:'bold'}}>Pilih User:</label>
                    <select className="input-sm" style={{marginBottom: '5px'}} value={editPinjam.id_user||''} onChange={(e)=>setEditPinjam({...editPinjam, id_user:e.target.value})}>
                        <option value="">-- Pilih User --</option>
                        {data.users.map(u => <option key={u.id_user} value={u.id_user}>{u.username} ({u.level})</option>)}
                    </select>

                    {editPinjam.id_user && (
                      <div style={{background:'#e0f2fe', borderLeft:'4px solid #0ea5e9', padding:'10px', marginTop:'5px', marginBottom:'15px', borderRadius:'0 8px 8px 0'}}>
                        {(() => {
                            const u = data.users.find(x => x.id_user.toString() === editPinjam.id_user.toString());
                            return u ? (
                                <div style={{fontSize:'12px', color:'#0369a1'}}>
                                    <p style={{marginBottom:'3px'}}><b>Nama Lengkap:</b> {u.nama_lengkap || '-'}</p>
                                    <p style={{marginBottom:'3px'}}><b>Username:</b> {u.username}</p>
                                    <p><b>Kelas:</b> {u.kelas || '-'}</p>
                                </div>
                            ) : null;
                        })()}
                      </div>
                    )}

                    <label style={{fontSize:'12px', fontWeight:'bold'}}>Pilih Alat:</label>
                    <select className="input-sm" value={editPinjam.id_alat||''} onChange={(e)=>setEditPinjam({...editPinjam, id_alat:e.target.value})}>
                        <option value="">-- Pilih Alat --</option>
                        {data.alat.map(a => <option key={a.id_alat} value={a.id_alat}>{a.nama_alat} (Sisa: {a.stok || a.jumlah})</option>)}
                    </select>

                    <label style={{fontSize:'12px', fontWeight:'bold'}}>Tgl Rencana Kembali:</label>
                    <input type="date" className="input-sm" value={editPinjam.tgl_rencana_kembali||''} onChange={(e)=>setEditPinjam({...editPinjam, tgl_rencana_kembali:e.target.value})} />
                  </>

                <div style={{display:'flex', gap:'15px', marginTop:'20px'}}>
                    <button className="btn btn-green" style={{flex:1, padding:'15px'}} onClick={()=>{
                        const b = {
                            id_user: editPinjam.id_user, 
                            tgl_rencana_kembali: editPinjam.tgl_rencana_kembali, 
                            id_alat: editPinjam.id_alat
                        };
                        apiAction('http://localhost:5000/api/pinjam','POST', b, ()=>setEditPinjam(null));
                    }}>Simpan Transaksi</button>
                    <button className="btn btn-red" style={{flex:1}} onClick={()=>setEditPinjam(null)}>Batal / Kembali</button>
                </div>
              </div>
            )}
          </div>
        )}

       {/* --- DATA PENGEMBALIAN --- */}
  {activeMenu === 'kembali_admin' && (role === 'admin' || role === 'petugas') && (
  <div className="panel">
    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
      <h4>🔄 Data Pengembalian</h4>
      <button className="btn btn-blue" onClick={()=>window.print()}>🖨️ Cetak</button>
    </div>

    {/* --- TAMBAHKAN INPUT SEARCH DI SINI --- */}
    <input 
      type="text" 
      placeholder="Cari user atau kode TRX..." 
      className="search-input"
      value={searchKembali} // Pastikan state searchKembali sudah dideklarasikan di useState
      onChange={(e) => setSearchKembali(e.target.value)}
      style={{width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc'}}
    />

    <table>
      <thead>
        <tr><th>NO</th><th>USER</th><th>TRX PEMINJAMAN</th><th>TGL DIKEMBALIKAN</th><th>DENDA</th><th>STATUS</th><th>AKSI</th></tr>
      </thead>
      <tbody>
        {/* --- TAMBAHKAN LOGIKA FILTER DI SINI --- */}
        {data.pengembalian
          .filter(t => 
            t.peminjam.toLowerCase().includes(searchKembali.toLowerCase()) || 
            t.kode_peminjaman.toLowerCase().includes(searchKembali.toLowerCase())
          )
          .map((t, i) => (
            <tr key={t.id_pengembalian || t.id_peminjaman}>
              <td>{i+1}</td>
              <td><b>{t.peminjam}</b></td>
              <td>{t.kode_peminjaman}</td>
              <td>{new Date(t.tanggal_pengembalian || t.tgl_kembali).toLocaleDateString('id-ID')}</td>
              <td style={{color: t.denda > 0 ? 'red' : 'inherit'}}>Rp {t.denda || 0}</td>
              <td><span style={{background:'#dcfce7', color:'#10b981', padding:'4px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:'bold'}}>DIKEMBALIKAN</span></td>
              <td>
                <button className="btn btn-blue" onClick={() => setDetailModal({type: 'pengembalian', data: t})} style={{marginRight:'5px'}} title="Detail">👁️</button>
                {role === 'admin' && (
                  <button className="btn btn-orange" style={{marginRight:'5px'}} title="Edit Denda" onClick={() => {
                    const newDenda = window.prompt("Revisi jumlah denda (Rp):", t.denda || 0);
                    if (newDenda !== null) { apiAction(`http://localhost:5000/api/pengembalian/${t.id_peminjaman || t.id_pengembalian}`, 'PUT', { denda: newDenda }); }
                  }}>✏️</button>
                )}
                {role === 'admin' && (
                  <button className="btn btn-red" title="Hapus Riwayat Permanen" onClick={() => {
                    if(window.confirm("Yakin mau hapus riwayat pengembalian ini secara permanen?")) {
                      apiAction(`http://localhost:5000/api/transaksi/${t.id_peminjaman || t.id_pengembalian}`, 'DELETE', {id_admin: user.id_user});
                    }
                  }}>🗑️</button>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)}
        {/* --- MENU PINJAM (KHUSUS PEMINJAM) --- */}
        {activeMenu === 'pinjam' && role === 'peminjam' && (
          <div className="panel">
            {!selectedAlat ? (
              <>
                <h4>📦 Ajukan Peminjaman</h4>
                
                <div style={{display:'flex', gap:'15px', margin:'20px 0'}}>
                    <input className="input-sm" placeholder="🔍 Cari alat..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} style={{flex:2}} />
                    <select className="input-sm" value={filterKat} onChange={(e)=>setFilterKat(e.target.value)} style={{flex:1}}>
                        <option value="">📂 Semua Kategori</option>
                        {data.kategori.map(k => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
                    </select>
                </div>

                <table>
                    <thead>
                      <tr><th>NO</th><th>NAMA ALAT</th><th>JUMLAH</th><th>KONDISI</th><th>AKSI</th></tr>
                    </thead>
                    <tbody>
                      {filteredAlat.map((a, i) => (
                          <tr key={a.id_alat}>
                          <td>{i+1}</td>
                          <td><b>{a.nama_alat}</b><br/><span className="label-tag">{a.nama_kategori}</span></td>
                          <td>{a.stok || a.jumlah > 0 ? `${a.stok || a.jumlah} unit` : "Habis"}</td>
                          <td><span style={{color: (a.status_alat === 'rusak' || a.kondisi === 'rusak') ? '#ef4444' : '#10b981', fontWeight:'bold', fontSize:'12px'}}>{(a.status_alat || a.kondisi || 'BAIK').toUpperCase()}</span></td>
                          <td>
                            <button className="btn btn-blue" onClick={() => setViewDetail(a)} style={{marginRight:'5px'}} title="Detail Alat">👁️</button>
                            <button className="btn btn-green" disabled={(a.stok || a.jumlah) <= 0 || a.kondisi === 'rusak' || a.status_alat === 'rusak'} onClick={() => setSelectedAlat(a)} title="Ajukan Pinjam">➕</button>
                          </td>
                          </tr>
                      ))}
                    </tbody>
                </table>

                <h4 style={{marginTop:'40px'}}>🎒 Riwayat Pinjaman Lu</h4>
                <table>
                  <thead>
  <tr>
    <th>NO</th>
    <th>ALAT</th>
    <th>TGL RENCANA KEMBALI</th>
    <th>STATUS</th>
    <th>AKSI</th> {/* <--- Tambahkan header kolom AKSI */}
  </tr>
</thead>
<tbody>
  {data.saya && data.saya.length > 0 ? (
    data.saya.map((s, i) => (
      <tr key={s.id_peminjaman}>
        <td>{i + 1}</td>
        <td><b>{s.kode_peminjaman}</b></td>
        <td>{s.tanggal_kembali_rencana ? new Date(s.tanggal_kembali_rencana).toLocaleDateString('id-ID') : '-'}</td>
        <td>
          <span style={{ color: s.status === 'pending' ? 'orange' : 'green', fontWeight: 'bold' }}>
            {s.status ? s.status.toUpperCase() : '-'}
          </span>
        </td>
        <td>
          {s.status === 'dipinjam' && (
            <button className="btn btn-green" onClick={() => handleKembalikan(s.id_peminjaman, s.id_alat)}>
              Kembalikan
            </button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>Belum ada riwayat peminjaman.</td>
    </tr>
  )}
</tbody>
                </table>
              </>
            ) : (
              <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                  <h4 style={{marginBottom:'10px'}}>✨ Pinjam Alat</h4>
                  <p style={{fontSize:'14px', marginBottom:'20px'}}>Mau pinjam <b>{selectedAlat.nama_alat}</b>. Kapan rencana balikin?</p>
                  
                  <input type="date" className="input-sm" style={{width:'100%'}} onChange={(e) => setTglPinjamReq(e.target.value)} />
                  
                  <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
                      <button className="btn btn-green" style={{flex:1}} disabled={!tglPinjamReq} onClick={() => {
                          const b = {
                            id_user: user.id_user, 
                            tgl_rencana_kembali: tglPinjamReq, 
                            id_alat: selectedAlat.id_alat
                          };
                          apiAction('http://localhost:5000/api/pinjam','POST', b, () => {setSelectedAlat(null); setTglPinjamReq('');})
                      }}>Kirim Pengajuan</button>
                      <button className="btn btn-red" onClick={() => setSelectedAlat(null)}>Batal / Kembali</button>
                  </div>
              </div>
            )}
          </div>
        )}

        {/* --- LOG AKTIFITAS --- */}
        {activeMenu === 'log' && role === 'admin' && (
    <div className="panel">
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
        <h4>📝 Log Aktifitas Sistem</h4>
        <button className="btn btn-blue" onClick={()=>window.print()}>🖨️ Cetak</button>
      </div>

      {/* INPUT PENCARIAN LOG */}
      <input 
        type="text" 
        placeholder="Cari user atau pesan aktivitas..." 
        className="search-input"
        value={searchLog}
        onChange={(e) => setSearchLog(e.target.value)}
        style={{width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc'}}
      />

      <table>
        <thead>
          <tr><th>NO</th><th>USER</th><th>PESAN AKTIVITAS</th><th>WAKTU</th></tr>
        </thead>
        <tbody>
          {data.log && data.log.length > 0 ? (
            data.log
              .filter(l => 
                (l.username || 'System').toLowerCase().includes(searchLog.toLowerCase()) || 
                (l.pesan || '').toLowerCase().includes(searchLog.toLowerCase())
              )
              .map((l, i) => (
                <tr key={l.id_log || i}>
                  <td>{i+1}</td>
                  <td><b>{l.username || 'System'}</b></td>
                  <td>{l.pesan}</td>
                  <td>{new Date(l.waktu).toLocaleString('id-ID')}</td>
                </tr>
              ))
          ) : (
            <tr><td colSpan="4" style={{textAlign:'center', color:'#94a3b8'}}>Belum ada log aktifitas.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )}
</div>
        

        {/* MODAL GLOBAL BUAT DETAIL USER / TRANSAKSI */}
        {viewDetail && (
            <div className="modal-overlay" onClick={()=>setViewDetail(null)}>
                <div className="modal-content" style={{maxWidth:'600px'}} onClick={e => e.stopPropagation()}>
                    <div className="detail-grid">
                        <img 
  src={`http://localhost:5000/uploads/${viewDetail.gambar}`} 
  className="detail-foto" 
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/200?text=No+Image';
  }} 
  alt="Foto Alat" 
/>
                        <div className="detail-info">
                            <span className="label-tag">{viewDetail.kode_alat || 'ALT'} - {viewDetail.nama_kategori}</span>
                            <h4>{viewDetail.nama_alat}</h4>
                            <p style={{marginBottom:'5px', color:'#0f172a', fontWeight:'600'}}>Tersedia: {viewDetail.stok || viewDetail.jumlah} Unit</p>
                            <p style={{marginBottom:'15px', color: (viewDetail.status_alat === 'rusak' || viewDetail.kondisi === 'rusak') ? '#ef4444' : '#10b981', fontWeight:'600'}}>
                              Status: {(viewDetail.status_alat || viewDetail.kondisi || 'BAIK').toUpperCase()}
                            </p>
                            <label style={{fontSize:'12px', fontWeight:'700', color:'#94a3b8'}}>DESKRIPSI PRODUK:</label>
                            <p>{viewDetail.deskripsi || "Tidak ada deskripsi tambahan untuk alat ini."}</p>
                            <button className="btn btn-red" style={{width:'100%', marginTop:'20px'}} onClick={()=>setViewDetail(null)}>Tutup Detail</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {detailModal && (
            <div className="modal-overlay" onClick={()=>setDetailModal(null)}>
                <div className="modal-content" style={{maxWidth:'500px'}} onClick={e => e.stopPropagation()}>
                    
                    {detailModal.type === 'user' && (
                        <div>
                          
                            <h3 style={{marginBottom:'20px', borderBottom:'2px solid #e2e8f0', paddingBottom:'10px'}}>👤 Detail Pengguna</h3>
                            <div style={{lineHeight: '2'}}>
                              <p><b>Nama Lengkap:</b> {detailModal.data.nama_lengkap || '-'}</p>
                              <p><b>Username:</b> {detailModal.data.username}</p>
                              <p><b>Email:</b> {detailModal.data.email || '-'}</p>
                              <p><b>Kelas:</b> {detailModal.data.kelas || '-'}</p>
                              <p><b>No Telepon:</b> {detailModal.data.no_telp || '-'}</p>
                              <p><b>Level:</b> <span style={{textTransform:'capitalize', background:'#e0f2fe', color:'#0369a1', padding:'2px 8px', borderRadius:'4px', fontWeight:'bold', fontSize:'12px'}}>{detailModal.data.level}</span></p>
                            </div>
                        </div>
                    )}

                    {detailModal.type === 'kategori' && (
    <div>
        <h3 style={{marginBottom:'20px', borderBottom:'2px solid #e2e8f0', paddingBottom:'10px'}}>📂 Detail Kategori</h3>
        <div style={{lineHeight: '2'}}>
            <p><b>Kode Kategori:</b> {detailModal.data.kode_kategori || '-'}</p>
            <p><b>Nama Kategori:</b> {detailModal.data.nama_kategori || '-'}</p>
            <p><b>Deskripsi:</b> {detailModal.data.deskripsi_kategori || detailModal.data.deskripsi || '-'}</p>
        </div>
    </div>
)}

                    {(detailModal.type === 'peminjaman' || detailModal.type === 'pengembalian') && (
                        <div>
                            <h3 style={{marginBottom:'20px', borderBottom:'2px solid #e2e8f0', paddingBottom:'10px'}}>📑 Detail Transaksi</h3>
                            <div style={{lineHeight: '2'}}>
                              <p><b>Kode Transaksi:</b> {detailModal.data.kode_peminjaman}</p>
                              <p><b>Nama Peminjam:</b> {detailModal.data.peminjam}</p>
                              
                              {detailModal.type === 'peminjaman' && (
                                <>
                                  <p><b>Tanggal Pinjam:</b> {new Date(detailModal.data.tanggal_peminjaman || detailModal.data.tgl_pinjam).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                  <p><b>Tgl Rencana Kembali:</b> {new Date(detailModal.data.tanggal_kembali_rencana || detailModal.data.tgl_rencana_kembali).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </>
                              )}

                              {detailModal.type === 'pengembalian' && (
                                  <>
                                      <p><b>Petugas Penerima:</b> {detailModal.data.petugas || '-'}</p>
                                      <p><b>Tgl Dikembalikan:</b> <span style={{color:'#10b981', fontWeight:'bold'}}>{detailModal.data.tanggal_pengembalian || detailModal.data.tgl_kembali ? new Date(detailModal.data.tanggal_pengembalian || detailModal.data.tgl_kembali).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</span></p>
                                      <p><b>Kondisi Saat Dikembalikan:</b> {detailModal.data.kondisi_kembali || 'Baik'}</p>
                                      <p><b>Catatan:</b> {detailModal.data.catatan || '-'}</p>
                                      <p><b>Denda:</b> <span style={{color: detailModal.data.denda > 0 ? '#ef4444' : '#10b981', fontWeight:'bold'}}>Rp {detailModal.data.denda || 0}</span></p>
                                  </>
                              )}
                              
                              {detailModal.type === 'peminjaman' && (
                                <p><b>Status Transaksi:</b> <span style={{textTransform:'uppercase', fontWeight:'bold', color: detailModal.data.status==='dipinjam'?'#3b82f6':(detailModal.data.status==='pending'?'#d97706':'#10b981')}}>{detailModal.data.status}</span></p>
                              )}
                            </div>
                        </div>
                    )}

                    <button className="btn btn-red" style={{width:'100%', marginTop:'25px', padding:'12px'}} onClick={()=>setDetailModal(null)}>Tutup Detail</button>
                </div>
            </div>
        )}

      </div>
    
  );
}

function App() {
  const handleLogin = async (e) => {
    e.preventDefault();
    const usernameInput = e.target[0].value;
    const passwordInput = e.target[1].value;
    try {
      const res = await fetch('http://localhost:5000/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: usernameInput, password: passwordInput }) });
      const d = await res.json();
      if (d.status === 'success') { localStorage.setItem('user_kafka', JSON.stringify(d.data)); window.location.href = '/dashboard'; }
      else alert(d.message);
    } catch (e) { alert("Server backend mati Kap!"); }
  };
  return (
    <Routes>
      <Route path="/" element={<div className="login-wrapper"><div className="login-card"><h2>KAFKA TOOLS</h2><form onSubmit={handleLogin}><input className="input-gaya" placeholder="👤 Username" required /><input className="input-gaya" type="password" placeholder="🔒 Password" required /><button className="btn btn-blue" style={{width:'100%', padding:'14px', marginTop:'10px'}}>MASUK SEKARANG</button></form></div></div>} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes> 
  );
}

export default function Root() { return ( <BrowserRouter><style>{style}</style><App /></BrowserRouter> ); }