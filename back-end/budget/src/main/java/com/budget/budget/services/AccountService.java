package com.budget.budget.services;

import com.budget.budget.dto.NewAccountDTO;
import com.budget.budget.dto.UpdateAccountDTO;
import com.budget.budget.mappers.AccountDTOMapper;
import com.budget.budget.models.Account;
import com.budget.budget.models.Entry;
import com.budget.budget.models.User;
import com.budget.budget.repositories.AccountRepository;
import com.budget.budget.repositories.EntryRepository;
import com.budget.budget.util.Auth;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final EntryRepository entryRepository;
    @Autowired
    AccountDTOMapper accountDTOMapper;
    public Account save(final NewAccountDTO account) {
        User myUser = Auth.auth();
        Account newAccount = accountDTOMapper.toEntity(account);
        newAccount.setUserId(myUser.getId());
        return accountRepository.save(newAccount);
    }

    public List<Account> findAll() {
        User myUser = Auth.auth();
        return this.accountRepository.findAll().stream().filter(a -> a.getUserId().equals(myUser.getId())).collect(Collectors.toList());
    }

    public Account findById(final Integer id) {
        User myUser = Auth.auth();
        Optional<Account> account = accountRepository.findById(id);
        if (account.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Account with id %s not found", id));
        }
        if(!account.get().getUserId().equals(myUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this account");
        }
        return account.get();
    }
    public boolean update(Integer id, UpdateAccountDTO updatedAccount) {
        Optional<Account> existingAccount = accountRepository.findById(id);
        if (existingAccount.isPresent()) {
            User myUser = Auth.auth();
            if(!existingAccount.get().getUserId().equals(myUser.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to update this account");
            }
            Account account = existingAccount.get();
            account.setName(updatedAccount.getName());
            account.setType(updatedAccount.getType());
            accountRepository.save(account);
            return true;
        }
        return false;
    }

    public void addBalance(final Integer id, final BigDecimal amount) {
        Account existingAccount = accountRepository.findById(id).get();
        if (amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        existingAccount.setBalance(existingAccount.getBalance().add(amount));
        accountRepository.save(existingAccount);
    }

    public void removeBalance(final Integer id, final BigDecimal amount) {
        Account existingAccount = accountRepository.findById(id).get();
        if (amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        existingAccount.setBalance(existingAccount.getBalance().subtract(amount));
        accountRepository.save(existingAccount);
    }

    public boolean delete(final Integer id) {
        if (accountRepository.existsById(id)) {
            User myUser = Auth.auth();
            Account account = accountRepository.findById(id).get();
            if(!account.getUserId().equals(myUser.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this account");
            }
            List<Entry> allEntries = entryRepository.findAllWithAssociations();
            allEntries.forEach(entry -> {
                if(entry.getAccount().getId().equals(id)) {
                    entryRepository.delete(entry);
                }
            });
            accountRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
