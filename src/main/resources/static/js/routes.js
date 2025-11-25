async function fetchRoutes() {
  try {
    const res = await fetch('/api/routes');
    const routes = await res.json();

    const routesList = document.getElementById('routesList');
    routesList.innerHTML = ''; // 기존 로딩 메시지 제거
    console.log("✅ routes.js loaded");
    console.log(routes[0]);

    // 숫자 정렬
    routes.sort((a, b) => parseInt(a.routeName) - parseInt(b.routeName));

    // 🔸 그룹 객체 (예: 0~99, 100~199, 200~299 ...)
    const grouped = {};
    routes.forEach(route => {
      const num = parseInt(route.routeName);
      let groupKey;
      if (isNaN(num)) groupKey = '기타';
      else if (num < 100) groupKey = '0~99번대';
      else {
        const hundred = Math.floor(num / 100) * 100;
        groupKey = `${hundred}~${hundred + 99}번대`;
      }

      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(route);
    });

    // ✅ 구간 버튼을 자동 생성
    createRangeButtons(Object.keys(grouped));

    // 🔸 그룹별 렌더링
    for (const [groupName, routesInGroup] of Object.entries(grouped)) {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'route-group';
      groupDiv.setAttribute('data-range', groupName); // ✅ 스크롤용 식별자
      groupDiv.innerHTML = `<h2 class="group-title">${groupName}</h2>`;

      const grid = document.createElement('div');
      grid.className = 'route-grid';

      routesInGroup.forEach(route => {
        const card = document.createElement('div');
        card.className = 'route-card';
        // ✅ 출발지/도착지 제거, 최소 정보만 표시
        card.innerHTML = `
          <div class="route-name">${route.routeName}</div>
          <button class="route-btn">정류장 보기</button>
        `;

        card.querySelector('.route-btn').onclick = () => {
          window.location.href = `/stations?busRouteId=${route.routeId}`;
        };

        grid.appendChild(card);
      });

      groupDiv.appendChild(grid);
      routesList.appendChild(groupDiv);
    }

  } catch (err) {
    console.error('❌ 노선 불러오기 실패:', err);
    document.getElementById('routesList').innerHTML =
      '<p>노선 정보를 불러오지 못했습니다.</p>';
  }
}

// ✅ 구간 버튼 생성 + 스크롤 이동 기능
function createRangeButtons(ranges) {
  // 이미 존재하면 중복 방지
  if (document.querySelector('.range-buttons')) return;

  const topBar = document.querySelector('.top-bar');
  if (!topBar) return;

  const btnContainer = document.createElement('div');
  btnContainer.className = 'range-buttons';

  ranges.forEach(range => {
    const btn = document.createElement('button');
    btn.textContent = range.replace('번대', ''); // "0~99번대" → "0~99"
    btn.onclick = () => {
      const target = document.querySelector(`[data-range="${range}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    btnContainer.appendChild(btn);
  });

  topBar.appendChild(btnContainer);
}

// ✅ 정류장 인라인 표시 함수 (필요 시 유지)
async function fetchStationsInline(routeId) {
  try {
    const res = await fetch(`/api/stations?busRouteId=${routeId}`);
    const stations = await res.json();
    const stationsList = document.getElementById('stationsList');
    if (!stationsList) return;
    stationsList.innerHTML = '';
    stations.forEach(station => {
      const li = document.createElement('li');
      li.textContent = station.stopName;
      stationsList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

window.onload = fetchRoutes;
