async function checkSession() {
  const res = await fetch("/api/member/session-check", {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const usernameText = document.getElementById("usernameText");
  const logoutBtn = document.getElementById("logoutBtn");

  if (data.loggedIn) {
    // 로그인 상태
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";

    usernameText.innerText = data.username + " 님";
    usernameText.style.display = "inline-block";

    logoutBtn.style.display = "inline-block";
  } else {
    // 로그아웃 상태
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "inline-block";
    usernameText.style.display = "none";
    logoutBtn.style.display = "none";
  }
}

// 로그아웃 버튼
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await fetch("/api/member/logout", {
    method: "POST",
    credentials: "include"
  });

  location.reload(); // 새로고침 → 로그아웃 반영
});

// 페이지 로드시 세션 확인
checkSession();