package com.nepclassroom.nep_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendApprovalRequest(String userName, String userEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("nepclassroom@gmail.com");
        message.setSubject("Novo cadastro de usuário - Aprovação necessária");
        message.setText("Um novo usuário foi cadastrado:\n\nNome: " + userName + "\nEmail: " + userEmail + "\n\nDeseja aprovar este cadastro?");
        mailSender.send(message);
    }
}
