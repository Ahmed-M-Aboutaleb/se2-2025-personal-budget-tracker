package com.budget.budget.mappers;

import com.budget.budget.dto.NewCategoryDTO;
import com.budget.budget.dto.UpdateCategoryDTO;
import com.budget.budget.models.Category;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CategoryDTOMapper {
    @Autowired
    private ModelMapper modelMapper;
    public Category toEntity(NewCategoryDTO newCategoryDTO) {
        return modelMapper.map(newCategoryDTO, Category.class);
    }
    public Category toEntity(UpdateCategoryDTO updateCategoryDTO) {
        return modelMapper.map(updateCategoryDTO, Category.class);
    }
}
