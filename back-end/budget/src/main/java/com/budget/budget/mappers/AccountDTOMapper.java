package com.budget.budget.mappers;

import com.budget.budget.dto.NewAccountDTO;
import com.budget.budget.dto.UpdateAccountDTO;
import com.budget.budget.models.Account;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AccountDTOMapper {
    @Autowired
    private ModelMapper modelMapper;
    public Account toEntity(NewAccountDTO newAccountDTO) {
        return modelMapper.map(newAccountDTO, Account.class);
    }
    public Account toEntity(UpdateAccountDTO updateAccountDTO) {
        return modelMapper.map(updateAccountDTO, Account.class);
    }
}
