package com.song.bustraker.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.song.bustraker.dao.MemberDao;
import com.song.bustraker.dto.MemberDto;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    @Autowired
    private MemberDao repo;

    // ✅ 회원가입 API
    @PostMapping("/register")
    public String register(@RequestBody MemberDto member) {
        if (repo.existsByUsername(member.getUsername())) {
            return "이미 존재하는 아이디입니다.";
        }

        repo.save(member);
        return "회원가입이 완료되었습니다.";
    }
    
    @PostMapping("/login")
    public String login(@RequestBody MemberDto member, HttpServletResponse response, HttpSession session) {

        MemberDto dbUser = repo.findByUsername(member.getUsername());
        if (dbUser == null) {
            return "아이디가 존재하지 않습니다.";
        }

        if (!dbUser.getPassword().equals(member.getPassword())) {
            return "비밀번호가 일치하지 않습니다.";
        }

        // 세션 저장
        session.setAttribute("username", dbUser.getUsername());
        session.setMaxInactiveInterval(60 * 60 * 6); // 6시간

        return "로그인 성공";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "로그아웃 성공";
    }

    @GetMapping("/session-check")
    public Map<String, Object> sessionCheck(HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        String username = (String) session.getAttribute("username");

        if (username != null) {
            map.put("loggedIn", true);
            map.put("username", username);
        } else {
            map.put("loggedIn", false);
        }

        return map;
    }
}
