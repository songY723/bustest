package com.song.bustraker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "forward:/routes.html";
    }

    @GetMapping("/test")
    public String test() {
        return "Controller is working!";
    }
}
