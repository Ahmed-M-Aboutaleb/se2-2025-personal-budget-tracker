package com.budget.auth.mappers;

import com.budget.auth.dto.NewUserRequestDTO;
import com.budget.auth.models.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserDTOMapper {
    @Autowired
    private ModelMapper modelMapper;
    public NewUserRequestDTO mapUserToNewUserRequestDTO(User user) {
        NewUserRequestDTO registerDTO = modelMapper.map(user, NewUserRequestDTO.class);
        return registerDTO;
    }
    public User mapUserRequestDTOToUser(NewUserRequestDTO newUserRequestDTO) {
        User user = modelMapper.map(newUserRequestDTO, User.class);
        if (user.getEmail() != null) {
            user.setUsername(user.getEmail());
        }
        return user;
    }
}
