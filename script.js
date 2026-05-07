let events = JSON.parse(localStorage.getItem('focus_countdown_events') || '[]');
let currentTargetDate = new Date(Date.now() + 86400000); // Default อีก 1 วัน

const mainNumber = document.getElementById('mainNumber');
const subDetail = document.getElementById('subDetail');
const unitLabel = document.getElementById('unitLabel');
const unitSelect = document.getElementById('unitSelect');
const cardContainer = document.getElementById('cardContainer');

function updateCounter() {
    const now = new Date();
    const diff = currentTargetDate - now;
    const unit = unitSelect.value;
    
    let value = 0;
    let sub = "";

    if (diff > 0) {
        const totalSeconds = diff / 1000;
        const totalMinutes = totalSeconds / 60;
        const totalHours = totalMinutes / 60;
        const totalDays = totalHours / 24;

        switch(unit) {
            case "weeks":
                value = Math.floor(totalDays / 7);
                let remainDays = Math.ceil(totalDays % 7);
                sub = `(${remainDays} วัน)`;
                break;
            case "days": value = Math.ceil(totalDays); break;
            case "hours": value = Math.ceil(totalHours); break;
            case "mins": value = Math.ceil(totalMinutes); break;
            case "secs": value = Math.floor(totalSeconds); break;
        }
    }

    mainNumber.innerText = value;
    unitLabel.innerText = unit.toUpperCase() + " LEFT";
    subDetail.innerText = sub;
}

// ระบบ Save
document.getElementById('saveBtn').onclick = () => {
    const name = document.getElementById('eventName').value;
    const dateValue = document.getElementById('targetDate').value;
    
    if (!name || !dateValue) {
        alert("กรุณากรอกชื่อและเลือกวันที่ครับ");
        return;
    }

    const newEvent = { id: Date.now(), name, date: dateValue };
    events.push(newEvent);
    localStorage.setItem('focus_countdown_events', JSON.stringify(events));
    renderCards();
    
    // ตั้งค่าเป้าหมายปัจจุบันเป็นอันที่เพิ่งเซฟทันที
    currentTargetDate = new Date(dateValue);
};

// ระบบแสดงผลการ์ด
function renderCards() {
    cardContainer.innerHTML = '';
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div>
                <h3>${event.name}</h3>
                <p>📅 ${new Date(event.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</p>
            </div>
            <p style="font-size: 10px; color: #FF3B30;" onclick="deleteEvent(event, ${event.id})">กดค้างเพื่อลบ (ลบรายการ)</p>
        `;
        
        // เมื่อคลิกการ์ดให้สลับวันนับถอยหลัง
        card.onclick = () => {
            currentTargetDate = new Date(event.date);
            document.getElementById('eventName').value = event.name;
        };

        cardContainer.appendChild(card);
    });
}

function deleteEvent(e, id) {
    e.stopPropagation(); // กันไม่ให้ไปคลิกการ์ดหลัก
    events = events.filter(ev => ev.id !== id);
    localStorage.setItem('focus_countdown_events', JSON.stringify(events));
    renderCards();
}

document.getElementById('clearAllBtn').onclick = () => {
    if(confirm("ลบรายการทั้งหมดใช่ไหม?")) {
        events = [];
        localStorage.setItem('focus_countdown_events', JSON.stringify(events));
        renderCards();
    }
};

// เริ่มต้นระบบ
setInterval(updateCounter, 1000);
renderCards();
updateCounter();
