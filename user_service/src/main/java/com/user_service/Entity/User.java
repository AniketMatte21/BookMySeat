package com.user_service.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity(name = "user_table")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    @Column(name="email", unique = true, nullable = false)
    private String email;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "contact_number", length = 10)
    private String contactNumber;

    @Column(name = "access_token", columnDefinition = "text")
    private String accessToken;

    @Column(name="scopes")
    private String scopes;

    @Column(name="open_id", unique =true,nullable = false)
    private String openId;

    public User(String email, String firstName, String lastName, String contactNumber, String accessToken, String scopes) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactNumber = contactNumber;
        this.accessToken = accessToken;
        this.scopes = scopes;
    }
}
