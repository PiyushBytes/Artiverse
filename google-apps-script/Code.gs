const SHEET_NAME = 'Applications';
const HEADERS = ['Timestamp','Full Name','College Email','Phone','Roll Number','Department','Year','Domain Preference 1','Domain Preference 2','Why Artiverse','Portfolio'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return json({ ok: false, message: 'Rejected.' });
    const email = String(data.email || '').trim().toLowerCase();
    if (!email) return json({ ok: false, message: 'College email is required.' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    const emails = sheet.getLastRow() > 1
      ? sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat().map(v => String(v).trim().toLowerCase())
      : [];
    if (emails.includes(email)) return json({ ok: false, message: 'An application with this college email already exists.' });

    sheet.appendRow([
      new Date(), data.fullName || '', email, data.phone || '', data.rollNumber || '',
      data.department || '', data.year || '', data.domain1 || '', data.domain2 || '',
      data.why || '', data.portfolio || ''
    ]);
    return json({ ok: true, message: 'Application received.' });
  } catch (err) {
    return json({ ok: false, message: err.message || 'Server error.' });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
