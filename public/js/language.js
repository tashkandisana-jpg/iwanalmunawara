// زر اللغة في الصفحة الرئيسية
const btnAr = document.getElementById('btn-ar');
const btnEn = document.getElementById('btn-en');

// زر اللغة في صفحة تسجيل الدخول
const btnArLogin = document.getElementById('btn-ar-login');
const btnEnLogin = document.getElementById('btn-en-login');

// وظيفة تغيير اللغة
function setLanguage(lang) {
    const html = document.documentElement;

    // تغيير اتجاه الصفحة
    if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
    }

    // تغيير النصوص حسب اللغة
    const elements = document.querySelectorAll('[data-text-ar][data-text-en]');
    elements.forEach(el => {
        const textAr = el.getAttribute('data-text-ar');
        const textEn = el.getAttribute('data-text-en');
        el.textContent = (lang === 'ar') ? textAr : textEn;
    });
}

// ربط أزرار الصفحة الرئيسية
if (btnAr && btnEn) {
    btnAr.addEventListener('click', () => setLanguage('ar'));
    btnEn.addEventListener('click', () => setLanguage('en'));
}

// ربط أزرار صفحة تسجيل الدخول
if (btnArLogin && btnEnLogin) {
    btnArLogin.addEventListener('click', () => setLanguage('ar'));
    btnEnLogin.addEventListener('click', () => setLanguage('en'));
}

// لغة افتراضية
setLanguage('en');
