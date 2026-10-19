package com.sslchecker.service;

import com.sslchecker.dto.request.DomainRequest;
import com.sslchecker.dto.response.DomainResponse;
import com.sslchecker.dto.response.SslCertificateDTO;
import com.sslchecker.model.Domain;
import com.sslchecker.model.SslCertificateRecord;
import com.sslchecker.model.User;
import com.sslchecker.repository.DomainRepository;
import com.sslchecker.repository.SslCertificateRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DomainService {

    private static final Logger log = LoggerFactory.getLogger(DomainService.class);

    private final DomainRepository domainRepository;
    private final SslCertificateRecordRepository certRepository;
    private final SslCheckerService sslCheckerService;

    public DomainService(DomainRepository domainRepository, SslCertificateRecordRepository certRepository, SslCheckerService sslCheckerService) {
        this.domainRepository = domainRepository;
        this.certRepository = certRepository;
        this.sslCheckerService = sslCheckerService;
    }

    public List<DomainResponse> getAllDomains(User user) {
        return domainRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toDomainResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DomainResponse addDomain(DomainRequest request, User user) {
        String cleanHostname = cleanHostname(request.getHostname());

        if (domainRepository.existsByHostnameAndUser(cleanHostname, user)) {
            throw new IllegalArgumentException("Domain already monitored: " + cleanHostname);
        }

        Domain domain = Domain.builder()
                .hostname(cleanHostname)
                .port(request.getPort() != null ? request.getPort() : 443)
                .user(user)
                .notes(request.getNotes())
                .alertDaysBefore(request.getAlertDaysBefore() != null ? request.getAlertDaysBefore() : 30)
                .emailAlertsEnabled(request.isEmailAlertsEnabled())
                .status(Domain.DomainStatus.PENDING)
                .build();

        domain = domainRepository.save(domain);

        performCheckAndSave(domain);

        return toDomainResponse(domain);
    }

    @Transactional
    public DomainResponse updateDomain(UUID domainId, DomainRequest request, User user) {
        Domain domain = domainRepository.findByIdAndUser(domainId, user)
                .orElseThrow(() -> new IllegalArgumentException("Domain not found"));

        domain.setNotes(request.getNotes());
        domain.setAlertDaysBefore(request.getAlertDaysBefore() != null ? request.getAlertDaysBefore() : 30);
        domain.setEmailAlertsEnabled(request.isEmailAlertsEnabled());

        domainRepository.save(domain);
        return toDomainResponse(domain);
    }

    @Transactional
    public void deleteDomain(UUID domainId, User user) {
        Domain domain = domainRepository.findByIdAndUser(domainId, user)
                .orElseThrow(() -> new IllegalArgumentException("Domain not found"));
        domainRepository.delete(domain);
    }

    @Transactional
    public SslCertificateDTO checkDomainNow(UUID domainId, User user) {
        Domain domain = domainRepository.findByIdAndUser(domainId, user)
                .orElseThrow(() -> new IllegalArgumentException("Domain not found"));

        SslCertificateRecord record = performCheckAndSave(domain);
        return toSslCertificateDTO(record);
    }

    private SslCertificateRecord performCheckAndSave(Domain domain) {
        SslCertificateRecord record = sslCheckerService.checkSsl(domain.getHostname(), domain.getPort());
        record.setDomain(domain);

        certRepository.save(record);

        domain.setStatus(mapCertStatusToDomainStatus(record.getStatus()));
        domain.setDaysUntilExpiry(record.getDaysRemaining());
        domain.setLastChecked(LocalDateTime.now());
        domainRepository.save(domain);

        return record;
    }

    private Domain.DomainStatus mapCertStatusToDomainStatus(SslCertificateRecord.CertificateStatus certStatus) {
        if (certStatus == null) return Domain.DomainStatus.INVALID;
        return switch (certStatus) {
            case VALID -> Domain.DomainStatus.VALID;
            case EXPIRING_SOON -> Domain.DomainStatus.EXPIRING_SOON;
            case EXPIRED -> Domain.DomainStatus.EXPIRED;
            default -> Domain.DomainStatus.INVALID;
        };
    }

    public List<SslCertificateDTO> getDomainHistory(UUID domainId, User user) {
        Domain domain = domainRepository.findByIdAndUser(domainId, user)
                .orElseThrow(() -> new IllegalArgumentException("Domain not found"));

        return certRepository.findByDomainOrderByCheckedAtDesc(domain)
                .stream()
                .map(this::toSslCertificateDTO)
                .collect(Collectors.toList());
    }

    private String cleanHostname(String hostname) {
        if (hostname == null) return "";
        hostname = hostname.trim().toLowerCase();
        if (hostname.startsWith("https://")) hostname = hostname.substring(8);
        if (hostname.startsWith("http://")) hostname = hostname.substring(7);
        if (hostname.contains("/")) hostname = hostname.split("/")[0];
        if (hostname.contains("?")) hostname = hostname.split("\\?")[0];
        if (hostname.contains("#")) hostname = hostname.split("#")[0];
        if (hostname.contains(":")) hostname = hostname.split(":")[0];
        return hostname.trim();
    }

    private DomainResponse toDomainResponse(Domain domain) {
        SslCertificateRecord latestCert = certRepository
                .findFirstByDomainOrderByCheckedAtDesc(domain)
                .orElse(null);

        return DomainResponse.builder()
                .id(domain.getId())
                .hostname(domain.getHostname())
                .port(domain.getPort())
                .status(domain.getStatus() != null ? domain.getStatus().name() : "PENDING")
                .daysUntilExpiry(domain.getDaysUntilExpiry())
                .lastChecked(domain.getLastChecked())
                .alertDaysBefore(domain.getAlertDaysBefore())
                .emailAlertsEnabled(domain.isEmailAlertsEnabled())
                .notes(domain.getNotes())
                .createdAt(domain.getCreatedAt())
                .grade(latestCert != null ? latestCert.getGrade() : null)
                .issuer(latestCert != null ? latestCert.getIssuerOrg() : null)
                .validUntil(latestCert != null ? latestCert.getValidUntil() : null)
                .build();
    }

    private SslCertificateDTO toSslCertificateDTO(SslCertificateRecord record) {
        return SslCertificateDTO.builder()
                .id(record.getId())
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
