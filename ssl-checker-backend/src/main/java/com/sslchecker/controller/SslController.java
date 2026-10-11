package com.sslchecker.controller;

import com.sslchecker.dto.response.SslCertificateDTO;
import com.sslchecker.model.SslCertificateRecord;
import com.sslchecker.model.User;
import com.sslchecker.service.AuthService;
import com.sslchecker.service.DomainService;
import com.sslchecker.service.SslCheckerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ssl")
@Tag(name = "SSL Checker", description = "SSL certificate check endpoints")
public class SslController {

    private final SslCheckerService sslCheckerService;
    private final DomainService domainService;
    private final AuthService authService;

    public SslController(SslCheckerService sslCheckerService, DomainService domainService, AuthService authService) {
        this.sslCheckerService = sslCheckerService;
        this.domainService = domainService;
        this.authService = authService;
    }

    @PostMapping("/check")
    @Operation(summary = "Perform a real-time SSL check (no auth required)")
    public ResponseEntity<?> checkSsl(@RequestBody Map<String, Object> request) {
        try {
            String hostname = (String) request.get("hostname");
            int port = 443;
            if (request.containsKey("port") && request.get("port") != null) {
                Object p = request.get("port");
                if (p instanceof Number n) {
                    port = n.intValue();
                } else if (p instanceof String s) {
                    port = Integer.parseInt(s);
                }
            }

            if (hostname == null || hostname.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Hostname is required"));
            }

            hostname = hostname.trim().toLowerCase();
            if (hostname.startsWith("https://")) hostname = hostname.substring(8);
            if (hostname.startsWith("http://")) hostname = hostname.substring(7);
            if (hostname.contains("/")) hostname = hostname.split("/")[0];

            SslCertificateRecord record = sslCheckerService.checkSsl(hostname, port);
            SslCertificateDTO dto = buildDto(record);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history/{domainId}")
    @Operation(summary = "Get SSL check history for a domain")
    public ResponseEntity<List<SslCertificateDTO>> getDomainHistory(
            @PathVariable UUID domainId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = authService.getCurrentUser(userDetails.getUsername());
            List<SslCertificateDTO> history = domainService.getDomainHistory(domainId, user);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private SslCertificateDTO buildDto(SslCertificateRecord record) {
        return SslCertificateDTO.builder()
                .issuer(record.getIssuer())
                .issuerOrg(record.getIssuerOrg())
                .subject(record.getSubject())
                .serialNumber(record.getSerialNumber())
                .signatureAlgorithm(record.getSignatureAlgorithm())
                .keyAlgorithm(record.getKeyAlgorithm())
                .keySize(record.getKeySize())
                .validFrom(record.getValidFrom())
                .validUntil(record.getValidUntil())
                .daysRemaining(record.getDaysRemaining())
                .status(record.getStatus() != null ? record.getStatus().name() : "ERROR")
                .grade(record.getGrade())
                .gradeScore(record.getGradeScore())
                .isWildcard(record.isWildcard())
                .isSelfSigned(record.isSelfSigned())
                .sanList(record.getSanList())
                .chainInfo(record.getChainInfo())
                .protocolsSupported(record.getProtocolsSupported())
                .cipherSuites(record.getCipherSuites())
                .vulnerabilities(record.getVulnerabilities())
                .hostnameVerified(record.isHostnameVerified())
                .isTrusted(record.isTrusted())
                .checkedAt(record.getCheckedAt())
                .build();
    }
}
