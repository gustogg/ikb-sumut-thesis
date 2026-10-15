/* Native CSV and OOXML downloads. No network, CDN, or server-side dependency. */
(() => {
  'use strict';
  const encoder = new TextEncoder();
  const xml = (value) => String(value ?? '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const decimal = /^-?\d+(?:\.\d+)?$/;
  function csv(rows) {
    return '\ufeff' + rows.map(row => row.map(value => {
      let text = String(value ?? '');
      // Keep legitimate negative numbers; escape spreadsheet formulas in text.
      if (!decimal.test(text) && /^[\s]*[=+\-@]/.test(text)) text = "'" + text;
      return '"' + text.replace(/"/g, '""') + '"';
    }).join(';')).join('\r\n') + '\r\n';
  }
  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  // ZIP STORE avoids a compression dependency. The workbook is small (33 rows).
  function zip(files) {
    const parts = [], central = [];
    let offset = 0, centralSize = 0;
    for (const [name, content] of Object.entries(files)) {
      const filename = encoder.encode(name), bytes = encoder.encode(content), crc = crc32(bytes);
      const local = new Uint8Array(30 + filename.length), l = new DataView(local.buffer);
      l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true);
      l.setUint16(6, 0x800, true); l.setUint16(12, 33, true);
      l.setUint32(14, crc, true); l.setUint32(18, bytes.length, true); l.setUint32(22, bytes.length, true);
      l.setUint16(26, filename.length, true); local.set(filename, 30);
      const entry = new Uint8Array(46 + filename.length), c = new DataView(entry.buffer);
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true);
      c.setUint16(8, 0x800, true); c.setUint16(14, 33, true);
      c.setUint32(16, crc, true); c.setUint32(20, bytes.length, true); c.setUint32(24, bytes.length, true);
      c.setUint16(28, filename.length, true); c.setUint32(42, offset, true); entry.set(filename, 46);
      parts.push(local, bytes); central.push(entry);
      offset += local.length + bytes.length; centralSize += entry.length;
    }
    const end = new Uint8Array(22), e = new DataView(end.buffer);
    e.setUint32(0, 0x06054b50, true);
    e.setUint16(8, central.length, true); e.setUint16(10, central.length, true);
    e.setUint32(12, centralSize, true); e.setUint32(16, offset, true);
    return new Blob([...parts, ...central, end], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  function column(index) {
    let name = '';
    for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + (n - 1) % 26) + name;
    return name;
  }
  function xlsx(rows) {
    const declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    const spreadsheet = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    const relationships = 'http://schemas.openxmlformats.org/package/2006/relationships';
    const office = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const last = column(rows[0].length - 1) + rows.length;
    const sheet = declaration + `<worksheet xmlns="${spreadsheet}"><dimension ref="A1:${last}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="${rows[0].length}" width="25" customWidth="1"/></cols><sheetData>` + rows.map((row, r) => `<row r="${r+1}">` + row.map((v, c) => `<c r="${column(c)}${r+1}" t="inlineStr"><is><t xml:space="preserve">${xml(v)}</t></is></c>`).join('') + '</row>').join('') + `</sheetData><autoFilter ref="A1:${last}"/></worksheet>`;
    return zip({
      '[Content_Types].xml': declaration + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
      '_rels/.rels': declaration + `<Relationships xmlns="${relationships}"><Relationship Id="rId1" Type="${office}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      'xl/workbook.xml': declaration + `<workbook xmlns="${spreadsheet}" xmlns:r="${office}"><sheets><sheet name="Data" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      'xl/_rels/workbook.xml.rels': declaration + `<Relationships xmlns="${relationships}"><Relationship Id="rId1" Type="${office}/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
      'xl/worksheets/sheet1.xml': sheet,
    });
  }
  const payload = document.getElementById('ikb-download-data');
  if (!payload) return;
  const status = document.querySelector('[data-download-status]');
  document.querySelectorAll('[data-download-format]').forEach(button => {
    button.addEventListener('click', () => {
      try {
        const scope = document.getElementById('download-scope')?.value || 'filtered';
        const data = JSON.parse(payload.textContent)[scope];
        if (!Array.isArray(data.headers) || !Array.isArray(data.rows) || !data.rows.length || data.rows.some(row => row.length !== data.headers.length)) throw new Error('Data tidak lengkap.');
        const rows = [data.headers, ...data.rows], format = button.dataset.downloadFormat;
        const blob = format === 'xlsx' ? xlsx(rows) : new Blob([csv(rows)], {type:'text/csv;charset=utf-8'});
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = String(data.name).replace(/[^a-z0-9_-]/gi, '-') + '.' + format;
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        if (status) status.textContent = `Unduhan ${format.toUpperCase()} disiapkan untuk ${data.rows.length} wilayah.`;
      } catch (error) {
        if (status) status.textContent = 'Unduhan gagal. Muat ulang halaman dan coba kembali.';
      }
    });
  });
})();
