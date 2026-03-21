// ระบบ LOGIN
function checkLogin(event) {
    if (event) event.preventDefault(); 
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;
    let correctEmail = "test@gmail.com";
    let correctPass = "1234";

    if(email === correctEmail && pass === correctPass) {
        sessionStorage.setItem('currentUser', email);
        if (!localStorage.getItem(email)) {
            localStorage.setItem(email, JSON.stringify({ name: 'Lunar' }));
        }
        window.location.href = "dashboard.html"; 
    } else {
        let errorElement = document.getElementById("error");
        if(errorElement) errorElement.textContent = "Email หรือ Password ไม่ถูกต้อง!";
        else alert("Email หรือ Password ไม่ถูกต้อง!");
    }
}

// เมื่อโหลดหน้าเว็บ

document.addEventListener("DOMContentLoaded", function() {
    // 1. จัดการชื่อผู้ใช้
    const userEmail = sessionStorage.getItem('currentUser');
    const userNameElement = document.getElementById('userName');
    if (userEmail && userNameElement) {
        const userData = JSON.parse(localStorage.getItem(userEmail));
        userNameElement.innerText = `Hi, ${userData ? userData.name : 'Lunar'}!`;
    }

    // 2. ขีดเส้นใต้เมนูที่เลือก
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

    // 3. แสดงข้อมูลตามหน้าต่างๆ
    if (currentPath.includes('dashboard.html')) {
        displaySavedData(); // แสดงข้อมูลล่าสุดบน Dashboard
    }
    
    if (currentPath.includes('progress.html')) {
        renderProgressChart(); // วาดกราฟ
    }

    if (currentPath.includes('goals.html')) {
        displayGoalStatus(); // คำนวณ % เป้าหมาย
    }

    // 4. ระบบเปิด/ปิด
    const modal = document.getElementById('dataModal');
    const addBtn = document.querySelector('.add-btn');
    if (addBtn && modal) {
        addBtn.addEventListener('click', () => modal.style.display = 'flex');
        window.addEventListener('click', (e) => { if (e.target == modal) closeModal(); });
    }
});

// จัดการข้อมูล

function closeModal() {
    const modal = document.getElementById('dataModal');
    if (modal) modal.style.display = 'none';
}

function saveData() {
    const weight = document.getElementById('inputWeight').value;
    const cal = document.getElementById('inputCal').value;
    const ex = document.getElementById('inputEx').value || "0";
    const water = document.getElementById('inputWater').value || "0";

    if(!weight || !cal) return alert("กรุณากรอกน้ำหนักและแคลอรี่");

    const currentStats = { weight, cal, ex, water };
    
    // บันทึกค่าล่าสุดและประวัติ
    localStorage.setItem('latestStats', JSON.stringify(currentStats));
    saveToHistory(weight, cal, ex, water);

    // อัปเดต UI 
    updateDashboardUI(currentStats);
    closeModal();
    document.querySelectorAll('.modal-content input').forEach(input => input.value = '');
}

function updateDashboardUI(stats) {
    const map = {
        '.card-blue h3': `${stats.weight} kg`,
        '.card-orange h3': `${stats.cal}/2,000 kcal`,
        '.card-green h3': `${stats.ex} นาที`,
        '.card-cyan h3': `${stats.water} ml`
    };
    for (let selector in map) {
        let el = document.querySelector(selector);
        if (el) el.innerText = map[selector];
    }
}

function displaySavedData() {
    const savedData = localStorage.getItem('latestStats');
    if (savedData) updateDashboardUI(JSON.parse(savedData));
}

function saveToHistory(weight, cal, ex, water) {
    let history = JSON.parse(localStorage.getItem('fitnessHistory')) || [];
    const newData = {
        weight: parseFloat(weight),
        calories: parseInt(cal),
        exercise: parseInt(ex),
        water: parseInt(water),
        date: new Date().toLocaleDateString('en-US', { weekday: 'short' })
    };
    history.push(newData);
    if (history.length > 7) history.shift();
    localStorage.setItem('fitnessHistory', JSON.stringify(history));
}

// ฟังก์ชันคำนวณหน้า GOALS

function displayGoalStatus() {
    const history = JSON.parse(localStorage.getItem('fitnessHistory')) || [];
    const weightBar = document.getElementById('weightBar');
    const percentText = document.getElementById('percentText');

    const startWeight = 57; 
    const targetWeight = 52; 

    if (history.length > 0 && weightBar) {
        const currentWeight = history[history.length - 1].weight;
        let progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;
        progress = Math.min(100, Math.max(0, progress)); // ให้อยู่ระหว่าง 0-100%

        weightBar.style.width = progress + "%";
        if(percentText) percentText.innerText = Math.round(progress) + "%";
    }
}

// วาดกราฟ PROGRESS
function renderProgressChart() {
    const canvas = document.getElementById('myChart');
    if (!canvas) return;
    const history = JSON.parse(localStorage.getItem('fitnessHistory')) || [];
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.length ? history.map(i => i.date) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                data: history.map(i => i.weight),
                borderColor: '#4caf8f',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(76, 175, 143, 0.1)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

// เปิด/ปิด Modal เป้าหมาย
function openGoalModal() {
    document.getElementById('goalModal').style.display = 'flex';
}

function closeGoalModal() {
    document.getElementById('goalModal').style.display = 'none';
}

// บันทึกเป้าหมายและคำนวณ %
function saveGoalWeight() {
    const targetValue = document.getElementById('targetInput').value;
    if (!targetValue) return alert("กรุณาระบุน้ำหนักเป้าหมาย");

    localStorage.setItem('userGoalWeight', targetValue);
    closeGoalModal();
    displayGoalStatus(); // อัปเดตการแสดงผล
}

// คำนวณสถานะความคืบหน้า
function displayGoalStatus() {
    const history = JSON.parse(localStorage.getItem('fitnessHistory')) || [];
    const targetWeight = parseFloat(localStorage.getItem('userGoalWeight'));
    
    const weightBar = document.getElementById('weightBar');
    const percentText = document.getElementById('percentText');
    const goalDetailText = document.getElementById('goalDetailText');

    if (history.length > 0 && targetWeight) {
        const startWeight = history[0].weight; // น้ำหนักวันแรกที่เริ่มบันทึก
        const currentWeight = history[history.length - 1].weight; // น้ำหนักล่าสุดจาก Dashboard

        // คำนวณส่วนต่าง
        const totalToLose = startWeight - targetWeight;
        const actualLost = startWeight - currentWeight;
        
        // คำนวณ % ความสำเร็จ
        let progress = 0;
        if (totalToLose > 0) {
            progress = (actualLost / totalToLose) * 100;
        }

        progress = Math.min(100, Math.max(0, progress));

        // อัปเดตหน้าจอ
        if(weightBar) weightBar.style.width = progress + "%";
        if(percentText) percentText.innerText = Math.round(progress) + "%";
        if(goalDetailText) {
            goalDetailText.innerText = `เริ่มต้นน้ำหนัก ${startWeight} kg | เป้าหมาย ${targetWeight} kg`;
        }
    }
}

// โหลดสถานะเป้าหมายทุกครั้งที่เปิดหน้า Goals
if (window.location.pathname.includes('goals.html')) {
    window.addEventListener('load', displayGoalStatus);
}

function openGoalModal() { document.getElementById('goalModal').style.display = 'flex'; }
function closeGoalModal() { document.getElementById('goalModal').style.display = 'none'; }
function closeModal() { document.getElementById('dataModal').style.display = 'none'; }

function saveData() {
    const weight = document.getElementById('inputWeight').value;
    const cal = document.getElementById('inputCal').value;
    const ex = document.getElementById('inputEx').value || 0;
    const water = document.getElementById('inputWater').value || 0;

    if (!weight || !cal) return alert("กรุณากรอกน้ำหนักและแคลอรี่");

    // เก็บค่าล่าสุด
    const stats = { weight, cal, ex, water };
    localStorage.setItem('latestStats', JSON.stringify(stats));

    // เก็บลงประวัติ 
    let history = JSON.parse(localStorage.getItem('fitnessHistory')) || [];
    history.push({ 
        weight: parseFloat(weight), 
        date: new Date().toLocaleDateString('en-US', { weekday: 'short' }) 
    });
    if (history.length > 7) history.shift();
    localStorage.setItem('fitnessHistory', JSON.stringify(history));

    alert("บันทึกข้อมูลเรียบร้อย!");
    location.reload(); // รีเฟรชเพื่ออัปเดตตัวเลข
}

function displayGoalStatus() {
    const userEmail = sessionStorage.getItem('currentUser') || 'test@gmail.com';
    const userData = JSON.parse(localStorage.getItem(userEmail)) || {};
    
    // ดึงน้ำหนักล่าสุดจาก 
    const currentWeight = userData.currentWeight || 0; 
    const targetWeight = parseFloat(localStorage.getItem('userGoalWeight')) || 0;
    const history = userData.fitnessHistory || [];

    const weightBar = document.getElementById('weightBar');
    const percentText = document.getElementById('percentText');
    const goalDetailText = document.getElementById('goalDetailText');

    if (targetWeight > 0 && currentWeight > 0) {
        // หาน้ำหนักเริ่มต้น 
        const startWeight = history.length > 0 ? history[0].weight : currentWeight;

        // คำนวณ % ความคืบหน้า
        // สูตร: (น้ำหนักที่ลดได้จริง / น้ำหนักที่ต้องลดทั้งหมด) * 100
        const totalToLose = startWeight - targetWeight;
        const actualLost = startWeight - currentWeight;
        
        let progress = 0;
        if (totalToLose > 0) {
            progress = (actualLost / totalToLose) * 100;
        } else if (currentWeight <= targetWeight) {
            progress = 100;
        }

        progress = Math.min(100, Math.max(0, progress));

        if (weightBar) weightBar.style.width = progress + "%";
        if (percentText) percentText.innerText = Math.round(progress) + "%";
        if (goalDetailText) {
            goalDetailText.innerText = `เริ่มต้นน้ำหนัก ${startWeight} kg | เป้าหมาย ${targetWeight} kg`;
        }
    }
}
