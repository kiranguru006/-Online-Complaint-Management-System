package com.complaint.system.service;

import com.complaint.system.dto.CategoryRequest;
import com.complaint.system.entity.Category;
import com.complaint.system.entity.Department;
import com.complaint.system.exception.BadRequestException;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.repository.CategoryRepository;
import com.complaint.system.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;

    public CategoryService(CategoryRepository categoryRepository, DepartmentRepository departmentRepository) {
        this.categoryRepository = categoryRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    @Transactional
    public Category createCategory(CategoryRequest request) {
        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Category name already exists");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElse(null);
        }

        Category category = new Category(request.getName(), request.getDescription(), department, request.isActive());
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = getCategoryById(id);

        categoryRepository.findByName(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Category name already taken by another category");
            }
        });

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setActive(request.isActive());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElse(null);
            category.setDepartment(department);
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
