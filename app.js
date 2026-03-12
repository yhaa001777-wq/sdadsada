
// Пример запроса к Travelpayouts API (замени на свой маркер и токен)
const API_URL = 'https://api.travelpayouts.com/aviasales/v3/prices_for_dates';
const MARKER = 'c6dd78e239fcf7c47f3f9fd58c0e2b8c'; // твой маркер
const MANAGER_LINK = 'https://t.me/твой_ник'; // ссылка на менеджера

const form = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultsDiv.innerHTML = `<div class='info-message'>Поиск билетов...</div>`;
    const origin = document.getElementById('origin').value.toUpperCase();
    const destination = document.getElementById('destination').value.toUpperCase();
    const date = document.getElementById('date').value;
    const passengers = document.getElementById('passengers').value;

    if (!origin || !destination || !date) {
        resultsDiv.innerHTML = `<div class='info-message'>Пожалуйста, заполните все поля.</div>`;
        return;
    }

    // Запрос к API (пример для Travelpayouts)
    const url = `${API_URL}?origin=${origin}&destination=${destination}&depart_date=${date}&return_date=&unique=false&one_way=true&direct=false&market=ru&currency=rub&limit=5&token=${MARKER}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (!data.data || data.data.length === 0) {
            resultsDiv.innerHTML = `<div class='info-message'>Билеты не найдены. Попробуйте изменить параметры поиска.</div>`;
            return;
        }
        resultsDiv.innerHTML = '';
        data.data.forEach(ticket => {
            const oldPrice = ticket.value;
            const newPrice = Math.floor(oldPrice * 0.7); // скидка 30%
            const ticketDiv = document.createElement('div');
            ticketDiv.className = 'ticket';
            ticketDiv.innerHTML = `
                <div style='font-size:17px; margin-bottom:6px;'>✈️ <b>${ticket.origin} → ${ticket.destination}</b> <span style='font-size:13px; color:#888;'>${ticket.depart_date}</span></div>
                <div style='margin-bottom:7px;'>Авиакомпания: <b>${ticket.airline || '—'}</b></div>
                <div>Цена: <span class='price-old'>${oldPrice} ₽</span> <span style='font-size:15px;'>→</span> <span class='price-new'>${newPrice} ₽</span></div>
                <button class='buy-btn'>Купить билет</button>
            `;
            ticketDiv.querySelector('.buy-btn').onclick = () => {
                ticketDiv.querySelector('.buy-btn').disabled = true;
                ticketDiv.innerHTML += `<div style='margin-top:10px; color:#1a73e8;'>Для покупки билета свяжитесь с <a href='${MANAGER_LINK}' target='_blank'>менеджером</a>.</div>`;
            };
            resultsDiv.appendChild(ticketDiv);
        });
    } catch (err) {
        resultsDiv.innerHTML = `<div class='info-message'>Ошибка при поиске билетов. Попробуйте позже.</div>`;
    }
});
