
    document.getElementById("registerForm").addEventListener("submit", async function(e) {
      e.preventDefault();

      const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value,
        telegramId: document.getElementById("telegramId").value || null
      };

      const res = await fetch("/api/member/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const text = await res.text();
      document.getElementById("result").textContent = text;

      if (text.includes("완료")) {
        window.location.href = "/routes.html";   // ← 회원가입 성공 시 이동
        }
    });
