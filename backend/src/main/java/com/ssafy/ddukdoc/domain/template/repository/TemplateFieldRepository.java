package com.ssafy.ddukdoc.domain.template.repository;

import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TemplateFieldRepository extends JpaRepository<TemplateField, Integer> {
    List<TemplateField> findByTemplateIdOrderByDisplayOrderAsc(int templateId);

    TemplateField findTemplateIdById(Integer fieldId);
}
