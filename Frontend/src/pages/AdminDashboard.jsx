import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
//  GLOBAL STYLES (injected once via <style> tag)
// ─────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  body, #root {
    font-family:'Sora',sans-serif;
    background:#191834;
    background-image:
      radial-gradient(ellipse 80% 60% at 100% 0%,#61bdaf44 0%,transparent 55%),
      radial-gradient(ellipse 60% 70% at 0% 100%,#338aca33 0%,transparent 55%),
      radial-gradient(ellipse 100% 80% at 100% 100%,#2b2c6844 0%,transparent 50%),
      linear-gradient(135deg,#191834 0%,#1e1f50 40%,#1a2a4a 70%,#191834 100%);
    background-attachment:fixed;
    color:#e6edf3;
    min-height:100vh;
  }

  body::before {
    content:''; position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(97,189,175,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(97,189,175,0.04) 1px,transparent 1px);
    background-size:40px 40px;
    pointer-events:none; z-index:0;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes toastIn { from{transform:translateY(80px);opacity:0} to{transform:translateY(0);opacity:1} }

  .dot-process { animation: blink 1.4s infinite; }
  .modal-animate { animation: slideUp .25s ease; }
  .toast-animate { animation: toastIn .35s cubic-bezier(.34,1.56,.64,1) forwards; }

  /* scrollbar */
  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(97,189,175,0.25); border-radius:3px; }

  /* status-select option bg fix */
  .js-select option { background:#1e1f50; }

  @media(max-width:700px){
    .hide-mobile { display:none !important; }
    .stats-grid-wrap { grid-template-columns:repeat(2,1fr) !important; }
    .detail-grid-wrap { grid-template-columns:1fr !important; }
    .page-title-big  { font-size:1.2rem !important; }
  }
`;

// ─────────────────────────────────────────────
//  DATA CONSTANTS
// ─────────────────────────────────────────────
const CATEGORIES  = ['Water Supply', 'Road', 'Electricity', 'Sanitation', 'Other'];
const LOCATION    = ['Arera Colony','MP Nagar','Bairagarh','Kolar Road','Bittan Market','Shahpura','Govindpura','Lalghati','New Market','Ayodhya Nagar','Habibganj','Kohefiza','Ashoka Garden','Chuna Bhatti','TT Nagar'];
const ADDRESS_MAP = {
  'Arera Colony':   ['Plot 12, Sector E-5, Arera Colony','House 7, Sector C-8, Arera Colony','Flat 3, Gulmohar Apts, Arera Colony'],
  'MP Nagar':       ['Shop 4, Zone-1, MP Nagar','B-wing, Prestige Plaza, MP Nagar','15, Zone-2 Main Road, MP Nagar'],
  'Bairagarh':      ['Nagar Palika Road, Ward 11, Bairagarh','Near Bus Stand, Bairagarh','Gram Panchayat Lane 3, Bairagarh'],
  'Kolar Road':     ['Plot 88, Kolar Road, Bhopal','Kolar Housing Colony, Sector B, Kolar Road','Near Kolar Dam Chowk, Kolar Road'],
  'Bittan Market':  ['Shop 22, Bittan Market Main Road','Bittan Market Residential Block C','Sai Nagar, Near Bittan Market'],
  'Shahpura':       ['Ward 5, Shahpura Colony, Bhopal','Near Shahpura Lake, House 14','Green Park Society, Shahpura'],
  'Govindpura':     ['Industrial Area, Sector 3, Govindpura','B-68, Govindpura Colony','Near BHEL Gate 2, Govindpura'],
  'Lalghati':       ['Lalghati Chowk, House 9, Bhopal','Near Lalghati Bus Stop, Ward 7','Shiv Nagar, Lalghati'],
  'New Market':     ['TT Nagar Road, New Market, Bhopal','Near City Mall, New Market','Palika Bazaar Block B, New Market'],
  'Ayodhya Nagar':  ['Plot 33, Sector A, Ayodhya Nagar','Near Ayodhya Bypass, Ward 9','Shanti Vihar Colony, Ayodhya Nagar'],
  'Habibganj':      ['Habibganj Railway Station Road, H-12','Nehru Nagar, Near Habibganj','Rani Kamlapati Area, Habibganj'],
  'Kohefiza':       ['Kohefiza Main Road, Plot 7','Bismillah Colony, Kohefiza','Near Kohefiza Masjid, Ward 14'],
  'Ashoka Garden':  ['Block A, Ashoka Garden, Bhopal','Near Ashoka Garden Park, House 21','Ram Nagar, Ashoka Garden'],
  'Chuna Bhatti':   ['Chuna Bhatti Kalan, House 5','Near Kali Mata Mandir, Chuna Bhatti','Railway Colony, Chuna Bhatti'],
  'TT Nagar':       ['TT Nagar Stadium Road, Plot 4','Near TT Nagar Police Station','Sector 9, TT Nagar, Bhopal'],
};
const NAMES       = ['Arjun Verma','Priya Sharma','Ravi Patel','Sunita Devi','Mohammad Khan','Lakshmi Rao','Deepak Gupta','Anita Singh','Rajesh Mishra','Kavita Joshi','Suresh Yadav','Meena Bai','Vikram Tiwari','Pooja Chouhan','Rahul Soni','Geeta Kaur','Anil Kumar','Rekha Dwivedi','Santosh Pandey','Nisha Malviya','Dhruv Agrawal','Suman Bhatt','Ramesh Prajapati','Usha Pillai','Hemant Shukla'];
const PRIORITIES  = ['High','High','Medium','Medium','Medium','Low','Low'];
const STATUSES    = ['Pending','In Process','Resolved'];
const OFFICERS    = ['Collector Office','PWD Bhopal','MP Electricity Board','Municipal Corp.','District Health Dept.','Education Dept.','Police HQ','Housing Board'];
const DESCS       = [
  'No water supply for the past 4 days in our colony. Residents are severely affected.',
  'Main road has a large pothole causing accidents. Immediate repair required.',
  'Power cuts lasting 8-10 hours daily making life difficult for elderly and patients.',
  'Garbage not collected for over a week. Unhygienic conditions near school.',
  'Primary health centre is closed without any notice for 5 days.',
  'Streetlights not working on main road since last month. Safety concern at night.',
  'Drainage is blocked causing overflow on the streets during rains.',
  'Illegal construction blocking public pathway. Local authorities not responding.',
  'Drinking water is contaminated. Multiple residents have fallen sick.',
  'School building has cracks and is unsafe for students. Urgent repair needed.',
];
const MEDIA_OPTIONS = ['','','','[Photo Attached]','[Voice Recording Attached]','[Photo + Voice Attached]'];

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
const randInt  = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const randFrom = arr    => arr[Math.floor(Math.random() * arr.length)];

function generateData() {
  const base = new Date(2026, 3, 1);
  return Array.from({ length: 25 }, (_, i) => {
    const d   = new Date(base.getTime() + i * 86400000 * randInt(0, 4));
    const loc = randFrom(LOCATION);
    return {
      id:       'GRV-2026-' + String(1000 + i).padStart(4, '0'),
      name:     NAMES[i % NAMES.length],
      phone:    '9' + String(randInt(600000000, 999999999)),
      category: randFrom(CATEGORIES),
      location: loc,
      address:  randFrom(ADDRESS_MAP[loc]) + ', Bhopal, MP',
      priority: randFrom(PRIORITIES),
      status:   randFrom(STATUSES),
      date:     d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
      dateRaw:  d.getTime(),
      assigned: randFrom(OFFICERS),
      desc:     randFrom(DESCS),
      media:    randFrom(MEDIA_OPTIONS),
    };
  });
}

function citizenMessage(s) {
  if (s === 'Pending')    return '⏳ Your grievance has been received and is awaiting assignment to the concerned department.';
  if (s === 'In Process') return '⚙️ Your grievance is currently being reviewed and actioned by the concerned department.';
  return '✅ Your grievance has been successfully resolved. Please verify and contact us if the issue persists.';
}

// ─────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────

function PriorityBadge({ p }) {
  if (p === 'High')   return <span style={s.badgeHigh}>🔴 High</span>;
  if (p === 'Medium') return <span style={s.badgeMedium}>🟡 Medium</span>;
  return <span style={s.badgeLow}>🟢 Low</span>;
}

function StatusBadge({ st }) {
  if (st === 'Pending')    return <span style={s.statusPending}><span style={s.dotPending} />{st}</span>;
  if (st === 'In Process') return <span style={s.statusProcess}><span style={{...s.dotBase, background:'#60a5fa'}} className="dot-process" />{st}</span>;
  return <span style={s.statusResolved}><span style={{...s.dotBase, background:'#6ee7b7'}} />{st}</span>;
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function AdminDashboard() {
  const [grievances,     setGrievances]     = useState(() => generateData());
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter,   setStatusFilter]   = useState('all');
  const [search,         setSearch]         = useState('');
  const [sortKey,        setSortKey]        = useState('date');
  const [sortDir,        setSortDir]        = useState(-1);
  const [modalId,        setModalId]        = useState(null);
  const [mStatusSel,     setMStatusSel]     = useState('Pending');
  const [mAssignInput,   setMAssignInput]   = useState('');
  const [toast,          setToast]          = useState(null);
  const [clock,          setClock]          = useState('');
  const toastTimer = useRef(null);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock('Bhopal Zone · ' + now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  // Inject global CSS once
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // ── Derived: filtered + sorted ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let arr = grievances.filter(g => {
      const matchP = priorityFilter === 'all' || g.priority === priorityFilter;
      const matchS = statusFilter   === 'all' || g.status   === statusFilter;
      const matchQ = !q
        || g.id.toLowerCase().includes(q)
        || g.name.toLowerCase().includes(q)
        || g.category.toLowerCase().includes(q)
        || g.location.toLowerCase().includes(q)
        || g.address.toLowerCase().includes(q);
      return matchP && matchS && matchQ;
    });
    arr.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'date') { av = a.dateRaw; bv = b.dateRaw; }
      if (typeof av === 'string') return sortDir * av.localeCompare(bv);
      return sortDir * (av - bv);
    });
    return arr;
  }, [grievances, priorityFilter, statusFilter, search, sortKey, sortDir]);

  // ── Stats ──
  const stats = useMemo(() => ({
    total:    grievances.length,
    high:     grievances.filter(g => g.priority === 'High').length,
    medium:   grievances.filter(g => g.priority === 'Medium').length,
    low:      grievances.filter(g => g.priority === 'Low').length,
    pending:  grievances.filter(g => g.status === 'Pending').length,
    process:  grievances.filter(g => g.status === 'In Process').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
  }), [grievances]);

  // ── Toast ──
  const showToast = useCallback((icon, msg) => {
    clearTimeout(toastTimer.current);
    setToast({ icon, msg });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  // ── Sort ──
  const handleSort = useCallback(key => {
    setSortDir(d => sortKey === key ? d * -1 : -1);
    setSortKey(key);
  }, [sortKey]);

  // ── Quick status update ──
  const quickUpdateStatus = useCallback((id, newStatus) => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, status: newStatus } : g));
    showToast('✅', `${id} → ${newStatus}`);
  }, [showToast]);

  // ── Modal ──
  const modalGrievance = modalId ? grievances.find(g => g.id === modalId) : null;
  const openModal = useCallback(id => {
    const g = grievances.find(g => g.id === id);
    if (!g) return;
    setMStatusSel(g.status);
    setMAssignInput(g.assigned);
    setModalId(id);
  }, [grievances]);
  const closeModal = useCallback(() => setModalId(null), []);
  const saveStatus = useCallback(() => {
    const g = grievances.find(g => g.id === modalId);
    if (!g) return;
    setGrievances(prev => prev.map(x => x.id === modalId ? { ...x, status: mStatusSel, assigned: mAssignInput || x.assigned } : x));
    showToast('📢', `Status updated · Citizen notified: ${mStatusSel}`);
    closeModal();
  }, [grievances, modalId, mStatusSel, mAssignInput, showToast, closeModal]);

  // ── Export CSV ──
  const exportCSV = useCallback(() => {
    const headers = ['ID','Citizen','Phone','Category','District','Full Address','Priority','Status','Date','Assigned To','Media'];
    const rows = grievances.map(g => [g.id, g.name, g.phone, g.category, g.location, `"${g.address}"`, g.priority, g.status, g.date, g.assigned, g.media || '']);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'JanSeva_Grievances.csv'; a.click();
    showToast('⬇', 'CSV exported successfully');
  }, [grievances, showToast]);

  // ── Filter button helper ──
  const PriorityBtn = ({ val, label, cls }) => {
    const isActive = priorityFilter === val;
    const base = { ...s.filterBtn };
    if (isActive) {
      if (val === 'all')    return <button style={{...base, ...s.filterBtnActive}} onClick={() => setPriorityFilter(val)}>{label}</button>;
      if (val === 'High')   return <button style={{...base, background:'rgba(239,68,68,.15)', border:'1px solid #ef4444', color:'#ef4444'}} onClick={() => setPriorityFilter(val)}>{label}</button>;
      if (val === 'Medium') return <button style={{...base, background:'rgba(245,158,11,.15)', border:'1px solid #f59e0b', color:'#f59e0b'}} onClick={() => setPriorityFilter(val)}>{label}</button>;
      if (val === 'Low')    return <button style={{...base, background:'rgba(16,185,129,.15)', border:'1px solid #10b981', color:'#10b981'}} onClick={() => setPriorityFilter(val)}>{label}</button>;
    }
    return <button style={base} onClick={() => setPriorityFilter(val)}>{label}</button>;
  };

  const StatusBtn = ({ val, label }) => {
    const isActive = statusFilter === val;
    return <button style={isActive ? {...s.filterBtn, ...s.filterBtnActive} : s.filterBtn} onClick={() => setStatusFilter(val)}>{label}</button>;
  };

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      {/* ── TOP NAV ── */}
      <nav style={s.topnav}>
        <div style={s.navBrand}>
          <div style={s.navIcon}>
            <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
              <rect x="4"  y="27" width="36" height="4" rx="2" fill="white" />
              <rect x="8"  y="19" width="28" height="4" rx="2" fill="white" />
              <rect x="13" y="11" width="18" height="4" rx="2" fill="white" />
              <rect x="2"  y="33" width="40" height="4" rx="2" fill="white" />
            </svg>
          </div>
          <div>
            <div style={s.navTitle}>JanSeva AI</div>
            <div style={s.navSub}>Grievance Management · MP Government</div>
          </div>
        </div>
        <div style={s.navRight}>
          <div style={s.adminBadge}>🏛️ ADMIN</div>
          <button style={s.logoutBtn} onClick={() => window.history.back()}>⬅ Back</button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div style={s.main}>

        {/* Page Header */}
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={s.pageLabel}>✦ Admin Control Panel</div>
          <div style={s.pageTitle} className="page-title-big">Grievance Management</div>
          <div style={s.pageSub}>{clock}</div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={s.statsGrid} className="stats-grid-wrap">
          {[
            { label:'Total Grievances', val:stats.total,    sub:'All submitted',       icon:'📋', accent:'#61bdaf', color:'#fff' },
            { label:'High Priority',    val:stats.high,     sub:'Urgent attention needed', icon:'🔴', accent:'#ef4444', color:'#fc8181' },
            { label:'Medium Priority',  val:stats.medium,   sub:'Monitor closely',     icon:'🟡', accent:'#f59e0b', color:'#fbbf24' },
            { label:'Low Priority',     val:stats.low,      sub:'Standard queue',      icon:'🟢', accent:'#10b981', color:'#6ee7b7' },
            { label:'Pending',          val:stats.pending,  sub:'Awaiting action',     icon:'⏳', accent:'#f59e0b', color:'#fbbf24' },
            { label:'In Process',       val:stats.process,  sub:'Currently handled',   icon:'⚙️', accent:'#338aca', color:'#60a5fa' },
            { label:'Resolved',         val:stats.resolved, sub:'Successfully closed', icon:'✅', accent:'#10b981', color:'#6ee7b7' },
          ].map(({ label, val, sub, icon, accent, color }) => (
            <div key={label} style={{ ...s.statCard, '--card-accent': accent }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:accent }} />
              <div style={s.statIcon}>{icon}</div>
              <div style={s.statLabel}>{label}</div>
              <div style={{ ...s.statVal, color }}>{val}</div>
              <div style={s.statSub}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── FILTERS BAR ── */}
        <div style={s.filtersBar}>
          <span style={s.filterLabel}>Priority:</span>
          <div style={s.filterGroup}>
            <PriorityBtn val="all"    label="All" />
            <PriorityBtn val="High"   label="🔴 High" />
            <PriorityBtn val="Medium" label="🟡 Medium" />
            <PriorityBtn val="Low"    label="🟢 Low" />
          </div>
          <span style={{ ...s.filterLabel, marginLeft:'.5rem' }}>Status:</span>
          <div style={s.filterGroup}>
            <StatusBtn val="all"        label="All" />
            <StatusBtn val="Pending"    label="⏳ Pending" />
            <StatusBtn val="In Process" label="⚙️ In Process" />
            <StatusBtn val="Resolved"   label="✅ Resolved" />
          </div>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              type="text"
              placeholder="Search by ID, name, category, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── GRIEVANCE TABLE ── */}
        <div style={s.tableCard}>
          <div style={s.tableHeader}>
            <div>
              <div style={s.tableHeading}>Grievance List</div>
              <div style={s.tableCount}>{filtered.length} grievance{filtered.length !== 1 ? 's' : ''} shown</div>
            </div>
            <button style={s.exportBtn} onClick={exportCSV}>⬇ Export CSV</button>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(255,255,255,0.04)' }}>
                  {[
                    ['id',       'ID ↕',       false],
                    ['name',     'Citizen',     false],
                    ['category', 'Category',   true],
                    ['location', 'Location',   true],
                    ['address',  'Address 📍', true],
                    ['priority', 'Priority ↕', false],
                    ['status',   'Status ↕',   false],
                    ['date',     'Date ↕',     true],
                    [null,       'Update',     false],
                    [null,       'Details',    false],
                  ].map(([key, label, hide], idx) => (
                    <th
                      key={idx}
                      style={s.th}
                      className={hide ? 'hide-mobile' : ''}
                      onClick={key ? () => handleSort(key) : undefined}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign:'center', padding:'2rem', color:'#7d8590', fontSize:'.85rem' }}>
                      No grievances match the current filters.
                    </td>
                  </tr>
                ) : filtered.map(g => (
                  <tr key={g.id} style={s.tbodyTr}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(97,189,175,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <td style={s.td}><span style={s.gid}>{g.id}</span></td>
                    <td style={{ ...s.td, fontWeight:500 }}>{g.name}</td>
                    <td style={{ ...s.td, color:'#7d8590' }} className="hide-mobile">{g.category}</td>
                    <td style={{ ...s.td, color:'#7d8590' }} className="hide-mobile">{g.location}</td>
                    <td style={{ ...s.td, maxWidth:200 }} className="hide-mobile">
                      <div style={s.addrLocality}>📍 {g.location}</div>
                      <div style={s.addrFull}>{g.address}</div>
                    </td>
                    <td style={s.td}><PriorityBadge p={g.priority} /></td>
                    <td style={s.td}><StatusBadge st={g.status} /></td>
                    <td style={{ ...s.td, color:'#7d8590', fontSize:'.74rem' }} className="hide-mobile">{g.date}</td>
                    <td style={s.td}>
                      <select
                        className="js-select"
                        style={s.statusSelect}
                        value={g.status}
                        onChange={e => quickUpdateStatus(g.id, e.target.value)}
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="In Process">⚙️ In Process</option>
                        <option value="Resolved">✅ Resolved</option>
                      </select>
                    </td>
                    <td style={s.td}>
                      <button style={s.assignBtn} onClick={() => openModal(g.id)}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(97,189,175,.18)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(97,189,175,.08)'}
                      >
                        👁 View
                        {g.media && <div style={s.mediaTag}>{g.media}</div>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>{/* /main */}

      {/* ── MODAL ── */}
      {modalGrievance && (
        <div
          style={s.modalBg}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={s.modal} className="modal-animate">
            {/* Modal Head */}
            <div style={s.modalHead}>
              <div>
                <div style={{ fontSize:'.65rem', fontWeight:700, color:'#61bdaf', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:'.3rem' }}>
                  Grievance Detail
                </div>
                <div style={{ fontSize:'1.05rem', fontWeight:700, color:'#fff' }}>{modalGrievance.category}</div>
                <div style={{ fontSize:'.75rem', color:'#7d8590', marginTop:'.2rem' }}>{modalGrievance.id}</div>
              </div>
              <button style={s.modalClose} onClick={closeModal}
                onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#61bdaf'; }}
                onMouseLeave={e => { e.currentTarget.style.color='#7d8590'; e.currentTarget.style.borderColor='rgba(97,189,175,0.30)'; }}
              >✕</button>
            </div>

            {/* Modal Body */}
            <div style={s.modalBody}>
              {/* Detail Grid */}
              <div style={s.detailGrid} className="detail-grid-wrap">
                {[
                  ['Citizen Name', modalGrievance.name,     null],
                  ['Phone',        modalGrievance.phone,    null],
                  ['Category',     modalGrievance.category, null],
                  ['Location',     modalGrievance.location, null],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={s.detailLabel}>{label}</div>
                    <div style={s.detailVal}>{val}</div>
                  </div>
                ))}
                {/* Full address — spans both cols */}
                <div style={{ gridColumn:'1/-1' }}>
                  <div style={s.detailLabel}>Full Address</div>
                  <div style={{ ...s.detailVal, color:'#61bdaf', fontSize:'.78rem' }}>{modalGrievance.address}</div>
                </div>
                {[
                  ['Priority',  <PriorityBadge key="p" p={modalGrievance.priority} />],
                  ['Date Filed', modalGrievance.date],
                  ['Assigned To', modalGrievance.assigned],
                  ['Current Status', <StatusBadge key="s" st={modalGrievance.status} />],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={s.detailLabel}>{label}</div>
                    <div style={s.detailVal}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{ fontSize:'.7rem', fontWeight:700, color:'#7d8590', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'.5rem' }}>Description</div>
              <div style={s.detailDesc}>{modalGrievance.desc}</div>

              {/* Citizen-visible status */}
              <div style={{ background:'rgba(97,189,175,0.07)', border:'1px solid rgba(97,189,175,0.18)', borderRadius:10, padding:'.85rem 1rem', marginBottom:'1rem' }}>
                <div style={{ fontSize:'.68rem', fontWeight:700, color:'#61bdaf', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'.4rem' }}>
                  📢 Status Visible to Citizen
                </div>
                <div style={{ fontSize:'.82rem', color:'#e6edf3' }}>{citizenMessage(mStatusSel)}</div>
              </div>

              {/* Modal Actions */}
              <div style={s.modalActions}>
                <select
                  className="js-select"
                  style={s.modalStatusSelect}
                  value={mStatusSel}
                  onChange={e => setMStatusSel(e.target.value)}
                >
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Process">⚙️ In Process</option>
                  <option value="Resolved">✅ Resolved</option>
                </select>
                <input
                  type="text"
                  placeholder="Assign to officer..."
                  value={mAssignInput}
                  onChange={e => setMAssignInput(e.target.value)}
                  style={s.assignInput}
                />
                <button style={s.modalSaveBtn} onClick={saveStatus}
                  onMouseEnter={e => e.currentTarget.style.opacity='.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}
                >
                  💾 Save &amp; Notify Citizen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={s.toast} className="toast-animate">
          <div style={{ fontSize:'1.1rem' }}>{toast.icon}</div>
          <div style={s.toastMsg}>{toast.msg}</div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
//  STYLE OBJECTS  (all hex codes preserved exactly)
// ─────────────────────────────────────────────
const s = {
  topnav: {
    position:'sticky', top:0, zIndex:100,
    background:'rgba(15,18,50,0.85)',
    backdropFilter:'blur(18px)',
    borderBottom:'1px solid rgba(97,189,175,0.18)',
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'.85rem 1.5rem', gap:'1rem',
  },
  navBrand: { display:'flex', alignItems:'center', gap:'.6rem' },
  navIcon: {
    width:36, height:36,
    background:'linear-gradient(135deg,#338aca,#61bdaf)',
    borderRadius:9,
    display:'flex', alignItems:'center', justifyContent:'center',
  },
  navTitle: { fontSize:'.95rem', fontWeight:700, color:'#fff' },
  navSub:   { fontSize:'.68rem', color:'#7d8590' },
  navRight: { display:'flex', alignItems:'center', gap:'.75rem' },
  adminBadge: {
    padding:'.25rem .7rem', borderRadius:20,
    background:'rgba(97,189,175,0.12)',
    border:'1px solid rgba(97,189,175,0.3)',
    fontSize:'.7rem', fontWeight:600, color:'#61bdaf', letterSpacing:'.5px',
  },
  logoutBtn: {
    padding:'.35rem .9rem', borderRadius:8,
    border:'1px solid rgba(239,68,68,.4)',
    background:'rgba(239,68,68,.1)', color:'#f87171',
    fontSize:'.75rem', fontWeight:600,
    cursor:'pointer', fontFamily:'inherit',
  },

  main: { position:'relative', zIndex:1, padding:'1.5rem 1.5rem 3rem', maxWidth:1300, margin:'0 auto' },

  pageLabel: { fontSize:'.7rem', fontWeight:700, color:'#61bdaf', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'.3rem' },
  pageTitle: { fontSize:'1.6rem', fontWeight:700, color:'#fff', marginBottom:'.2rem' },
  pageSub:   { fontSize:'.8rem', color:'#7d8590' },

  statsGrid: {
    display:'grid',
    gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',
    gap:'1rem', marginBottom:'1.5rem',
  },
  statCard: {
    background:'rgba(27,28,70,0.82)',
    border:'1px solid rgba(97,189,175,0.18)',
    borderRadius:14,
    padding:'1rem 1.2rem',
    position:'relative', overflow:'hidden',
  },
  statLabel: { fontSize:'.68rem', fontWeight:600, color:'#7d8590', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'.4rem' },
  statVal:   { fontSize:'1.8rem', fontWeight:700, lineHeight:1, marginBottom:'.3rem' },
  statSub:   { fontSize:'.7rem', color:'#7d8590' },
  statIcon:  { position:'absolute', right:'1rem', top:'1rem', fontSize:'1.4rem', opacity:.5 },

  filtersBar: {
    background:'rgba(27,28,70,0.82)',
    border:'1px solid rgba(97,189,175,0.18)',
    borderRadius:14,
    padding:'.9rem 1.2rem',
    display:'flex', flexWrap:'wrap', alignItems:'center', gap:'.75rem',
    marginBottom:'1.25rem',
  },
  filterLabel: { fontSize:'.7rem', fontWeight:600, color:'#7d8590', textTransform:'uppercase', letterSpacing:'1px', whiteSpace:'nowrap' },
  filterGroup: { display:'flex', gap:'.4rem', flexWrap:'wrap' },
  filterBtn: {
    padding:'.3rem .75rem', borderRadius:20,
    border:'1px solid rgba(97,189,175,0.30)',
    background:'rgba(255,255,255,0.04)',
    color:'#7d8590', fontSize:'.75rem', fontWeight:600,
    cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap',
  },
  filterBtnActive: {
    background:'rgba(97,189,175,0.15)', borderColor:'#61bdaf', color:'#61bdaf',
  },
  searchWrap:  { flex:1, minWidth:160, position:'relative' },
  searchIcon:  { position:'absolute', left:'.65rem', top:'50%', transform:'translateY(-50%)', fontSize:'.85rem', color:'#7d8590' },
  searchInput: {
    width:'100%', padding:'.45rem .85rem .45rem 2rem',
    borderRadius:20, border:'1px solid rgba(97,189,175,0.30)',
    background:'rgba(255,255,255,0.05)', color:'#e6edf3',
    fontSize:'.8rem', fontFamily:'inherit', outline:'none',
  },

  tableCard:    { background:'rgba(27,28,70,0.82)', border:'1px solid rgba(97,189,175,0.18)', borderRadius:16, overflow:'hidden', marginBottom:'1.5rem' },
  tableHeader:  { padding:'.9rem 1.2rem', borderBottom:'1px solid rgba(97,189,175,0.18)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'.75rem', flexWrap:'wrap' },
  tableHeading: { fontSize:'.85rem', fontWeight:700, color:'#fff' },
  tableCount:   { fontSize:'.75rem', color:'#7d8590' },
  exportBtn: {
    padding:'.35rem .9rem', borderRadius:8,
    border:'1px solid rgba(97,189,175,0.30)', background:'rgba(255,255,255,0.05)',
    color:'#61bdaf', fontSize:'.75rem', fontWeight:600,
    cursor:'pointer', fontFamily:'inherit',
  },

  th: {
    padding:'.75rem 1rem', textAlign:'left',
    fontSize:'.7rem', fontWeight:700, color:'#7d8590',
    textTransform:'uppercase', letterSpacing:'.8px',
    whiteSpace:'nowrap', cursor:'pointer', userSelect:'none',
    borderBottom:'1px solid rgba(97,189,175,0.18)',
  },
  td: {
    padding:'.85rem 1rem',
    fontSize:'.8rem', color:'#e6edf3',
    borderBottom:'1px solid rgba(97,189,175,0.07)',
    verticalAlign:'middle',
  },
  tbodyTr: { transition:'background .15s' },

  gid:          { fontFamily:'monospace', fontSize:'.75rem', color:'#61bdaf', fontWeight:600 },
  addrLocality: { fontSize:'.72rem', fontWeight:600, color:'#61bdaf', marginBottom:'.18rem' },
  addrFull:     { fontSize:'.68rem', color:'#7d8590', lineHeight:1.4, whiteSpace:'normal' },

  // badge base
  badgeBase: { display:'inline-block', padding:'.2rem .6rem', borderRadius:20, fontSize:'.68rem', fontWeight:700, letterSpacing:'.3px', whiteSpace:'nowrap' },
  badgeHigh:   { display:'inline-block', padding:'.2rem .6rem', borderRadius:20, fontSize:'.68rem', fontWeight:700, letterSpacing:'.3px', whiteSpace:'nowrap', background:'rgba(239,68,68,.18)', color:'#fc8181', border:'1px solid rgba(239,68,68,.3)' },
  badgeMedium: { display:'inline-block', padding:'.2rem .6rem', borderRadius:20, fontSize:'.68rem', fontWeight:700, letterSpacing:'.3px', whiteSpace:'nowrap', background:'rgba(245,158,11,.15)', color:'#fbbf24', border:'1px solid rgba(245,158,11,.3)' },
  badgeLow:    { display:'inline-block', padding:'.2rem .6rem', borderRadius:20, fontSize:'.68rem', fontWeight:700, letterSpacing:'.3px', whiteSpace:'nowrap', background:'rgba(16,185,129,.15)', color:'#6ee7b7', border:'1px solid rgba(16,185,129,.3)' },

  // status badge base
  statusBase:     { display:'inline-flex', alignItems:'center', gap:'.35rem', padding:'.22rem .7rem', borderRadius:20, fontSize:'.7rem', fontWeight:700, whiteSpace:'nowrap' },
  statusPending:  { display:'inline-flex', alignItems:'center', gap:'.35rem', padding:'.22rem .7rem', borderRadius:20, fontSize:'.7rem', fontWeight:700, whiteSpace:'nowrap', background:'rgba(245,158,11,.12)', color:'#fbbf24', border:'1px solid rgba(245,158,11,.25)' },
  statusProcess:  { display:'inline-flex', alignItems:'center', gap:'.35rem', padding:'.22rem .7rem', borderRadius:20, fontSize:'.7rem', fontWeight:700, whiteSpace:'nowrap', background:'rgba(51,138,202,.15)', color:'#60a5fa', border:'1px solid rgba(51,138,202,.3)' },
  statusResolved: { display:'inline-flex', alignItems:'center', gap:'.35rem', padding:'.22rem .7rem', borderRadius:20, fontSize:'.7rem', fontWeight:700, whiteSpace:'nowrap', background:'rgba(16,185,129,.13)', color:'#6ee7b7', border:'1px solid rgba(16,185,129,.28)' },
  dotBase:    { width:6, height:6, borderRadius:'50%', flexShrink:0 },
  dotPending: { width:6, height:6, borderRadius:'50%', flexShrink:0, background:'#fbbf24' },

  statusSelect: {
    padding:'.25rem .5rem', borderRadius:7,
    border:'1px solid rgba(97,189,175,0.30)',
    background:'rgba(255,255,255,0.06)',
    color:'#e6edf3', fontSize:'.72rem',
    fontFamily:'inherit', outline:'none', cursor:'pointer',
  },
  assignBtn: {
    padding:'.25rem .6rem', borderRadius:7,
    border:'1px solid rgba(97,189,175,.3)',
    background:'rgba(97,189,175,.08)', color:'#61bdaf',
    fontSize:'.7rem', fontWeight:600,
    cursor:'pointer', fontFamily:'inherit',
    textAlign:'center', lineHeight:1.4,
  },
  mediaTag: { fontSize:'.58rem', marginTop:'.2rem', color:'#61bdaf', fontWeight:600 },

  // Modal
  modalBg: {
    display:'flex', position:'fixed', inset:0, zIndex:500,
    background:'rgba(10,10,30,.75)', backdropFilter:'blur(6px)',
    alignItems:'center', justifyContent:'center', padding:'1rem',
  },
  modal: {
    background:'linear-gradient(145deg,rgba(27,28,70,0.98),rgba(20,22,60,0.98))',
    border:'1px solid rgba(97,189,175,0.30)',
    borderRadius:20, width:'100%', maxWidth:580,
    maxHeight:'90vh', overflowY:'auto',
    boxShadow:'0 30px 80px rgba(0,0,0,.6)',
  },
  modalHead: {
    padding:'1.25rem 1.5rem',
    borderBottom:'1px solid rgba(97,189,175,0.18)',
    display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem',
  },
  modalClose: {
    width:32, height:32, borderRadius:'50%',
    border:'1px solid rgba(97,189,175,0.30)', background:'rgba(255,255,255,0.06)',
    color:'#7d8590', fontSize:'1rem', cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center',
    flexShrink:0,
  },
  modalBody: { padding:'1.25rem 1.5rem' },
  detailGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.85rem', marginBottom:'1rem' },
  detailLabel: { fontSize:'.65rem', fontWeight:700, color:'#7d8590', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'.25rem' },
  detailVal:   { fontSize:'.82rem', color:'#e6edf3', fontWeight:500 },
  detailDesc:  { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(97,189,175,0.18)', borderRadius:10, padding:'.85rem 1rem', fontSize:'.82rem', color:'#e6edf3', lineHeight:1.6, marginBottom:'1rem' },
  modalActions: { display:'flex', gap:'.75rem', flexWrap:'wrap', paddingTop:'1rem', borderTop:'1px solid rgba(97,189,175,0.18)' },
  modalStatusSelect: {
    flex:1, minWidth:140,
    padding:'.55rem .85rem', borderRadius:9,
    border:'1px solid rgba(97,189,175,0.30)',
    background:'rgba(255,255,255,0.07)', color:'#e6edf3',
    fontSize:'.82rem', fontFamily:'inherit', outline:'none', cursor:'pointer',
  },
  assignInput: {
    flex:1, minWidth:130, padding:'.55rem .85rem', borderRadius:9,
    border:'1px solid rgba(97,189,175,0.30)', background:'rgba(255,255,255,0.07)',
    color:'#e6edf3', fontSize:'.82rem', fontFamily:'inherit', outline:'none',
  },
  modalSaveBtn: {
    padding:'.55rem 1.25rem', borderRadius:9, border:'none',
    background:'linear-gradient(135deg,#61bdaf,#338aca)',
    color:'#fff', fontSize:'.82rem', fontWeight:700,
    cursor:'pointer', fontFamily:'inherit',
  },

  // Toast
  toast: {
    position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:999,
    background:'rgba(16,185,129,.15)', border:'1px solid rgba(16,185,129,.4)',
    borderRadius:12, padding:'.75rem 1.2rem',
    display:'flex', alignItems:'center', gap:'.75rem',
    backdropFilter:'blur(12px)',
  },
  toastMsg: { fontSize:'.82rem', fontWeight:600, color:'#6ee7b7' },
};
