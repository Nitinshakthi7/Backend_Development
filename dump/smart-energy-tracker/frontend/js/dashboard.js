/**
 * Complete Dashboard Controller with GTA Animations
 */

let currentHome = null;
let dashboardData = null;
let charts = { appliance: null, timeline: null };
let refreshInterval = null;

// Initialize dashboard
async function initializeDashboard() {
  showLoading(true);

  if (!getToken()) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const userResponse = await auth.getMe();
    document.getElementById('userName').textContent = userResponse.data.name;

    animatePageEntrance();

    const homesResponse = await homes.getAll();
    if (homesResponse.data.length === 0) {
      currentHome = await createDefaultHome();
      await generateSampleData();
    } else {
      currentHome = homesResponse.data[0];
    }

    await loadDashboardData('today');
    refreshInterval = setInterval(() => loadDashboardData('today'), 30000);
    initScrollAnimations();

    showLoading(false);
    console.log('✅ Dashboard initialized');
  } catch (error) {
    console.error('Dashboard error:', error);
    showLoading(false);
    alert('Failed to load dashboard');
    auth.logout();
  }
}

async function createDefaultHome() {
  const newHome = await homes.create({ name: 'My Home', address: '123 Main Street' });
  await homes.addRoom(newHome.data._id, { name: 'Living Room', category: 'living_area' });
  await homes.addRoom(newHome.data._id, { name: 'Kitchen', category: 'kitchen' });
  await homes.addRoom(newHome.data._id, { name: 'Bedroom', category: 'bedroom' });
  return newHome.data;
}

async function loadDashboardData(period = 'today') {
  try {
    const data = await analytics.getDashboard(currentHome._id, period);
    dashboardData = data.data;

    updateStats(dashboardData);
    updateMeter(dashboardData.totals.avgWatts || 0);
    updateCharts(dashboardData);
    updateAlerts(dashboardData.alerts);
    updateRooms(dashboardData.roomBreakdown);
    updateHeatMap();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

function updateStats(data) {
  animateCounter('todayUsage', data.totals.totalConsumption || 0, 2);
  animateCounter('totalCost', data.totals.totalCost || 0, 0);
  animateCounter('carbonKg', parseFloat(data.carbonFootprint.co2kg) || 0, 2);
  
  const treesEl = document.getElementById('treesEquiv');
  if (treesEl) treesEl.textContent = data.carbonFootprint.treesEquivalent || '0';

  const wattsEl = document.getElementById('currentWatts');
  if (wattsEl) animateCounter('currentWatts', Math.round(data.totals.avgWatts || 0), 0);
}

function animateCounter(elementId, targetValue, decimals = 0) {
  const element = document.getElementById(elementId);
  if (!element || typeof anime === 'undefined') return;

  const obj = { value: parseFloat(element.textContent) || 0 };

  anime({
    targets: obj,
    value: targetValue,
    duration: 2000,
    easing: 'easeOutExpo',
    round: Math.pow(10, decimals),
    update: () => element.textContent = obj.value.toFixed(decimals)
  });
}

function updateMeter(watts) {
  const canvas = document.getElementById('meterCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 110;

  const maxWatts = 2000;
  const percentage = Math.min(watts / maxWatts, 1);
  const endAngle = 0.75 * Math.PI + percentage * 1.5 * Math.PI;

  let color = '#10b981';
  let status = 'Low Usage';
  if (watts > 500 && watts <= 1500) { color = '#f59e0b'; status = 'Normal'; }
  if (watts > 1500) { color = '#ef4444'; status = 'High Usage'; }

  anime({
    targets: { angle: 0.75 * Math.PI },
    angle: endAngle,
    duration: 1500,
    easing: 'easeOutElastic(1, .6)',
    update: (anim) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI);
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, anim.animations[0].currentValue);
      ctx.strokeStyle = color;
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.stroke();

      const needleLength = radius - 15;
      const needleX = centerX + needleLength * Math.cos(anim.animations[0].currentValue);
      const needleY = centerY + needleLength * Math.sin(anim.animations[0].currentValue);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(needleX, needleY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });

  const statusEl = document.getElementById('meterStatus');
  if (statusEl) {
    statusEl.textContent = status;
    statusEl.style.color = color;
  }
}

function updateCharts(data) {
  if (data.topDevices && data.topDevices.length > 0) {
    updateApplianceChart(data.topDevices);
  }
  updateTimelineChart();
}

function updateApplianceChart(topDevices) {
  const ctx = document.getElementById('applianceChart');
  if (!ctx) return;

  if (charts.appliance) charts.appliance.destroy();

  const labels = topDevices.map((d, i) => d._id || `Device ${i + 1}`);
  const data = topDevices.map(d => d.totalConsumption);

  charts.appliance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Energy (kWh)',
        data: data,
        backgroundColor: ['#00f0ff', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
        borderRadius: 8,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          padding: 12,
          borderColor: '#00f0ff',
          borderWidth: 1
        }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
        x: { grid: { display: false }, ticks: { color: '#64748b' } }
      }
    }
  });

  const topEl = document.getElementById('topConsumer');
  if (topEl && topDevices.length > 0) {
    topEl.textContent = `${labels[0]} (${data[0].toFixed(2)} kWh)`;
  }
}

function updateTimelineChart() {
  const ctx = document.getElementById('timelineChart');
  if (!ctx) return;

  if (charts.timeline) charts.timeline.destroy();

  const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
  const data = Array.from({length: 24}, () => Math.random() * 2 + 0.5);

  charts.timeline = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: 'Usage (kWh)',
        data: data,
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
        x: { grid: { display: false }, ticks: { color: '#64748b', maxTicksLimit: 12 } }
      }
    }
  });
}

function updateAlerts(alerts) {
  const alertsList = document.getElementById('alertsList');
  if (!alertsList) return;

  alertsList.innerHTML = '';

  if (!alerts || alerts.length === 0) {
    alertsList.innerHTML = '<div class="empty-state"><span class="empty-icon">✓</span><p>No alerts! Everything running smoothly.</p></div>';
    document.getElementById('alertCount').textContent = '0';
    return;
  }

  document.getElementById('alertCount').textContent = alerts.length;

  alerts.forEach((alert, index) => {
    const severityClass = alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'success';
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-item ${severityClass}`;
    alertDiv.innerHTML = `
      <div class="alert-icon">${alert.severity === 'high' ? '⚠️' : alert.severity === 'medium' ? 'ℹ️' : '✓'}</div>
      <div class="alert-content">
        <h4 class="alert-title">${alert.title}</h4>
        <p class="alert-message">${alert.message}</p>
        ${alert.recommendation ? `<p class="alert-tip">💡 ${alert.recommendation}</p>` : ''}
      </div>
      <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    alertsList.appendChild(alertDiv);

    anime({
      targets: alertDiv,
      translateX: [100, 0],
      opacity: [0, 1],
      duration: 600,
      delay: index * 100,
      easing: 'easeOutExpo'
    });
  });
}

function updateRooms(roomBreakdown) {
  const roomsList = document.getElementById('roomsList');
  if (!roomsList || !roomBreakdown) return;

  roomsList.innerHTML = '';

  const roomIcons = { 'living_area': '🛋️', 'kitchen': '🍳', 'bedroom': '🛏️', 'bathroom': '🚿', 'other': '🏠' };

  roomBreakdown.forEach(room => {
    const roomDiv = document.createElement('div');
    roomDiv.className = 'room-item';
    const percentage = Math.min((room.totalConsumption / 20) * 100, 100);
    
    roomDiv.innerHTML = `
      <div class="room-info">
        <span class="room-icon">${roomIcons[room._id] || '🏠'}</span>
        <div class="room-details">
          <div class="room-name">${room._id}</div>
          <div class="room-devices">Active</div>
        </div>
      </div>
      <div class="room-usage">
        <div class="usage-value">${room.totalConsumption.toFixed(1)} kWh</div>
        <div class="usage-bar"><div class="usage-fill" style="width: ${percentage}%"></div></div>
      </div>
    `;
    roomsList.appendChild(roomDiv);
  });
}

function updateHeatMap() {
  const container = document.getElementById('heatmapContainer');
  if (!container) return;

  container.innerHTML = '';

  for (let i = 0; i < 35; i++) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    const intensity = Math.random();
    
    if (intensity > 0.7) cell.classList.add('high');
    else if (intensity > 0.4) cell.classList.add('medium');
    else cell.classList.add('low');
    
    cell.title = `${(intensity * 10).toFixed(1)} kWh`;
    container.appendChild(cell);

    anime({
      targets: cell,
      scale: [0, 1],
      opacity: [0, 1],
      duration: 400,
      delay: i * 10,
      easing: 'easeOutElastic(1, .8)'
    });
  }
}

function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

function animatePageEntrance() {
  anime({
    targets: '.page-header',
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo'
  });

  anime({
    targets: '.stat-card',
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 800,
    delay: anime.stagger(100, {start: 200}),
    easing: 'easeOutExpo'
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

async function generateSampleData() {
  try {
    const sampleReadings = [];
    const now = new Date();

    for (let day = 6; day >= 0; day--) {
      for (let hour = 0; hour < 24; hour++) {
        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - day);
        timestamp.setHours(hour, 0, 0, 0);

        sampleReadings.push({
          deviceId: `device_${Math.floor(Math.random() * 3) + 1}`,
          roomId: `room_${Math.floor(Math.random() * 3) + 1}`,
          consumption: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
          watts: Math.floor(Math.random() * 1500 + 200),
          timestamp: timestamp.toISOString()
        });
      }
    }

    await readings.createBatch(currentHome._id, sampleReadings);
    console.log('✅ Sample data generated');
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
}

function refreshDashboard() {
  loadDashboardData(document.getElementById('periodSelect').value);
}

function addDevice() { alert('Add Device - Coming soon!'); }
function setGoal() { alert('Set Goal - Coming soon!'); }
function viewHistory() { alert('View History - Coming soon!'); }
function shareReport() { alert('Share Report - Coming soon!'); }
function showExportModal() { alert('Export Report - Coming soon!'); }
function changeMonth(direction) { console.log('Change month:', direction); }
function switchView(view) { console.log('Switch view:', view); }
function updateTimeline(period) { console.log('Update timeline:', period); }
function toggleChartView(chart) { console.log('Toggle chart:', chart); }

function logout() {
  if (refreshInterval) clearInterval(refreshInterval);
  auth.logout();
}

console.log('✅ Dashboard script loaded');
