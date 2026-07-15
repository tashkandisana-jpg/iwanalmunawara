const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// استقبال JSON و FormData
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// ⭐ تحديد مسار قاعدة البيانات داخل Render
const dbPath = path.join(__dirname, "iwan.db");

// ⭐ إنشاء قاعدة بيانات SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log("❌ خطأ في إنشاء قاعدة البيانات:", err);
    } else {
        console.log("📦 قاعدة البيانات جاهزة:", dbPath);
    }
});

// ⭐ إنشاء جدول الطلبات إذا ما كان موجود
db.run(`
    CREATE TABLE IF NOT EXISTS client_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT,
        phone TEXT,
        email TEXT,
        projectType TEXT,
        landArea TEXT,
        location TEXT,
        notes TEXT,
        created_at TEXT
    )
`);

// ⭐ تسجيل دخول الموظفين
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const correctUser = "admin";
    const correctPass = "12345";

    if (username === correctUser && password === correctPass) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// إعدادات إرسال الإيميل
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "iwanalmunawara@gmail.com",
        pass: "123456iwan"
    }
});

// استقبال بيانات النموذج
app.post("/submit-request", (req, res) => {

    console.log("📥 البيانات المستلمة:", req.body);

    const { fullName, phone, email, projectType, landArea, location, notes } = req.body;

    const sql = `
        INSERT INTO client_requests 
        (fullName, phone, email, projectType, landArea, location, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;

    db.run(
        sql,
        [fullName, phone, email, projectType, landArea, location, notes],
        function (err) {
            if (err) {
                console.log("❌ خطأ أثناء إدخال البيانات:", err);
                return res.status(500).json({ message: "حدث خطأ أثناء إرسال الطلب" });
            }

            console.log("✅ تم حفظ الطلب بنجاح");

            const mailOptions = {
                from: "iwanalmunawara@gmail.com",
                to: "iwanalmunawara@gmail.com",
                subject: "📩 طلب جديد من نموذج إيوان المنورة",
                html: `
                    <h2>📩 تم استلام طلب جديد</h2>
                    <p><strong>الاسم:</strong> ${fullName}</p>
                    <p><strong>رقم الجوال:</strong> ${phone}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${email}</p>
                    <p><strong>نوع المشروع:</strong> ${projectType}</p>
                    <p><strong>مساحة الأرض:</strong> ${landArea}</p>
                    <p><strong>موقع المشروع:</strong> ${location}</p>
                    <p><strong>ملاحظات إضافية:</strong> ${notes}</p>
                    <p><strong>تاريخ الإرسال:</strong> ${new Date().toLocaleString()}</p>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("❌ خطأ أثناء إرسال الإيميل:", error);
                } else {
                    console.log("📧 تم إرسال الإيميل بنجاح:", info.response);
                }
            });

            res.json({ message: "تم إرسال الطلب بنجاح" });
        }
    );
});

// جلب الطلبات للموظفين
app.get("/get-requests", (req, res) => {
    const sql = "SELECT * FROM client_requests ORDER BY created_at DESC";

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log("❌ خطأ أثناء جلب الطلبات:", err);
            return res.status(500).json({ message: "خطأ في جلب الطلبات" });
        }

        res.json(rows);
    });
});

// تشغيل السيرفر (جاهز لـ Render)
app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 السيرفر يعمل على Render");
});
