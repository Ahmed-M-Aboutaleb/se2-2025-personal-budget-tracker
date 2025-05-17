package com.budget.budget.services;

import com.budget.budget.dto.NewEntryDTO;
import com.budget.budget.dto.UpdateEntryDTO;
import com.budget.budget.models.Account;
import com.budget.budget.models.Category;
import com.budget.budget.models.Entry;
import com.budget.budget.models.User;
import com.budget.budget.repositories.EntryRepository;
import com.budget.budget.util.Auth;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntryService {
    private final EntryRepository entryRepository;
    @Autowired
    AccountService accountService;
    @Autowired
    CategoryService categoryService;
    public Entry save(final NewEntryDTO entry) {
        User myUser = Auth.auth();
        Entry newEntry = new Entry();
        newEntry.setExpense(entry.getExpense());
        newEntry.setDate(entry.getDate());
        newEntry.setAmount(entry.getAmount());
        if(entry.getDescription() == null)
            newEntry.setDescription("");
        else
            newEntry.setDescription(entry.getDescription());
        newEntry.setUserId(myUser.getId());
        Account myAccount = accountService.findById(entry.getAccountId());
        if(!myAccount.getUserId().equals(myUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this account");
        Category myCategory = categoryService.findById(entry.getCategoryId());
        if(!myCategory.getUserId().equals(myUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this category");
        newEntry.setCategory(myCategory);
        newEntry.setAccount(myAccount);
        newEntry.setUserId(myUser.getId());
        Entry createdEntry = entryRepository.save(newEntry);
        if(createdEntry.isExpense())
            accountService.removeBalance(myAccount.getId(), createdEntry.getAmount());
        else
            accountService.addBalance(myAccount.getId(), createdEntry.getAmount());
        return createdEntry;
    }

    public List<Entry> findAll() {
        User myUser = Auth.auth();
        List<Entry> allEntries = entryRepository.findAllWithAssociations();
        return allEntries.stream().filter(entry -> entry.getUserId().equals(myUser.getId())).collect(Collectors.toList());
    }

    public List<Entry> findAllByAccount(final Integer accountID) {
        User myUser = Auth.auth();
        List<Entry> allEntries = entryRepository.findAllWithAssociations();
        Account myAccount = accountService.findById(accountID);
        if(!myAccount.getUserId().equals(myUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this account");
        return allEntries.stream().filter(entry -> entry.getUserId().equals(myUser.getId()) && entry.getAccount().getId().equals(myAccount.getId())).collect(Collectors.toList());
    }

    public Entry findById(final Integer id) {
        User myUser = Auth.auth();
        Entry entry = entryRepository.findById(id).orElse(null);
        if(entry == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found");
        if(!entry.getUserId().equals(myUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this entry");
        return entry;
    }

    public boolean update(Integer id, UpdateEntryDTO updatedEntry) {
        Optional<Entry> existingEntry = entryRepository.findById(id);
        User myUser = Auth.auth();
        if (existingEntry.isPresent()) {
            if(!existingEntry.get().getUserId().equals(myUser.getId()))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this entry");
            Category myCategory = categoryService.findById(updatedEntry.getCategoryId());
                if(!myCategory.getUserId().equals(myUser.getId()))
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this category");
            if(existingEntry.get().isExpense())
                accountService.addBalance(existingEntry.get().getAccount().getId(), existingEntry.get().getAmount());
            else
                accountService.removeBalance(existingEntry.get().getAccount().getId(), existingEntry.get().getAmount());
            Entry entry = existingEntry.get();
            entry.setAmount(updatedEntry.getAmount());
            entry.setDate(updatedEntry.getDate());
            if(entry.getDescription() == null)
                updatedEntry.setDescription("");
            else
                entry.setDescription(updatedEntry.getDescription());
            entry.setCategory(myCategory);
            entry.setExpense(updatedEntry.getExpense());
            entryRepository.save(entry);
            if(entry.isExpense())
                accountService.removeBalance(entry.getAccount().getId(), entry.getAmount());
            else
                accountService.addBalance(entry.getAccount().getId(), entry.getAmount());
            return true;
        }
        return false;
    }
    public void delete(final Integer id) {
        if (entryRepository.existsById(id)) {
            User myUser = Auth.auth();
            Entry entry = entryRepository.findById(id).orElse(null);
            if(!entry.getUserId().equals(myUser.getId()))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this entry");
            entryRepository.deleteById(id);
            if(entry.isExpense())
                accountService.addBalance(entry.getAccount().getId(), entry.getAmount());
            else
                accountService.removeBalance(entry.getAccount().getId(), entry.getAmount());
        }
    }
}
