package com.ecommerce.backend.dto;


import com.ecommerce.backend.model.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private Gender gender;

    private String address;
    private String backupEmail;
    private String telephone;
    private String mobile;
    private String fax;

    private String department;
    private String position;
    private String socialMediaContact;
}
