package com.ssafy.ddukdoc.domain.template.repository;

import com.ssafy.ddukdoc.domain.template.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TemplateRepository extends JpaRepository<Template,Integer> {
    Optional<Template> findByCode(String code);
}
