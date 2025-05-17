package com.budget.budget.controllers;

import com.budget.budget.dto.NewCategoryDTO;
import com.budget.budget.dto.UpdateCategoryDTO;
import com.budget.budget.models.Category;
import com.budget.budget.services.CategoryService;
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
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoriesController {
    private final CategoryService categoryService;


    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody @Valid final NewCategoryDTO category) {
        Category saved = this.categoryService.save(category);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = this.categoryService.findAll();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategory(@PathVariable final Integer id) {
        Category category = this.categoryService.findById(id);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable final Integer id, @RequestBody @Valid final UpdateCategoryDTO category) {
        if(!this.categoryService.update(id, category)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(this.categoryService.findById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Category> deleteCategory(@PathVariable final Integer id) {
        Category category = this.categoryService.findById(id);
        if(!this.categoryService.delete(id)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(category, HttpStatus.OK);
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
