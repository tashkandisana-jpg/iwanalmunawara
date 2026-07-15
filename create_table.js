const mysql = require("mysql2");

// الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ق00فسشاع2085", 
});

// إنشاء قاعدة البيانات إذا ما كانت موجودة
db.query("CREATE DATABASE IF NOT EXISTS iwan_db", (err) => {
    if (err) throw err;
    console.log("✔ تم إنشاء قاعدة البيانات iwan_db أو التأكد من وجودها");

    // اختيار قاعدة البيانات
    db.changeUser({ database: "iwan_db" });

    // إنشاء الجدول
    const createTable = `
        CREATE TABLE IF NOT EXISTS client_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullName VARCHAR(255),
            phone VARCHAR(50),
            email VARCHAR(255),
            projectType VARCHAR(100),
            landArea INT,
            location VARCHAR(255),
            notes TEXT,
            created_at DATETIME
        );
    `;

    db.query(createTable, (err) => {
        if (err) throw err;
        console.log("✔ تم إنشاء جدول client_requests بنجاح");
        db.end();
    });
});
