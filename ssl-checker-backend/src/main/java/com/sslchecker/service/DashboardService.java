package com.sslchecker.service;

import com.sslchecker.dto.response.DashboardStatsDTO;
import com.sslchecker.dto.response.SslCertificateDTO;
import com.sslchecker.model.Domain;
import com.sslchecker.model.SslCertificateRecord;
import com.sslchecker.model.User;
import com.sslchecker.repository.DomainRepository;
import com.sslchecker.repository.SslCertificateRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);

    private final DomainRepository domainRepository;
    private final SslCertificateRecordRepository certRepository;

    public DashboardService(DomainRepository domainRepository, SslCertificateRecordRepository certRepository) {
        this.domainRepository = domainRepository;
        this.certRepository = certRepository;
    }

    public DashboardStatsDTO getDashboardStats(User user) {
        long total = domainRepository.countByUser(user);
        long valid = domainRepository.countByUserAndStatus(user, Domain.DomainStatus.VALID);
        long expiringSoon = domainRepository.countByUserAndStatus(user, Domain.DomainStatus.EXPIRING_SOON);
        long expired = domainRepository.countByUserAndStatus(user, Domain.DomainStatus.EXPIRED);
        long invalid = domainRepository.countByUserAndStatus(user, Domain.DomainStatus.INVALID);
        long unreachable = domainRepository.countByUserAndStatus(user, Domain.DomainStatus.UNREACHABLE);

        List<Domain> domains = domainRepository.findByUserOrderByCreatedAtDesc(user);

        List<DashboardStatsDTO.ExpiryDataPoint> expiryTimeline = domains.stream()
                .filter(d -> d.getDaysUntilExpiry() != null && d.getDaysUntilExpiry() >= 0)
                .sorted((a, b) -> {
                    if (a.getDaysUntilExpiry() == null) return 1;
                    if (b.getDaysUntilExpiry() == null) return -1;
                    return Integer.compare(a.getDaysUntilExpiry(), b.getDaysUntilExpiry());
                })
                .limit(10)
                .map(d -> DashboardStatsDTO.ExpiryDataPoint.builder()
                        .domain(d.getHostname())
                        .daysRemaining(d.getDaysUntilExpiry())
                        .status(d.getStatus() != null ? d.getStatus().name() : "PENDING")
                        .build())
                .collect(Collectors.toList());

        List<SslCertificateRecord> allRecords = certRepository.findRecentByUserId(
                user.getId(), PageRequest.of(0, 100));

        Map<String, Long> gradeDistribution = allRecords.stream()
                .filter(r -> r.getGrade() != null)
                .collect(Collectors.groupingBy(SslCertificateRecord::getGrade, Collectors.counting()));

        return DashboardStatsDTO.builder()
                .totalDomains(total)
                .validDomains(valid)
                .expiringSoonDomains(expiringSoon)
                .expiredDomains(expired)
                .invalidDomains(invalid)
                .unreachableDomains(unreachable)
                .expiryTimeline(expiryTimeline)
                .gradeDistribution(gradeDistribution)
                .build();
    }

    public List<SslCertificateDTO> getRecentActivity(User user) {
        return certRepository.findRecentByUserId(user.getId(), PageRequest.of(0, 10))
                .stream()
                .map(r -> SslCertificateDTO.builder()
                        .id(r.getId())
                        .subject(r.getSubject())
                        .issuerOrg(r.getIssuerOrg())
                        .grade(r.getGrade())
                        .status(r.getStatus() != null ? r.getStatus().name() : "UNKNOWN")
                        .daysRemaining(r.getDaysRemaining())
                        .checkedAt(r.getCheckedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
