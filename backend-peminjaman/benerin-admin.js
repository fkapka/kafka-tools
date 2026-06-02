const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Konek ke database lu
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'kafka_tools'
});

async function basmiError() {
    try {
        console.log("⏳ Lagi nge-hash password 'admin123'...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        db.query("DELETE FROM users WHERE username = 'admin'", (err) => {
            if (err) throw err;
            
            // Masukin admin baru dengan hash yang 1000% valid dari sistem lu
            const sql = "INSERT INTO users (username, password, level) VALUES ('admin', ?, 'admin')";
            db.query(sql, [hashedPassword], (err, result) => {
                if (err) throw err;
                console.log("✅ BERHASIL BOS! Password admin udah diganti jadi: admin123 (Udah di-Hash Sempurna!)");
                console.log("🚀 Sekarang matiin file ini, jalanin ulang 'node index.js', dan coba login!");
                process.exit();
            });
        });
    } catch (error) {
        console.log("❌ Waduh error:", error);
        process.exit();
    }
}

basmiError();