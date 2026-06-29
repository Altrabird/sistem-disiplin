/**
 * ============================================================
 *  SISTEM PENGURUSAN DISIPLIN SKBT — Backend Google Apps Script
 *  Pangkalan data : Google Sheets   |   Simpanan foto : Google Drive
 *  Semua data kekal dalam akaun Google anda sendiri.
 * ============================================================
 *
 *  CARA PASANG (ringkas — lihat PANDUAN-SETUP.md untuk penuh):
 *   1. Buka https://script.google.com  →  Projek Baharu
 *   2. Padam kod contoh, tampal SEMUA kod ini, Simpan.
 *   3. Deploy ▸ New deployment ▸ Type: Web app
 *        - Execute as       : Me
 *        - Who has access   : Anyone
 *      Authorize / benarkan akses. Salin URL "/exec".
 *   4. Tampal URL itu dalam app  ▸ Tetapan & Data ▸ Mode Penyimpanan.
 *
 *  (Pilihan) Tetapkan PIN: ubah PIN di bawah kepada nombor anda,
 *  dan masukkan PIN sama dalam Tetapan app. Biarkan '' untuk tiada PIN.
 */

const PIN          = '';                       // cth: '169298' untuk kunci tulisan. '' = tiada PIN
const SHEET_NAME   = 'Kes';
const FOLDER_NAME  = 'Bukti Disiplin SKBT';

// ── Sambungan roster murid dari sistem Hadir@SKBT ──
// ID Google Sheet Hadir@SKBT (tab "Students", lajur Name & Class).
// Akaun yang deploy skrip ini MESTI ada akses (view) kepada sheet ini.
// Kosongkan ('') untuk matikan sambungan roster.
const ROSTER_ID    = '1CiS8GhmhsDtOxZP0L3ZDmQDiA3DTbc1R0mQRQOfe1qY';
const ROSTER_TAB   = 'Students';
const HEADERS = ['id','tarikh','nama','kelas','jantina','kategori','tahap',
                 'butiran','tindakan','guru','status','foto','fotoId','dicipta','dikemaskini'];

/* ---------- Storan: Spreadsheet & Folder (auto-cipta) ---------- */
function props_(){ return PropertiesService.getScriptProperties(); }

function sheet_(){
  let id = props_().getProperty('SHEET_ID'), ss;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { id = null; } }
  if (!id) { ss = SpreadsheetApp.create('Data Disiplin SKBT'); props_().setProperty('SHEET_ID', ss.getId()); }
  let sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

function folder_(){
  let id = props_().getProperty('FOLDER_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const f = DriveApp.createFolder(FOLDER_NAME);
  props_().setProperty('FOLDER_ID', f.getId());
  return f;
}

/* ---------- Util ---------- */
function json_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
function checkPin_(token){ return !PIN || String(token) === String(PIN); }

/* ---------- API: GET (senarai / ping) ---------- */
function doGet(e){
  const action = (e && e.parameter && e.parameter.action) || 'list';
  if (action === 'ping') return json_({ ok:true, msg:'Sistem Disiplin GAS aktif', pin: !!PIN, roster: !!ROSTER_ID });
  if (action === 'list') return json_({ ok:true, data: listKes_() });
  if (action === 'students') return json_({ ok:true, data: listStudents_() });
  return json_({ ok:false, error:'Tindakan tidak dikenali' });
}

/* ---------- API: POST (simpan / padam) ---------- */
function doPost(e){
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (!checkPin_(body.token)) return json_({ ok:false, error:'PIN tidak sah' });
    if (body.action === 'save')   return json_({ ok:true, data: saveKes_(body.record, body.fotoData) });
    if (body.action === 'delete') return json_({ ok:true, data: deleteKes_(body.id) });
    return json_({ ok:false, error:'Tindakan tidak dikenali' });
  } catch (err) {
    return json_({ ok:false, error:String(err) });
  }
}

/* ---------- Roster murid (Hadir@SKBT) ---------- */
function listStudents_(){
  if (!ROSTER_ID) return [];
  const cache = CacheService.getScriptCache();
  const hit = cache.get('roster');
  if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  let ss;
  try { ss = SpreadsheetApp.openById(ROSTER_ID); } catch (e) { return []; }
  const sh = ss.getSheetByName(ROSTER_TAB);
  if (!sh) return [];
  const vals = sh.getDataRange().getValues();
  const head = vals.shift().map(h => String(h).trim().toLowerCase());
  const ni = head.indexOf('name'), ci = head.indexOf('class');
  if (ni < 0 || ci < 0) return [];
  const seen = {}, out = [];
  vals.forEach(r => {
    const nama = String(r[ni] || '').trim(), kelas = String(r[ci] || '').trim();
    if (!nama) return;
    const k = nama + '|' + kelas;
    if (seen[k]) return; seen[k] = 1;
    out.push({ nama: nama, kelas: kelas });
  });
  out.sort((a,b) => a.kelas.localeCompare(b.kelas) || a.nama.localeCompare(b.nama));
  try { cache.put('roster', JSON.stringify(out), 600); } catch (e) {}   // cache 10 minit
  return out;
}

/* ---------- Operasi data ---------- */
function listKes_(){
  const sh = sheet_(), values = sh.getDataRange().getValues();
  const head = values.shift();
  return values.filter(r => r[0]).map(r => {
    const o = {}; head.forEach((h,i) => o[h] = (r[i] instanceof Date) ? r[i].toISOString().slice(0,10) : r[i]);
    return o;
  });
}

function savePhoto_(dataUrl, caseId){
  const folder = folder_();
  const m = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  const contentType = m ? m[1] : 'image/jpeg';
  const bytes = Utilities.base64Decode(m ? m[2] : dataUrl.split(',')[1]);
  const blob = Utilities.newBlob(bytes, contentType, 'bukti-' + caseId + '-' + Date.now() + '.jpg');
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const id = file.getId();
  return { id: id, url: 'https://drive.google.com/thumbnail?id=' + id + '&sz=w1000' };
}

function saveKes_(rec, fotoData){
  const sh = sheet_(), data = sh.getDataRange().getValues(), head = data[0];
  let rowIdx = -1, existing = {};
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(rec.id)) {
      rowIdx = i + 1;
      head.forEach((h,j) => existing[h] = data[i][j]);
      break;
    }
  }
  const merged = Object.assign({}, existing, rec);   // rec menimpa nilai sedia ada

  if (fotoData) {                                     // ada foto baharu → simpan ke Drive
    if (existing.fotoId) { try { DriveApp.getFileById(existing.fotoId).setTrashed(true); } catch (e) {} }
    const p = savePhoto_(fotoData, rec.id);
    merged.foto = p.url; merged.fotoId = p.id;
  }
  if (rec.foto === '' && !fotoData && existing.fotoId) {   // foto dibuang
    try { DriveApp.getFileById(existing.fotoId).setTrashed(true); } catch (e) {}
    merged.foto = ''; merged.fotoId = '';
  }

  if (!merged.dicipta) merged.dicipta = new Date().toISOString();
  merged.dikemaskini = new Date().toISOString();

  const row = head.map(h => merged[h] !== undefined ? merged[h] : '');
  if (rowIdx > -1) sh.getRange(rowIdx, 1, 1, head.length).setValues([row]);
  else sh.appendRow(row);
  return merged;
}

function deleteKes_(id){
  const sh = sheet_(), data = sh.getDataRange().getValues(), head = data[0];
  const fcol = head.indexOf('fotoId');
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      if (data[i][fcol]) { try { DriveApp.getFileById(data[i][fcol]).setTrashed(true); } catch (e) {} }
      sh.deleteRow(i + 1);
      break;
    }
  }
  return { id: id };
}
