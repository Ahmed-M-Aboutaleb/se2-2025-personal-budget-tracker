package com.budget.budget.controllers;

import com.budget.budget.dto.NewEntryDTO;
import com.budget.budget.dto.UpdateEntryDTO;
import com.budget.budget.models.Entry;
import com.budget.budget.services.EntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/entries")
@RequiredArgsConstructor
public class EntriesController {
    private final EntryService entryService;

    @PostMapping
    public ResponseEntity<Entry> createEntry(@RequestBody @Valid final NewEntryDTO entry) {
        return new ResponseEntity<>(this.entryService.save(entry), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Entry>> getEntries() {
        return new ResponseEntity<>(this.entryService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/account/{id}")
    public ResponseEntity<List<Entry>> getEntryByAccount(@PathVariable final Integer id) {
        return new ResponseEntity<>(this.entryService.findAllByAccount(id), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entry> getEntryById(@PathVariable final Integer id) {
        return new ResponseEntity<>(this.entryService.findById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entry> updateEntry(@PathVariable final Integer id, @RequestBody @Valid final UpdateEntryDTO entry) {
        this.entryService.update(id, entry);
        Entry newEntry = this.entryService.findById(id);
        return new ResponseEntity<>(newEntry, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Entry> deleteEntry(@PathVariable final Integer id) {
        Entry entry = this.entryService.findById(id);
        this.entryService.delete(id);
        return new ResponseEntity<>(entry, HttpStatus.OK);
    }
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError)error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}
