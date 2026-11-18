// =========================================================
// NEXUS EDU-VENTURE — LOGIKA INTERAKTIF UTAMA (VANILLA JS)
// =========================================================

const state = {
  points: 1450,
  tier: 'Tingkat IV',
  co2Saved: 340,
  usersHelped: 1280,
  impactSeries: [190, 230, 275, 310, 340],
  totalFunding: 42500000
};

// Notifikasi Sistem
function notify(message) {
  const container = document.getElementById('toastContainer');
  const item = document.createElement('div');
  item.className = 'toast';
  item.textContent = message;
  container.appendChild(item);
  setTimeout(() => item.remove(), 3000);
}

// Pembaruan Poin Prestasi & Inovasi Siswa
function addReputation(pts, label) {
  state.points += pts;
  const tierNum = Math.min(10, Math.floor(state.points / 350) + 1);
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  state.tier = `Tingkat ${roman[tierNum - 1]}`;

  document.getElementById('navXP').textContent = `${state.points.toLocaleString('id-ID')} Poin`;
  document.getElementById('navLevel').textContent = state.tier;

  renderLeaderboard();
  notify(`+${pts} Poin Prestasi — ${label}`);
}

// Generator Hash SHA-256 Simulasi
function computeHash(payload) {
  let h1 = 0xdeadbeef ^ payload.length;
  let h2 = 0x41c6ce57 ^ payload.length;
  for (let i = 0, ch; i < payload.length; i++) {
    ch = payload.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `sha256:${hex1}${hex2}`;
}

// =========================================================
// NAVIGASI FILTER & TEMA TAMPILAN
// =========================================================
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.domain-section').forEach(sec => {
      if (filter === 'all' || sec.dataset.category === filter) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });
  });
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  drawImpactChart();
});

// =========================================================
// 00. LANDASAN PROGRAM & TAHAPAN PEMBINAAN SISWA
// =========================================================
const developmentStages = [
  {
    title: 'Tahap 1: Identifikasi & Pemetaan Potensi Bakat Siswa-Siswi',
    desc: 'Menggali minat dasar setiap siswa di bidang sains, rekayasa teknologi, seni kreatif, maupun komunikasi bisnis agar pembinaan berjalan tepat sasaran.',
    output: 'Output: Profil Bakat Siswa & Kelompok Minat Karya'
  },
  {
    title: 'Tahap 2: Eksplorasi Kreativitas & Perancangan Purwarupa',
    desc: 'Melatih siswa berpikir orisinal untuk mengubah permasalahan di lingkungan sekolah atau masyarakat menjadi rancangan konsep dan model 3D/purwarupa.',
    output: 'Output: Dokumentasi Konsep, Desain UI/3D & Purwarupa Awal'
  },
  {
    title: 'Tahap 3: Validasi Jiwa Inovasi & Pencapaian Prestasi',
    desc: 'Menguji efektivitas karya inovatif siswa melalui pameran, uji coba lapangan, serta keikutsertaan dalam ajang prestasi nasional (OPSI, FIKSI, LKS).',
    output: 'Output: Piagam Prestasi Terverifikasi & Metrik Dampak Nyata'
  },
  {
    title: 'Tahap 4: Hilirisasi Karya & Kemandirian Kewirausahaan',
    desc: 'Membentuk mentalitas wirausaha muda dengan menghitung kelayakan biaya produksi, mempresentasikan bisnis (pitching), dan memasarkan produk MVP.',
    output: 'Output: Unit Usaha Siswa Mandiri & Portofolio Siap Kerja/Kuliah'
  }
];

function renderStageDetail(index = 0) {
  const item = developmentStages[index];
  const box = document.getElementById('stageDetailBox');
  box.innerHTML = `
    <div style="max-width: 760px;">
      <strong style="display:block;font-size:14px;margin-bottom:4px;color:var(--text-primary)">${item.title}</strong>
      <span style="font-size:13px;color:var(--text-secondary)">${item.desc}</span>
    </div>
    <span class="status-badge badge-teal">${item.output}</span>
  `;
}
renderStageDetail(0);

document.querySelectorAll('.stage-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.stage-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderStageDetail(Number(tab.dataset.stage));
  });
});

// =========================================================
// 01. ETALASE KREATIVITAS
// =========================================================

// 1.1 Portofolio Imersif 3D & AR
const cube3D = document.getElementById('cube3D');
const rotX = document.getElementById('rotX');
const rotY = document.getElementById('rotY');
const viewport3D = document.getElementById('viewport3D');
const angleReadout = document.getElementById('angleReadout');

function syncCubeTransform() {
  const x = Math.round(rotX.value);
  const y = Math.round(rotY.value);
  cube3D.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  angleReadout.textContent = `X: ${x}° | Y: ${y}°`;
}

rotX.addEventListener('input', syncCubeTransform);
rotY.addEventListener('input', syncCubeTransform);

let dragging3D = false;
let lastX = 0;
let lastY = 0;

viewport3D.addEventListener('mousedown', (e) => {
  dragging3D = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener('mouseup', () => { dragging3D = false; });

window.addEventListener('mousemove', (e) => {
  if (!dragging3D) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;

  rotY.value = Math.max(-180, Math.min(180, Number(rotY.value) + dx * 0.75));
  rotX.value = Math.max(-180, Math.min(180, Number(rotX.value) - dy * 0.75));
  syncCubeTransform();
});

document.getElementById('toggleARBtn').addEventListener('click', () => {
  viewport3D.classList.toggle('ar-active');
  const active = viewport3D.classList.contains('ar-active');
  document.getElementById('arStatusText').textContent = active
    ? 'MODE: SIMULASI RUANG PAMERAN AR'
    : 'MODE: STUDIO PAMERAN 3D';
});

document.getElementById('modelPreset').addEventListener('change', (e) => {
  const faces = cube3D.querySelectorAll('.face');
  const materials = {
    slate: ['rgba(30, 41, 59, 0.85)', '#64748b'],
    indigo: ['rgba(49, 46, 129, 0.78)', '#818cf8'],
    teal: ['rgba(19, 78, 74, 0.82)', '#2dd4bf']
  };
  const [bg, border] = materials[e.target.value];
  faces.forEach(f => {
    f.style.background = bg;
    f.style.borderColor = border;
  });
});

// 1.2 Ideation & Prototyping Hub
function buildConceptArchitecture() {
  const title = document.getElementById('ideaInput').value.trim() || 'Karya Inovasi Siswa';
  const cat = document.getElementById('ideaCategory').value;

  const modules = {
    tech: ['Antarmuka Pengguna', 'Basis Data Sekolah', 'Sensor / Modul IoT', 'Laporan Otomatis'],
    eco: ['Pengumpulan Bahan Baku', 'Proses Pengolahan Ramah Lingkungan', 'Uji Laboratorium', 'Kemasan Produk'],
    creative: ['Riset Visual & Narasi', 'Pembuatan Aset 3D/Grafis', 'Media Interaktif', 'Publikasi Pameran']
  };

  const tokenPalettes = {
    tech: ['#1E293B', '#4F46E5', '#0D9488', '#64748B'],
    eco: ['#064E3B', '#0D9488', '#047857', '#475569'],
    creative: ['#1E1B4B', '#4338CA', '#0F766E', '#334155']
  };

  const nodeWrap = document.getElementById('mindmapNodes');
  nodeWrap.innerHTML = `<span class="arch-node root-node">${title}</span>`;
  modules[cat].forEach(m => {
    nodeWrap.innerHTML += `<span class="arch-node">${m}</span>`;
  });

  const swatchWrap = document.getElementById('moodboardColors');
  swatchWrap.innerHTML = tokenPalettes[cat]
    .map(hex => `<div class="swatch-item" style="background:${hex}">${hex}</div>`)
    .join('');

  const feasibility = 85 + (title.length % 12);
  document.getElementById('ideaScoreBox').innerHTML =
    `<strong>Skor Validasi Konsep: ${feasibility}/100</strong> — Gagasan memiliki nilai kebaruan dan siap dibuatkan purwarupa.`;
}

document.getElementById('generateIdeaBtn').addEventListener('click', () => {
  buildConceptArchitecture();
  addReputation(25, 'Pemetaan Konsep Karya Siswa');
});
buildConceptArchitecture();

// 1.3 Creative Asset Sandbox
const repoFiles = {
  code: `<section class="karya-siswa">\n  <h2>Purwarupa Alat Penyaring Udara</h2>\n  <p>Status Sensor: Aktif</p>\n</section>`,
  style: `:root {\n  --warna-utama: #4f46e5;\n  --warna-aksen: #0d9488;\n  --radius-kartu: 10px;\n}`,
  copy: `# Abstrak Karya Inovasi Siswa\nKarya ini bertujuan membantu pengelolaan sampah organik dan anorganik di lingkungan sekolah secara terukur.`
};

let currentFile = 'code';
const editorEl = document.getElementById('sandboxEditor');
editorEl.value = repoFiles.code;

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    repoFiles[currentFile] = editorEl.value;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFile = btn.dataset.tab;
    editorEl.value = repoFiles[currentFile];
  });
});

document.getElementById('simulatePeerBtn').addEventListener('click', () => {
  const stamp = new Date().toLocaleTimeString('id-ID');
  editorEl.value += `\n/* Pembaruan dari anggota tim pada ${stamp} */`;
  notify('Masukan anggota kelompok berhasil dimuat ke editor.');
});

document.getElementById('saveAssetBtn').addEventListener('click', () => {
  repoFiles[currentFile] = editorEl.value;
  const commitId = computeHash(editorEl.value + Date.now()).slice(7, 15);
  document.getElementById('snapshotLog').textContent =
    `Versi [${commitId}] berhasil disimpan pada ${new Date().toLocaleTimeString('id-ID')}.`;
  addReputation(30, 'Penyimpanan Aset Kolaborasi Tim');
});

// =========================================================
// 02. REKAM JEJAK PRESTASI
// =========================================================

// 2.1 Smart Digital Credentials
const credentialLedger = [
  {
    title: 'Juara 1 Festival Inovasi dan Kewirausahaan Siswa (FIKSI)',
    issuer: 'Pusat Prestasi Nasional',
    hash: 'sha256:9f8a4c21e7b104d2'
  },
  {
    title: 'Sertifikat Kompetensi Rekayasa Web & Karya Inovatif',
    issuer: 'Dewan Penguji Karya Ilmiah Remaja',
    hash: 'sha256:4b12d908a3c47e19'
  }
];

function renderCredentials() {
  const list = document.getElementById('credentialList');
  list.innerHTML = credentialLedger.map(item => `
    <div class="ledger-item">
      <span class="ledger-title">${item.title}</span>
      <span class="ledger-meta">Penerbit: ${item.issuer}</span>
      <span class="ledger-hash">${item.hash} • Terverifikasi</span>
    </div>
  `).join('');
}
renderCredentials();

document.getElementById('mintCertBtn').addEventListener('click', () => {
  const input = document.getElementById('newCertTitle');
  const title = input.value.trim();
  if (!title) return notify('Harap isi nama piagam atau prestasi siswa.');

  credentialLedger.unshift({
    title,
    issuer: 'Registri Sertifikasi Sekolah',
    hash: computeHash(title + Date.now())
  });
  input.value = '';
  renderCredentials();
  addReputation(75, 'Penerbitan Piagam Digital Terenkripsi');
});

document.getElementById('verifyHashBtn').addEventListener('click', () => {
  document.getElementById('verifyResult').textContent =
    `Verifikasi Selesai: ${credentialLedger.length} piagam siswa tervalidasi asli dan bebas pemalsuan.`;
  notify('Keaslian seluruh piagam digital berhasil diverifikasi.');
});

// 2.2 Milestone & Leaderboard
document.querySelectorAll('.task-row').forEach(row => {
  row.addEventListener('click', () => {
    if (row.classList.contains('claimed')) return;
    row.classList.add('claimed');
    const pts = parseInt(row.dataset.xp, 10);
    row.querySelector('.task-pts').textContent = 'Tercapai';
    addReputation(pts, 'Pencapaian Milestone Prestasi');
  });
});

function renderLeaderboard() {
  const entries = [
    { name: 'Alya Rahma — Tim Inovasi Lingkungan', pts: 1720, self: false },
    { name: 'Profil Anda — Pelajar Inovator', pts: state.points, self: true },
    { name: 'Dimas Prakoso — Tim Desain Produk 3D', pts: 1390, self: false },
    { name: 'Citra Lestari — Tim Wirausaha Muda', pts: 1180, self: false }
  ].sort((a, b) => b.pts - a.pts);

  const container = document.getElementById('leaderboardBox');
  container.innerHTML = entries.map((e, i) => `
    <div class="rank-row ${e.self ? 'active-user' : ''}">
      <span>0${i + 1}. ${e.name}</span>
      <span>${e.pts.toLocaleString('id-ID')} Poin</span>
    </div>
  `).join('');
}
renderLeaderboard();

// 2.3 Impact Telemetry Chart
function drawImpactChart() {
  const canvas = document.getElementById('impactCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const series = state.impactSeries;
  const maxVal = Math.max(...series, 420);
  const isLight = document.body.classList.contains('light-mode');

  ctx.strokeStyle = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    const gy = 20 + i * 30;
    ctx.beginPath();
    ctx.moveTo(16, gy);
    ctx.lineTo(canvas.width - 16, gy);
    ctx.stroke();
  }

  const barW = 38;
  const gap = 22;

  series.forEach((val, idx) => {
    const h = (val / maxVal) * 92;
    const x = 24 + idx * (barW + gap);
    const y = canvas.height - h - 24;

    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.roundRect(x, y, barW, h, 4);
    ctx.fill();

    ctx.fillStyle = isLight ? '#64748b' : '#94a3b8';
    ctx.font = '10.5px sans-serif';
    ctx.fillText(`Bln 0${idx + 1}`, x + 4, canvas.height - 8);

    ctx.fillStyle = isLight ? '#0f172a' : '#f1f5f9';
    ctx.font = '600 10.5px sans-serif';
    ctx.fillText(`${val}`, x + 9, y - 6);
  });
}
drawImpactChart();

document.getElementById('addImpactBtn').addEventListener('click', () => {
  state.co2Saved += 40;
  state.usersHelped += 145;
  state.impactSeries.shift();
  state.impactSeries.push(state.co2Saved);

  document.getElementById('impactCO2').textContent = `${state.co2Saved} kg`;
  document.getElementById('impactUsers').textContent = state.usersHelped.toLocaleString('id-ID');
  drawImpactChart();
  addReputation(45, 'Pencatatan Dampak Proyek Siswa');
});

// =========================================================
// 03. AKSELERATOR KEWIRAUSAHAAN
// =========================================================

// 3.1 Investor & Grant Directory + Pitch Timer
const investorDirectory = {
  edtech: [
    { name: 'Hibah Inkubasi Karya Digital Pelajar', thesis: 'Dana Pembinaan • Rp 5 Jt – 15 Jt', match: '96%' },
    { name: 'Akselerator EduTech Muda Nasional', thesis: 'Pendampingan Mentor & Server Cloud', match: '92%' }
  ],
  greentech: [
    { name: 'Program Sekolah Lestari & Ekonomi Sirkular', thesis: 'Hibah Alat Produksi Daur Ulang', match: '97%' },
    { name: 'Komunitas Mitra Lingkungan Indonesia', thesis: 'Dukungan Distribusi & Pameran', match: '91%' }
  ],
  saas: [
    { name: 'Dana Bergulir Koperasi & Alumni', thesis: 'Modal Kerja Awal • Tanpa Bunga', match: '95%' },
    { name: 'Mitra UMKM & Bazar Kreatif Kota', thesis: 'Fasilitas Etalase & Pemasaran', match: '89%' }
  ]
};

function renderInvestors() {
  const sector = document.getElementById('startupSector').value;
  const container = document.getElementById('investorMatches');
  container.innerHTML = investorDirectory[sector].map(inv => `
    <div class="dir-item">
      <div>
        <div class="ledger-title">${inv.name}</div>
        <div class="ledger-meta">${inv.thesis}</div>
      </div>
      <span class="dir-score">${inv.match} Sesuai</span>
    </div>
  `).join('');
}
renderInvestors();

document.getElementById('matchInvestorBtn').addEventListener('click', () => {
  renderInvestors();
  notify('Rekomendasi mitra pendanaan & hibah berhasil diperbarui.');
});

let pitchTimerId = null;
document.getElementById('startPitchBtn').addEventListener('click', (e) => {
  if (pitchTimerId) {
    clearInterval(pitchTimerId);
    pitchTimerId = null;
    e.target.textContent = 'Mulai Pitching';
    document.getElementById('pitchFeedback').textContent =
      'Latihan selesai. Penyampaian masalah, solusi inovatif, dan rencana usaha tercatat tepat waktu.';
    addReputation(50, 'Latihan Virtual Pitching Wirausaha');
    return;
  }

  let remaining = 60;
  e.target.textContent = 'Selesai';
  document.getElementById('pitchFeedback').textContent =
    'Waktu berjalan: Paparkan latar belakang masalah, keunggulan produk siswa, dan target pasar.';

  pitchTimerId = setInterval(() => {
    remaining--;
    document.getElementById('pitchTimer').textContent = `00:${String(remaining).padStart(2, '0')}`;
    if (remaining <= 0) {
      clearInterval(pitchTimerId);
      pitchTimerId = null;
      e.target.textContent = 'Mulai Pitching';
    }
  }, 1000);
});

// 3.2 MVP Crowdfunding
const campaigns = [
  { id: 1, title: 'Alat Penyiram Tanaman Otomatis Tenaga Surya', raised: 3750000, target: 5000000 },
  { id: 2, title: 'Sabun Kertas Organik Ekstrak Daun Sirih', raised: 2400000, target: 3000000 }
];

function renderCampaigns() {
  const box = document.getElementById('mvpList');
  box.innerHTML = campaigns.map(c => {
    const pct = Math.min(100, Math.round((c.raised / c.target) * 100));
    return `
      <div class="campaign-card">
        <div class="camp-row">
          <strong>${c.title}</strong>
          <span>${pct}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="camp-row" style="margin-bottom:0">
          <span class="ledger-meta">Terkumpul: Rp ${c.raised.toLocaleString('id-ID')}</span>
          <button class="btn btn-primary" style="padding:5px 10px;font-size:11.5px" onclick="commitMvpFund(${c.id})">+ Dukung Rp 100rb</button>
        </div>
      </div>
    `;
  }).join('');
}

window.commitMvpFund = function(id) {
  const item = campaigns.find(c => c.id === id);
  if (!item) return;
  item.raised += 100000;
  state.totalFunding += 100000;
  document.getElementById('heroStatDana').textContent =
    `Rp ${(state.totalFunding / 1000000).toFixed(2).replace('.', ',')} Jt`;
  renderCampaigns();
  addReputation(40, `Dukungan Produk Wirausaha Siswa`);
};

document.getElementById('addMvpBtn').addEventListener('click', () => {
  const input = document.getElementById('newMvpTitle');
  const title = input.value.trim();
  if (!title) return notify('Masukkan nama produk wirausaha siswa terlebih dahulu.');
  campaigns.unshift({ id: Date.now(), title, raised: 500000, target: 4000000 });
  input.value = '';
  renderCampaigns();
  addReputation(60, 'Pendaftaran Produk MVP Baru');
});
renderCampaigns();

// 3.3 Business Simulator Dashboard
function runFinancialModel() {
  const cost = Number(document.getElementById('simCost').value) || 0;
  const price = Number(document.getElementById('simPrice').value) || 0;
  const fixed = Number(document.getElementById('simFixed').value) || 0;
  const units = Number(document.getElementById('simUnits').value) || 0;

  const contribution = price - cost;
  const grossMarginPct = price > 0 ? ((contribution / price) * 100).toFixed(1) : 0;
  const revenue = price * units;
  const totalExpense = fixed + (cost * units);
  const netOperating = revenue - totalExpense;
  const bep = contribution > 0 ? `${Math.ceil(fixed / contribution)} Unit` : 'Harga Jual Terlalu Rendah';
  const recPrice = Math.round((cost * 1.75) / 500) * 500;

  document.getElementById('simResultBox').innerHTML = `
    <div class="fin-row">
      <span>Margin Keuntungan / Unit</span>
      <strong>Rp ${contribution.toLocaleString('id-ID')} (${grossMarginPct}%)</strong>
    </div>
    <div class="fin-row">
      <span>Titik Impas (BEP)</span>
      <strong>${bep}</strong>
    </div>
    <div class="fin-row">
      <span>Estimasi Laba Bersih / Bulan</span>
      <strong class="${netOperating >= 0 ? 'text-teal' : ''}">Rp ${netOperating.toLocaleString('id-ID')}</strong>
    </div>
    <div class="fin-row">
      <span>Saran Harga Jual Ideal</span>
      <strong>Rp ${recPrice.toLocaleString('id-ID')} / unit</strong>
    </div>
  `;
}

document.getElementById('runSimBtn').addEventListener('click', () => {
  runFinancialModel();
  addReputation(35, 'Simulasi Perhitungan Usaha');
});
runFinancialModel();

// =========================================================
// 04. KOMUNITAS & KOLABORASI
// =========================================================

// 4.1 Skill-Matching Partner Finder
const talentPool = [
  {
    name: 'Kevin Wijaya (Kelas XI - Rekayasa Perangkat Lunak)',
    role: 'Pemrograman Web & Mikrokontroler',
    compat: '97% Cocok',
    stack: ['HTML/CSS/JS', 'Arduino IoT', 'Logika Sistem']
  },
  {
    name: 'Sinta Maharani (Kelas XII - Pemasaran & Bisnis)',
    role: 'Perencanaan Bisnis & Presentasi Pitching',
    compat: '94% Cocok',
    stack: ['Riset Pasar', 'Public Speaking', 'Manajemen Keuangan']
  },
  {
    name: 'Rizky Pratama (Kelas XI - Desain Komunikasi Visual)',
    role: 'Desain Kemasan & Pemodelan 3D',
    compat: '92% Cocok',
    stack: ['Desain UI/UX', 'Ilustrasi Produk', 'Model 3D']
  }
];

let talentIdx = 0;
const connectedList = [];

function renderTalentCard() {
  const t = talentPool[talentIdx % talentPool.length];
  document.getElementById('cofounderCard').innerHTML = `
    <div class="prof-top">
      <div>
        <div class="ledger-title">${t.name}</div>
        <div class="ledger-meta">Fokus Keahlian: ${t.role}</div>
      </div>
      <span class="dir-score">${t.compat}</span>
    </div>
    <div class="stack-tags">
      ${t.stack.map(s => `<span class="stack-tag">${s}</span>`).join('')}
    </div>
  `;
}
renderTalentCard();

document.getElementById('skipPartnerBtn').addEventListener('click', () => {
  talentIdx++;
  renderTalentCard();
});

document.getElementById('connectPartnerBtn').addEventListener('click', () => {
  const person = talentPool[talentIdx % talentPool.length];
  const shortName = person.name.split(' (')[0];
  if (!connectedList.includes(shortName)) {
    connectedList.push(shortName);
    document.getElementById('matchedPartnersLog').textContent =
      `Rekan Terhubung (${connectedList.length}): ${connectedList.join(', ')}`;
    addReputation(40, `Kolaborasi Tim dengan ${shortName}`);
  }
  talentIdx++;
  renderTalentCard();
});

// 4.2 Opportunity Feed
const programs = [
  { title: 'Festival Inovasi dan Kewirausahaan Siswa Indonesia (FIKSI)', tag: 'bisnis', meta: 'Pendaftaran Dibuka • Kategori Rencana Usaha & Pengembangan' },
  { title: 'Olimpiade Penelitian Siswa Indonesia (OPSI) 2026', tag: 'web', meta: 'Bidang Sains Terapan & Rekayasa Teknologi' },
  { title: 'Pameran Karya Desain Produk & Inovasi Sekolah', tag: 'desain', meta: 'Seleksi Karya 3D, Kriya & Kemasan Ramah Lingkungan' },
  { title: 'Pelatihan Penyusunan Proposal Bisnis & HAKI Pelajar', tag: 'bisnis', meta: 'Webinar Akhir Pekan • Terbuka untuk Siswa SMA/SMK/MA' }
];

function renderOpportunities(tag = 'all') {
  const container = document.getElementById('opportunityFeed');
  const items = tag === 'all' ? programs : programs.filter(p => p.tag === tag);
  container.innerHTML = items.map(p => `
    <div class="feed-item">
      <div class="ledger-title">${p.title}</div>
      <div class="ledger-meta">${p.meta}</div>
    </div>
  `).join('');
}
renderOpportunities();

document.querySelectorAll('.pill-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderOpportunities(btn.dataset.tag);
  });
});

// 4.3 Mentorship Smart-Contract
const sessionLogs = [
  {
    mentor: 'Drs. Hendra Wijaya, M.Pd. — Pembina Kewirausahaan',
    goal: 'Validasi Harga Pokok Produksi & Strategi Pemasaran',
    hash: 'sha256:77c1a904e21b',
    completed: true
  }
];

function renderContracts() {
  const list = document.getElementById('contractList');
  list.innerHTML = sessionLogs.map((s, idx) => `
    <div class="ledger-item">
      <span class="ledger-title">${s.mentor}</span>
      <span class="ledger-meta">Target Capaian: ${s.goal}</span>
      <span class="ledger-hash">${s.hash} • Status: ${s.completed ? 'Tuntas' : 'Terjadwal'}</span>
      ${!s.completed ? `<div style="margin-top:6px"><button class="btn btn-secondary" style="padding:4px 9px;font-size:11px" onclick="completeSession(${idx})">Tandai Selesai</button></div>` : ''}
    </div>
  `).join('');
}

window.completeSession = function(idx) {
  sessionLogs[idx].completed = true;
  renderContracts();
  addReputation(60, 'Penyelesaian Sesi Bimbingan Mentor');
};

document.getElementById('createContractBtn').addEventListener('click', () => {
  const mentor = document.getElementById('mentorSelect').value;
  const goalInput = document.getElementById('mentorGoal');
  const goal = goalInput.value.trim() || 'Review Purwarupa & Persiapan Presentasi Lomba';
  const hash = computeHash(mentor + goal).slice(0, 19);

  sessionLogs.unshift({ mentor, goal, hash, completed: false });
  goalInput.value = '';
  renderContracts();
  addReputation(35, 'Penjadwalan Kontrak Bimbingan');
});
renderContracts();