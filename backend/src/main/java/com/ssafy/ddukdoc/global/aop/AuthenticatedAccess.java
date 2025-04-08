package com.ssafy.ddukdoc.global.aop;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.Target;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@PreAuthorize("hasAnyRole('GENERAL', 'SSAFY', 'ADMIN')")
public @interface AuthenticatedAccess {}
