package com.budget.budget.services;

import com.budget.budget.dto.NewCategoryDTO;
import com.budget.budget.dto.UpdateCategoryDTO;
import com.budget.budget.mappers.CategoryDTOMapper;
import com.budget.budget.models.Category;
import com.budget.budget.models.Entry;
import com.budget.budget.models.User;
import com.budget.budget.repositories.CategoryRepository;
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
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final EntryRepository entryRepository;
    @Autowired
    CategoryDTOMapper categoryDTOMapper;
    public Category save(final NewCategoryDTO category) {
        User myUser = Auth.auth();
        Category newCategory = categoryDTOMapper.toEntity(category);
        newCategory.setUserId(myUser.getId());
        return categoryRepository.save(newCategory);
    }

    public List<Category> findAll() {
        User myUser = Auth.auth();
        return categoryRepository.findAll().stream().filter(c -> c.getUserId().equals(myUser.getId())).collect(Collectors.toList());
    }

    public Category findById(final Integer id) {
        User myUser = Auth.auth();
        Category category = categoryRepository.findById(id).orElse(null);
        if(category == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }

        if(!category.getUserId().equals(myUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return category;
    }

    public boolean update(Integer id, UpdateCategoryDTO updatedCategory) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            User myUser = Auth.auth();
            if (!existingCategory.get().getUserId().equals(myUser.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
            Category category = existingCategory.get();
            category.setName(updatedCategory.getName());
            categoryRepository.save(category);
            return true;
        }
        return false;
    }
    public boolean delete(final Integer id) {
        if (categoryRepository.existsById(id)) {
            User myUser = Auth.auth();
            Category category = categoryRepository.findById(id).orElse(null);
            if(category == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
            }

            if(!category.getUserId().equals(myUser.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
            List<Entry> allEntries = entryRepository.findAllWithAssociations();
            allEntries.forEach(entry -> {
                if(entry.getCategory().getId().equals(category.getId())) {
                    entryRepository.delete(entry);
                }
            });
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }


}