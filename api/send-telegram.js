// api/send-telegram.js
export default async function handler(req, res) {
  // только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    // то, что пришло из формы
    const { name, phone, page } = req.body || {};

    // твой бот
    const token  = '8052585141:AAHAou3XhLYAQFl83QfWL0_8_nMVvV_amfc';
    // твой акаунт @likeriastore (id, который мы получили через getUpdates)
    const chatId = '7590252618';

    // функция, чтобы экранировать текст
    const esc = (s = '—') =>
      String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // час київський
    const date = new Date().toLocaleString('uk-UA', {
      timeZone: 'Europe/Kyiv',
      hour12: false,
    });

    // текст, який прилетить в Telegram
    const text =
`🛒 <b>Нова заявка</b>
📄 <b>Лендинг:</b> ${esc(page || 'likeris-landing')}
👤 <b>Ім’я:</b> ${esc(name)}
📞 <b>Телефон:</b> ${esc(phone)}
🕓 <b>Час:</b> ${date}`;

    // відправка в Telegram
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    const data = await tgRes.json();

    if (!data.ok) {
      // якщо Telegram повернув помилку
      return res.status(500).json({ ok: false, error: 'Telegram API error', data });
    }

    // все ок
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}

