import React, { useState, useMemo, useEffect } from 'react';

// Iconos integrados en SVG para no depender de librerías externas ni marcar errores de instalación
const IconTicket = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/></svg>;
const IconDices = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="12" height="12" x="2" y="10" rx="2"/><rect width="12" height="12" x="10" y="2" rx="2"/><path d="m17.92 14 3.5-3.5"/><path d="M8.5 8.5 5 12"/></svg>;
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconSettings = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconDownload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconUpload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const IconTrophy = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>;
const IconDollar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IconClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default function App() {
  const [dbInstance, setDbInstance] = useState(null);
  const [appId] = useState(() => typeof __app_id !== 'undefined' ? __app_id : 'rifa-app-default');

  // Cargar Firebase de forma asíncrona mediante scripts para evitar 'Dynamic require' en Vite/Bundlers
  useEffect(() => {
    let isMounted = true;
    const loadFirebase = async () => {
      if (window.firebase) {
        initFirebaseApp();
        return;
      }

      const loadScript = (src) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });

      try {
        await loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
        await loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js");
        await loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js");
        if (isMounted) {
          initFirebaseApp();
        }
      } catch (err) {
        console.warn("Firebase no se pudo cargar dinámicamente, usando persistencia local:", err);
      }
    };

    const initFirebaseApp = () => {
      try {
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
          apiKey: "demo-key",
          authDomain: "demo.firebaseapp.com",
          projectId: "demo-project",
          storageBucket: "demo.appspot.com",
          messagingSenderId: "1234567",
          appId: "1:1234567:web:demo"
        };

        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig);
        }
        
        window.firebase.auth().signInAnonymously().catch(e => console.log("Auth anon:", e));
        setDbInstance(window.firebase.firestore());
      } catch (e) {
        console.error("Error al inicializar Firebase Compat:", e);
      }
    };

    loadFirebase();
    return () => { isMounted = false; };
  }, []);

  // Estados cargados desde almacenamiento / nube
  const [totalTicketsCount, setTotalTicketsCount] = useState(() => {
    const saved = localStorage.getItem('raffle_total');
    return saved ? parseInt(saved) : 100;
  });
  const [ticketPrice, setTicketPrice] = useState(() => {
    const saved = localStorage.getItem('raffle_price');
    return saved ? parseInt(saved) : 100;
  });
  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem('raffle_prizes');
    return saved ? JSON.parse(saved) : ['Laptop Gamer', 'Smartphone', '$1,000 MXN'];
  });
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('raffle_tickets');
    return saved ? JSON.parse(saved) : {};
  });
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('raffle_users');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Super Admin', role: 'admin' },
      { id: '2', name: 'Vendedor Juan', role: 'seller' },
      { id: '3', name: 'Vendedora Maria', role: 'seller' }
    ];
  });
  const [currentUser, setCurrentUser] = useState({ id: '1', name: 'Super Admin', role: 'admin' });
  const [winnersList, setWinnersList] = useState(() => {
    const saved = localStorage.getItem('raffle_winners');
    return saved ? JSON.parse(saved) : [];
  });
  const [discardedTicketsList, setDiscardedTicketsList] = useState(() => {
    const saved = localStorage.getItem('raffle_discarded');
    return saved ? JSON.parse(saved) : [];
  });
  const [includeReservedInDraw, setIncludeReservedInDraw] = useState(false);

  // Escuchar cambios en la Nube (Firestore) en tiempo real si está activo
  useEffect(() => {
    if (!dbInstance) return;

    const docRef = dbInstance.collection('artifacts').doc(appId).collection('public').doc('data').collection('raffle_state').doc('main');

    const unsubscribe = docRef.onSnapshot((docSnap) => {
      if (docSnap.exists) {
        const data = docSnap.data();
        if (data.totalTicketsCount !== undefined) setTotalTicketsCount(data.totalTicketsCount);
        if (data.ticketPrice !== undefined) setTicketPrice(data.ticketPrice);
        if (data.prizes) setPrizes(data.prizes);
        if (data.tickets) setTickets(data.tickets);
        if (data.usersList) setUsersList(data.usersList);
        if (data.winnersList) setWinnersList(data.winnersList);
        if (data.discardedTicketsList) setDiscardedTicketsList(data.discardedTicketsList);
        if (data.includeReservedInDraw !== undefined) setIncludeReservedInDraw(data.includeReservedInDraw);
      }
    }, (error) => {
      console.log("Sincronización en la nube lista.");
    });

    return () => unsubscribe();
  }, [dbInstance, appId]);

  // Guardar en la nube y persistencia local
  const saveStateToCloud = (updates) => {
    if (dbInstance) {
      try {
        const docRef = dbInstance.collection('artifacts').doc(appId).collection('public').doc('data').collection('raffle_state').doc('main');
        docRef.set(updates, { merge: true }).catch(err => console.log("Guardando localmente...", err));
      } catch (err) {
        console.warn("Cloud save catch fallback:", err);
      }
    }
  };

  // Guardar en localStorage automáticamente ante cambios
  useEffect(() => {
    localStorage.setItem('raffle_tickets', JSON.stringify(tickets));
    localStorage.setItem('raffle_total', totalTicketsCount.toString());
    localStorage.setItem('raffle_price', ticketPrice.toString());
    localStorage.setItem('raffle_prizes', JSON.stringify(prizes));
    localStorage.setItem('raffle_users', JSON.stringify(usersList));
    localStorage.setItem('raffle_winners', JSON.stringify(winnersList));
    localStorage.setItem('raffle_discarded', JSON.stringify(discardedTicketsList));
  }, [tickets, totalTicketsCount, ticketPrice, prizes, usersList, winnersList, discardedTicketsList]);

  // Estados UI y Modales
  const [activeTab, setActiveTab] = useState('tickets');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketNum, setSelectedTicketNum] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [soldBy, setSoldBy] = useState('');
  const [ticketStatus, setTicketStatus] = useState('reserved');
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('seller');
  const [isDrawing, setIsDrawing] = useState(false);
  const [animatedNumber, setAnimatedNumber] = useState(null);
  const [lastEliminated, setLastEliminated] = useState(null);

  // Cálculos estadísticos calculados de forma memoizada limpia
  const stats = useMemo(() => {
    let paidCount = 0;
    let reservedCount = 0;
    let totalCollected = 0;
    let pendingAmount = 0;

    Object.values(tickets).forEach((t) => {
      if (t.status === 'paid') {
        paidCount++;
        totalCollected += ticketPrice;
      } else if (t.status === 'reserved') {
        reservedCount++;
        pendingAmount += ticketPrice;
      }
    });

    const freeCount = Math.max(0, totalTicketsCount - paidCount - reservedCount);
    const goalTotal = totalTicketsCount * ticketPrice;

    return {
      paidCount,
      reservedCount,
      freeCount,
      totalCollected,
      pendingAmount,
      goalTotal
    };
  }, [tickets, totalTicketsCount, ticketPrice]);

  // Guardar datos de un boleto al editarlo
  const handleSaveTicket = (e) => {
    e.preventDefault();
    if (selectedTicketNum === null) return;

    let updatedTickets = { ...tickets };
    if (ticketStatus === 'free') {
      delete updatedTickets[selectedTicketNum];
    } else {
      updatedTickets[selectedTicketNum] = {
        buyerName: buyerName.trim() || 'Comprador',
        buyerPhone: buyerPhone.trim(),
        soldBy: soldBy.trim() || currentUser.name,
        status: ticketStatus,
        updatedAt: new Date().toISOString()
      };
    }
    setTickets(updatedTickets);
    saveStateToCloud({ tickets: updatedTickets });
    setSelectedTicketNum(null);
  };

  // Manejo de Sorteo de Ganadores (Último lugar -> ... -> 1er Lugar)
  const executeDraw = () => {
    if (winnersList.length >= prizes.length) {
      alert('¡Todos los premios ya han sido entregados!');
      return;
    }

    const eligibleTickets = Object.keys(tickets).filter(
      num => {
        const status = tickets[num].status;
        const isStatusAllowed = status === 'paid' || (includeReservedInDraw && status === 'reserved');
        return isStatusAllowed && 
          !winnersList.some(w => w.ticketNum === num) &&
          !discardedTicketsList.some(d => d.num === num);
      }
    );

    if (eligibleTickets.length === 0) {
      alert('No hay boletos elegibles para realizar el sorteo (verifica los filtros o si faltan boletos por pagar).');
      return;
    }

    setIsDrawing(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomDisplay = eligibleTickets[Math.floor(Math.random() * eligibleTickets.length)];
      setAnimatedNumber(randomDisplay);
      counter++;
      if (counter > 25) {
        clearInterval(interval);
        const winningNum = eligibleTickets[Math.floor(Math.random() * eligibleTickets.length)];
        setAnimatedNumber(winningNum);
        setIsDrawing(false);

        const reversedPrizes = [...prizes].reverse();
        const currentPrizeIndex = winnersList.length;
        const rawPrizeName = reversedPrizes[currentPrizeIndex] || `Premio #${prizes.length - currentPrizeIndex}`;
        const prizePlaceLabel = `Lugar ${prizes.length - currentPrizeIndex}`;
        const prizeToGive = `${prizePlaceLabel}: ${rawPrizeName}`;
        
        const winnerData = {
          ticketNum: winningNum,
          prize: prizeToGive,
          buyerName: tickets[winningNum].buyerName,
          soldBy: tickets[winningNum].soldBy
        };
        const updatedWinners = [...winnersList, winnerData];
        setWinnersList(updatedWinners);
        saveStateToCloud({ winnersList: updatedWinners });
      }
    }, 80);
  };

  // Función para Descartar/Eliminar un Boleto No Ganador (Modo Eliminatoria)
  const discardNonWinningTicket = () => {
    const eligibleTickets = Object.keys(tickets).filter(
      num => {
        const status = tickets[num].status;
        const isStatusAllowed = status === 'paid' || (includeReservedInDraw && status === 'reserved');
        return isStatusAllowed && 
          !winnersList.some(w => w.ticketNum === num) &&
          !discardedTicketsList.some(d => d.num === num);
      }
    );
    
    if (eligibleTickets.length === 0) {
      alert('No hay boletos elegibles para descartar.');
      return;
    }

    setIsDrawing(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomDisplay = eligibleTickets[Math.floor(Math.random() * eligibleTickets.length)];
      setAnimatedNumber(randomDisplay);
      counter++;
      if (counter > 25) {
        clearInterval(interval);
        const eliminatedNum = eligibleTickets[Math.floor(Math.random() * eligibleTickets.length)];
        const eliminatedBuyer = tickets[eliminatedNum]?.buyerName || 'Sin Nombre';
        
        setAnimatedNumber(eliminatedNum);
        setIsDrawing(false);

        const newItem = { num: eliminatedNum, buyer: eliminatedBuyer };
        setLastEliminated(newItem);

        const updatedDiscarded = [...discardedTicketsList, newItem];
        setDiscardedTicketsList(updatedDiscarded);
        saveStateToCloud({ discardedTicketsList: updatedDiscarded });
      }
    }, 80);
  };

  // Crear Usuario
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    const newUser = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      role: newUserRole
    };
    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);
    saveStateToCloud({ usersList: updatedUsers });
    setNewUserName('');
    setShowUserModal(false);
  };

  // Importar Boletos desde Archivo Excel / CSV / TXT
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    const processRows = (rows) => {
      try {
        let importedTickets = { ...tickets };
        let count = 0;

        rows.forEach((row, index) => {
          if (!row || row.length === 0) return;

          const cell0 = String(row[0] || '').trim();
          const cell1 = String(row[1] || '').trim();
          const cell2 = String(row[2] || '').trim();
          const cell3 = String(row[3] || '').trim();
          const cell4 = String(row[4] || '').trim();

          if (index === 0 && (cell0.toLowerCase().includes('boleto') || cell1.toLowerCase().includes('comprador') || cell1.toLowerCase().includes('estado'))) {
            return;
          }

          const num = parseInt(cell0);
          if (!isNaN(num) && num >= 1) {
            let status = 'reserved';
            const sLower = cell1.toLowerCase();
            if (sLower.includes('pagad') || sLower.includes('paid') || sLower.includes('si') || sLower.includes('1')) {
              status = 'paid';
            } else if (sLower.includes('libr') || sLower.includes('free') || sLower.includes('disponible')) {
              status = 'free';
            }

            if (status === 'free') {
              delete importedTickets[num];
            } else {
              importedTickets[num] = {
                buyerName: cell2 || 'Importado Excel',
                buyerPhone: cell3 || '',
                soldBy: cell4 || currentUser.name,
                status: status,
                updatedAt: new Date().toISOString()
              };
            }
            count++;
          }
        });

        setTickets(importedTickets);
        saveStateToCloud({ tickets: importedTickets });
        alert(`¡Éxito! Se actualizaron correctamente ${count} boletos desde tu Excel.`);
      } catch (err) {
        alert('Hubo un detalle al procesar la información del archivo.');
      }
    };

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const loadSheetJSAndRead = () => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = new Uint8Array(evt.target.result);
            const workbook = window.XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            processRows(rows);
          } catch (err) {
            alert('No se pudo leer el archivo de Excel. Asegúrate de que no esté protegido con contraseña.');
          }
        };
        reader.readAsArrayBuffer(file);
      };

      if (!window.XLSX) {
        const script = document.createElement('script');
        script.src = 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js';
        script.onload = loadSheetJSAndRead;
        script.onerror = () => alert('Error al cargar el lector de Excel. Comprueba tu conexión a internet.');
        document.head.appendChild(script);
      } else {
        loadSheetJSAndRead();
      }
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        const lines = text.split(/\r?\n/);
        const rows = lines.map(line => line.split(/[,;\t]/).map(s => s ? s.trim().replace(/^"|"$/g, '') : ''));
        processRows(rows);
      };
      reader.readAsText(file);
    }

    e.target.value = '';
  };

  // Exportar Boletos a formato CSV/Excel Completo
  const exportToCSV = () => {
    let csvContent = "\uFEFFBoleto,Estado,Comprador,Telefono,Vendedor,Monto Paid,Fecha Registro\n";
    for (let i = 1; i <= totalTicketsCount; i++) {
      const t = tickets[i];
      const statusStr = !t ? 'Libre' : t.status === 'paid' ? 'Pagado' : 'Apartado';
      const name = t?.buyerName || '';
      const phone = t?.buyerPhone || '';
      const seller = t?.soldBy || '';
      const amount = t?.status === 'paid' ? ticketPrice : 0;
      const date = t?.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : '';
      csvContent += `${i},${statusStr},"${name}","${phone}","${seller}",${amount},"${date}"\n`;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rifa_reporte_completo_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handlers para la gestión interactiva de premios
  const handlePrizeChange = (index, value) => {
    const updated = [...prizes];
    updated[index] = value;
    setPrizes(updated);
    saveStateToCloud({ prizes: updated });
  };

  const handleAddPrize = () => {
    const updated = [...prizes, `Nuevo Premio #${prizes.length + 1}`];
    setPrizes(updated);
    saveStateToCloud({ prizes: updated });
  };

  const handleRemovePrize = (index) => {
    if (prizes.length <= 1) {
      alert('Debe haber al menos 1 premio en la rifa.');
      return;
    }
    const updated = prizes.filter((_, i) => i !== index);
    setPrizes(updated);
    saveStateToCloud({ prizes: updated });
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '16px', color: '#1e293b' }}>
      
      {/* ESTILOS CSS UNIFICADOS */}
      <style>{`
        * { box-sizing: border-box; }
        .main-container { max-width: 1000px; margin: 0 auto; }
        .card { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .header-bar { padding: 16px 24px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; }
        .nav-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; font-size: 13px; transition: all 0.2s; }
        .nav-btn.active { background-color: #E61350; color: #ffffff; }
        .nav-btn.inactive { background-color: #f1f5f9; color: #475569; }
        .nav-btn.inactive:hover { background-color: #e2e8f0; }
        .grid-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px; }
        .stat-card { padding: 18px; display: flex; align-items: center; gap: 14px; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .stat-val { font-size: 20px; font-weight: 900; margin-top: 2px; }
        .search-bar { padding: 16px 20px; margin-bottom: 16px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; }
        .input-text { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13px; outline: none; width: 100%; }
        .input-text:focus { border-color: #E61350; }
        .filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid #cbd5e1; background: #ffffff; font-size: 12px; font-weight: 600; cursor: pointer; }
        .filter-btn.active { background: #E61350; color: white; border-color: #E61350; }
        .ticket-grid { padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(75px, 1fr)); gap: 10px; }
        .ticket-btn { padding: 12px 4px; border-radius: 12px; border: 2px solid transparent; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 65px; transition: transform 0.15s; }
        .ticket-btn:hover { transform: translateY(-2px); }
        .ticket-btn.free { background-color: #f8fafc; border-color: #e2e8f0; color: #334155; }
        .ticket-btn.reserved { background-color: #fef3c7; border-color: #f59e0b; color: #b45309; }
        .ticket-btn.paid { background-color: #d1fae5; border-color: #10b981; color: #047857; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 100; backdrop-filter: blur(2px); }
        .modal-box { background: white; padding: 24px; border-radius: 20px; max-width: 420px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .btn-primary { padding: 10px 18px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; background-color: #E61350; color: white; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
        .btn-secondary { padding: 10px 18px; border-radius: 10px; border: 1px solid #cbd5e1; font-weight: 700; cursor: pointer; background-color: #ffffff; color: #475569; font-size: 13px; }
      `}</style>

      <div className="main-container">
        
        {/* CABECERA Y SELECCIÓN DE ROL DE USUARIO */}
        <div className="card header-bar">
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🎟️</span>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>Control de Rifa Pro</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Guarda en vivo en todos tus dispositivos</span>
            </div>
          </div>

          {/* Selector de Usuario Activo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '6px 14px', borderRadius: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Usuario:</span>
            <select 
              value={currentUser.id} 
              onChange={(e) => {
                const selected = usersList.find(u => u.id === e.target.value);
                if (selected) setCurrentUser(selected);
              }}
              style={{ background: 'transparent', border: 'none', fontWeight: 'bold', fontSize: '13px', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
            >
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === 'admin' ? 'Super Admin' : 'Vendedor'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* NAVEGACIÓN PRINCIPAL ENTRE MÓDULOS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setActiveTab('tickets')} className={`nav-btn ${activeTab === 'tickets' ? 'active' : 'inactive'}`}>
            <IconTicket /> Boletos
          </button>
          <button onClick={() => setActiveTab('draw')} className={`nav-btn ${activeTab === 'draw' ? 'active' : 'inactive'}`}>
            <IconDices /> Sorteo / Ruleta
          </button>
          <button onClick={() => setActiveTab('users')} className={`nav-btn ${activeTab === 'users' ? 'active' : 'inactive'}`}>
            <IconUsers /> Usuarios / Vendedores
          </button>

          {currentUser.role === 'admin' && (
            <button onClick={() => setActiveTab('settings')} className={`nav-btn ${activeTab === 'settings' ? 'active' : 'inactive'}`}>
              <IconSettings /> Ajustes de Rifa
            </button>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconUpload /> Cargar Excel / CSV
              <input type="file" accept=".csv, .xlsx, .xls, .txt" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            
            <button onClick={exportToCSV} className="btn-secondary" title="Exportar a Excel / CSV">
              <IconDownload /> Exportar Excel
            </button>
          </div>
        </div>

        {/* MÓDULO 1: BOLETOS */}
        {activeTab === 'tickets' && (
          <>
            <div className="grid-stats">
              <div className="card stat-card">
                <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><IconDollar /></div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Total Recaudado</span>
                  <div className="stat-val" style={{ color: '#10b981' }}>${stats.totalCollected.toLocaleString()} MXN</div>
                  <span style={{ fontSize: '10px', color: '#059669' }}>{stats.paidCount} boletos pagados</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}><IconClock /></div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Por Cobrar</span>
                  <div className="stat-val" style={{ color: '#f59e0b' }}>${stats.pendingAmount.toLocaleString()} MXN</div>
                  <span style={{ fontSize: '10px', color: '#d97706' }}>{stats.reservedCount} boletos apartados</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-icon" style={{ background: '#f1f5f9', color: '#475569' }}><IconTicket /></div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Boletos Libres</span>
                  <div className="stat-val" style={{ color: '#334155' }}>{stats.freeCount}</div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>de {totalTicketsCount} disponibles</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-icon" style={{ background: '#fdf2f8', color: '#E61350' }}><IconTrophy /></div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Meta Total</span>
                  <div className="stat-val" style={{ color: '#E61350' }}>${stats.goalTotal.toLocaleString()} MXN</div>
                  <span style={{ fontSize: '10px', color: '#be185d' }}>Costo: ${ticketPrice} c/u</span>
                </div>
              </div>
            </div>

            <div className="card search-bar">
              <div style={{ flex: '1', minWidth: '220px' }}>
                <input 
                  type="text" 
                  placeholder="Buscar por # boleto, comprador o vendedor..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-text"
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => setFilterStatus('all')} className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}>Todos ({totalTicketsCount})</button>
                <button onClick={() => setFilterStatus('free')} className={`filter-btn ${filterStatus === 'free' ? 'active' : ''}`}>Libres ({stats.freeCount})</button>
                <button onClick={() => setFilterStatus('reserved')} className={`filter-btn ${filterStatus === 'reserved' ? 'active' : ''}`}>Apartados ({stats.reservedCount})</button>
                <button onClick={() => setFilterStatus('paid')} className={`filter-btn ${filterStatus === 'paid' ? 'active' : ''}`}>Pagados ({stats.paidCount})</button>
              </div>
            </div>

            <div className="card ticket-grid">
              {Array.from({ length: totalTicketsCount }, (_, i) => i + 1).map((num) => {
                const t = tickets[num];
                const status = t?.status || 'free';

                if (filterStatus !== 'all' && status !== filterStatus) return null;

                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase();
                  const matchNum = num.toString().includes(q);
                  const matchName = t?.buyerName?.toLowerCase().includes(q);
                  const matchSeller = t?.soldBy?.toLowerCase().includes(q);
                  if (!matchNum && !matchName && !matchSeller) return null;
                }

                return (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedTicketNum(num);
                      setBuyerName(t?.buyerName || '');
                      setBuyerPhone(t?.buyerPhone || '');
                      setSoldBy(t?.soldBy || currentUser.name);
                      setTicketStatus(t?.status || 'reserved');
                    }}
                    className={`ticket-btn ${status}`}
                  >
                    <span style={{ fontSize: '15px', fontWeight: '900' }}>#{num}</span>
                    <span style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', marginTop: '2px' }}>
                      {t ? t.buyerName : 'Libre'}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* MÓDULO 2: SORTEO Y RULETA */}
        {activeTab === 'draw' && (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '32px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '22px', color: '#0f172a' }}>🎲 Sorteo y Eliminatoria</h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>
              Descarta boletos para eliminarlos definitivamente antes de entregar los premios (del último lugar al 1er Lugar).
            </p>

            {/* CONTROL PARA INCLUIR/EXCLUIR BOLETOS APARTADOS */}
            <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
                🟡 Incluir boletos apartados (Por cobrar) en la rifa:
              </span>
              <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}>
                <input 
                  type="checkbox"
                  checked={includeReservedInDraw}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setIncludeReservedInDraw(val);
                    saveStateToCloud({ includeReservedInDraw: val });
                  }}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E61350' }}
                />
                <span style={{ fontSize: '12px', fontWeight: '800', color: includeReservedInDraw ? '#E61350' : '#64748b' }}>
                  {includeReservedInDraw ? 'SÍ (Pagados + Apartados)' : 'NO (Solo Pagados)'}
                </span>
              </label>
            </div>

            {/* RULETA Y ANIMACIÓN DE NÚMEROS */}
            <div style={{ margin: '24px 0', padding: '24px', background: '#0f172a', borderRadius: '20px', color: 'white', position: 'relative' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '8px' }}>
                {isDrawing ? 'Sorteando...' : 'Número Seleccionado'}
              </div>
              <div style={{ fontSize: '56px', fontWeight: '900', color: '#38bdf8', minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {animatedNumber ? `#${animatedNumber}` : '---'}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN DE RIFA Y DESCARTE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button 
                disabled={isDrawing} 
                onClick={discardNonWinningTicket} 
                className="btn-primary" 
                style={{ background: '#ef4444', justifyContent: 'center', padding: '12px', fontSize: '14px' }}
              >
                🔥 Descartar / Eliminar Boleto No Ganador
              </button>

              <button 
                disabled={isDrawing} 
                onClick={executeDraw} 
                className="btn-primary" 
                style={{ background: '#10b981', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
              >
                🏆 Sortear Ganador
              </button>
            </div>

            {/* VISOR DE BOLETOS ELIMINADOS */}
            {discardedTicketsList.length > 0 && (
              <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', padding: '14px', borderRadius: '14px', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', color: '#9b2c2c', fontWeight: '800' }}>
                    🔥 BOLETOS ELIMINADOS DE LA RIFA ({discardedTicketsList.length})
                  </h4>
                  <button 
                    onClick={() => {
                      if (window.confirm('¿Deseas restaurar todos los boletos eliminados para que puedan volver a jugar?')) {
                        setDiscardedTicketsList([]);
                        setLastEliminated(null);
                        saveStateToCloud({ discardedTicketsList: [] });
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#c53030', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Restaurar Eliminados
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                  {discardedTicketsList.map((item, index) => (
                    <span 
                      key={index} 
                      style={{ background: '#feb2b2', color: '#742a2a', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <s>#{item.num}</s> ({item.buyer})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* LISTA DE GANADORES */}
            {winnersList.length > 0 && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '16px', textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#166534', fontWeight: '800' }}>
                  🏆 LISTA DE GANADORES
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {winnersList.map((w, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '10px 14px', borderRadius: '10px', border: '1px solid #dcfce7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: '800', color: '#15803d', fontSize: '13px' }}>{w.prize}</span>
                        <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>
                          Boleto <strong>#{w.ticketNum}</strong> - {w.buyerName}
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Vend: {w.soldBy}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MÓDULO 3: VENDEDORES Y USUARIOS */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Gestión de Vendedores</h2>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Revisa la recaudación individual de cada miembro del equipo</p>
              </div>
              {currentUser.role === 'admin' && (
                <button onClick={() => setShowUserModal(true)} className="btn-primary">
                  + Registrar Nuevo Vendedor
                </button>
              )}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>Nombre</th>
                    <th style={{ padding: '12px' }}>Rol</th>
                    <th style={{ padding: '12px' }}>Boletos Vendidos (Pagados)</th>
                    <th style={{ padding: '12px' }}>Boletos Apartados</th>
                    <th style={{ padding: '12px' }}>Total Recaudado</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => {
                    let userPaidCount = 0;
                    let userReservedCount = 0;
                    Object.values(tickets).forEach(t => {
                      if (t.soldBy === u.name) {
                        if (t.status === 'paid') userPaidCount++;
                        if (t.status === 'reserved') userReservedCount++;
                      }
                    });
                    const userTotal = userPaidCount * ticketPrice;

                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.name}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', background: u.role === 'admin' ? '#fce7f3' : '#e0f2fe', color: u.role === 'admin' ? '#be185d' : '#0369a1' }}>
                            {u.role === 'admin' ? 'Super Admin' : 'Vendedor'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{userPaidCount}</td>
                        <td style={{ padding: '12px', color: '#f59e0b', fontWeight: 'bold' }}>{userReservedCount}</td>
                        <td style={{ padding: '12px', fontWeight: '900' }}>${userTotal.toLocaleString()} MXN</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MÓDULO 4: AJUSTES DE RIFA */}
        {activeTab === 'settings' && currentUser.role === 'admin' && (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '28px' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '20px', color: '#0f172a' }}>⚙️ Configuración General</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Total de Boletos en la Rifa:
                </label>
                <input 
                  type="number" 
                  value={totalTicketsCount} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setTotalTicketsCount(val);
                    saveStateToCloud({ totalTicketsCount: val });
                  }}
                  className="input-text"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Precio por Boleto (MXN):
                </label>
                <input 
                  type="number" 
                  value={ticketPrice} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTicketPrice(val);
                    saveStateToCloud({ ticketPrice: val });
                  }}
                  className="input-text"
                />
              </div>

              {/* GESTIÓN INDIVIDUAL DE PREMIOS */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>
                    🏆 Premios de la Rifa ({prizes.length})
                  </label>
                  <button onClick={handleAddPrize} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                    + Añadir Premio
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {prizes.map((prize, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', minWidth: '70px' }}>
                        {idx === 0 ? '1º Lugar:' : idx === 1 ? '2º Lugar:' : idx === 2 ? '3er Lugar:' : `${idx + 1}º Lugar:`}
                      </span>
                      <input 
                        type="text" 
                        value={prize} 
                        onChange={(e) => handlePrizeChange(idx, e.target.value)}
                        className="input-text"
                        placeholder="Nombre del premio..."
                      />
                      <button 
                        onClick={() => handleRemovePrize(idx)} 
                        style={{ border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        title="Eliminar este premio"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '10px' }}>
                <button 
                  onClick={() => {
                    if (window.confirm('¿Seguro que deseas reiniciar todos los boletos vendidos? Esta acción no se puede deshacer.')) {
                      setTickets({});
                      setWinnersList([]);
                      setDiscardedTicketsList([]);
                      saveStateToCloud({ tickets: {}, winnersList: [], discardedTicketsList: [] });
                    }
                  }}
                  className="btn-primary" 
                  style={{ background: '#ef4444', width: '100%', justifyContent: 'center' }}
                >
                  ⚠️ Reiniciar Rifa (Borrar Todos los Boletos)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL REGISTRO/EDICIÓN DE BOLETO */}
        {selectedTicketNum !== null && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: '#0f172a' }}>
                Editar Boleto #{selectedTicketNum}
              </h3>
              
              <form onSubmit={handleSaveTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Estado del Boleto:
                  </label>
                  <select 
                    value={ticketStatus} 
                    onChange={(e) => setTicketStatus(e.target.value)}
                    className="input-text"
                    style={{ fontWeight: 'bold' }}
                  >
                    <option value="free">Libre (Disponible)</option>
                    <option value="reserved">Apartado (Por cobrar)</option>
                    <option value="paid">Pagado (Confirmado)</option>
                  </select>
                </div>

                {ticketStatus !== 'free' && (
                  <>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Nombre del Comprador:
                      </label>
                      <input 
                        type="text" 
                        value={buyerName} 
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="input-text"
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Teléfono / WhatsApp:
                      </label>
                      <input 
                        type="text" 
                        value={buyerPhone} 
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="Ej. 4441234567"
                        className="input-text"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Vendedor Asignado:
                      </label>
                      <select 
                        value={soldBy} 
                        onChange={(e) => setSoldBy(e.target.value)}
                        className="input-text"
                      >
                        {usersList.map((u) => (
                          <option key={u.id} value={u.name}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setSelectedTicketNum(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CREAR NUEVO VENDEDOR */}
        {showUserModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: '#0f172a' }}>
                Registrar Nuevo Vendedor
              </h3>
              
              <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Nombre Completo:
                  </label>
                  <input 
                    type="text" 
                    value={newUserName} 
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Ej. Pedro Gómez"
                    className="input-text"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Rol de Permisos:
                  </label>
                  <select 
                    value={newUserRole} 
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="input-text"
                  >
                    <option value="seller">Vendedor</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowUserModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Crear Vendedor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}