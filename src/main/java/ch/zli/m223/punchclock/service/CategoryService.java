package ch.zli.m223.punchclock.service;

import ch.zli.m223.punchclock.domain.Category;
import ch.zli.m223.punchclock.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    public Category create(Category category) {
        if (category.getId() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parameter ID muss null sein.");
        }
        return categoryRepository.saveAndFlush(category);
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public void deleteCategory(Long id) {
        this.categoryRepository.deleteById(id);
    }

    public Category update(Category category) {
        if (!this.categoryRepository.existsById(category.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Keine Kategorie mit der ID " + category.getId() + " gefunden.");
        }

        return this.categoryRepository.saveAndFlush(category);
    }
}
