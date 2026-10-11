package com.sslchecker.service;

import com.sslchecker.model.Domain;
import com.sslchecker.model.SslCertificateRecord;
import com.sslchecker.repository.DomainRepository;
import com.sslchecker.repository.SslCertificateRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MonitoringScheduler {

    private static final Logger log = LoggerFactory.getLogger(MonitoringScheduler.class);

    private final DomainRepository domainRepository;
    private final SslCertificateRecordRepository certRepository;
    private final SslCheckerService sslCheckerService;
    private final JavaMailSender mailSender;

    public MonitoringScheduler(DomainRepository domainRepository, SslCertificateRecordRepository certRepository,
                               SslCheckerService sslCheckerService, JavaMailSender mailSender) {
        this.domainRepository = domainRepository;
        this.certRepository = certRepository;
        this.sslCheckerService = sslCheckerService;
        this.mailSender = mailSender;
    }

    @Scheduled(cron = "${ssl.monitoring.cron:0 0 6 * * ?}")
    @Transactional
    public void runDailyMonitoring() {
        log.info("Starting daily SSL monitoring check...");
        List<Domain> domains = domainRepository.findAllOrderByLastCheckedAsc();
        int checked = 0;
        int failed = 0;

        for (Domain domain : domains) {
            try {
                SslCertificateRecord record = sslCheckerService.checkSsl(domain.getHostname(), domain.getPort());
                record.setDomain(domain);
                certRepository.save(record);

                domain.setStatus(mapStatus(record.getStatus()));
                domain.setDaysUntilExpiry(record.getDaysRemaining());
                domain.setLastChecked(LocalDateTime.now());
                domainRepository.save(domain);

                if (domain.isEmailAlertsEnabled() &&
                    record.getDaysRemaining() != null &&
                    record.getDaysRemaining() <= domain.getAlertDaysBefore() &&
                    record.getDaysRemaining() >= 0) {
                    sendExpiryAlert(domain, record.getDaysRemaining());
                }

                checked++;
            } catch (Exception e) {
                log.error("Error checking domain {}: {}", domain.getHostname(), e.getMessage());
                failed++;
            }
        }
        log.info("Daily monitoring complete. Checked: {}, Failed: {}", checked, failed);
    }

    private void sendExpiryAlert(Domain domain, int daysRemaining) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(domain.getUser().getEmail());
            message.setSubject("⚠️ SSL Certificate Expiring: " + domain.getHostname());
            message.setText(String.format(
                "Hello %s,\n\n" +
                "Your SSL certificate for %s is expiring in %d days.\n\n" +
                "Please renew your certificate as soon as possible to avoid service disruption.\n\n" +
                "Domain: %s\n" +
                "Days Remaining: %d\n\n" +
                "Best regards,\n" +
                "SSL Checker Team",
                domain.getUser().getFullName(),
                domain.getHostname(),
                daysRemaining,
                domain.getHostname(),
                daysRemaining
            ));
            mailSender.send(message);
            log.info("Expiry alert sent for domain: {}", domain.getHostname());
        } catch (Exception e) {
            log.error("Failed to send email alert for {}: {}", domain.getHostname(), e.getMessage());
        }
    }

    private Domain.DomainStatus mapStatus(SslCertificateRecord.CertificateStatus status) {
        if (status == null) return Domain.DomainStatus.INVALID;
        return switch (status) {
            case VALID -> Domain.DomainStatus.VALID;
            case EXPIRING_SOON -> Domain.DomainStatus.EXPIRING_SOON;
            case EXPIRED -> Domain.DomainStatus.EXPIRED;
            default -> Domain.DomainStatus.INVALID;
        };
    }
}
