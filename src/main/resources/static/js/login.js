document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value
  };

  const res = await fetch("/api/member/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 🔥 세션 쿠키 포함 필수
    body: JSON.stringify(data)
  });

  const text = await res.text();
  document.getElementById("result").textContent = text;

  if (text.includes("성공")) {
  window.location.href = "/routes.html";   // ← 로그인 성공 시 이동
}
});