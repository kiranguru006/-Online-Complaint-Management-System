package com.complaint.system.controller;

import com.complaint.system.dto.ApiResponse;
import com.complaint.system.dto.CategoryRequest;
import com.complaint.system.entity.Category;
import com.complaint.system.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success("All categories", categoryService.getAllCategories()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Category>>> getActiveCategories() {
        return ResponseEntity.ok(ApiResponse.success("Active categories", categoryService.getActiveCategories()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Category details", categoryService.getCategoryById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody CategoryRequest request) {
        Category category = categoryService.createCategory(request);
        return ResponseEntity.ok(ApiResponse.success("Category created successfully", category));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        Category updated = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully"));
    }
}
