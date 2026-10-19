package com.sslchecker.controller;

import com.sslchecker.dto.request.DomainRequest;
import com.sslchecker.dto.response.DomainResponse;
import com.sslchecker.dto.response.SslCertificateDTO;
import com.sslchecker.model.User;
import com.sslchecker.service.AuthService;
import com.sslchecker.service.DomainService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/domains")
@Tag(name = "Domain Management", description = "Manage monitored domains")
@SecurityRequirement(name = "bearerAuth")
public class DomainController {

    private final DomainService domainService;
    private final AuthService authService;

    public DomainController(DomainService domainService, AuthService authService) {
        this.domainService = domainService;
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "Get all monitored domains")
    public ResponseEntity<List<DomainResponse>> getAllDomains(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(domainService.getAllDomains(user));
    }

    @PostMapping
    @Operation(summary = "Add a new domain to monitor")
    public ResponseEntity<?> addDomain(
            @Valid @RequestBody DomainRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = authService.getCurrentUser(userDetails.getUsername());
            DomainResponse response = domainService.addDomain(request, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Failed to add domain"));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update domain settings")
    public ResponseEntity<?> updateDomain(
            @PathVariable UUID id,
            @Valid @RequestBody DomainRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = authService.getCurrentUser(userDetails.getUsername());
            DomainResponse response = domainService.updateDomain(id, request, user);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Failed to update domain"));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a monitored domain")
    public ResponseEntity<?> deleteDomain(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = authService.getCurrentUser(userDetails.getUsername());
            domainService.deleteDomain(id, user);
            return ResponseEntity.ok(Map.of("message", "Domain deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Failed to delete domain"));
        }
    }

    @PostMapping("/{id}/check")
    @Operation(summary = "Trigger a manual SSL check for a domain")
    public ResponseEntity<?> checkDomainNow(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = authService.getCurrentUser(userDetails.getUsername());
            SslCertificateDTO result = domainService.checkDomainNow(id, user);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Failed to inspect domain"));
        }
    }
}
