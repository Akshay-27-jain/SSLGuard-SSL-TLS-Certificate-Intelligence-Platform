package com.sslchecker.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "domains")
public class Domain {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String hostname;

    @Column(nullable = false)
    private int port = 443;

    @Enumerated(EnumType.STRING)
    private DomainStatus status = DomainStatus.PENDING;

    @Column(name = "days_until_expiry")
    private Integer daysUntilExpiry;

    @Column(name = "last_checked")
    private LocalDateTime lastChecked;

    @Column(name = "alert_days_before")
    private int alertDaysBefore = 30;

    @Column(name = "email_alerts_enabled")
    private boolean emailAlertsEnabled = true;

    @Column(name = "notes")
    private String notes;

    @OneToMany(mappedBy = "domain", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SslCertificateRecord> certificateRecords = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Domain() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private User user;
        private String hostname;
        private int port = 443;
        private DomainStatus status = DomainStatus.PENDING;
        private Integer daysUntilExpiry;
        private LocalDateTime lastChecked;
        private int alertDaysBefore = 30;
        private boolean emailAlertsEnabled = true;
        private String notes;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder hostname(String hostname) { this.hostname = hostname; return this; }
        public Builder port(int port) { this.port = port; return this; }
        public Builder status(DomainStatus status) { this.status = status; return this; }
        public Builder daysUntilExpiry(Integer daysUntilExpiry) { this.daysUntilExpiry = daysUntilExpiry; return this; }
        public Builder lastChecked(LocalDateTime lastChecked) { this.lastChecked = lastChecked; return this; }
        public Builder alertDaysBefore(int alertDaysBefore) { this.alertDaysBefore = alertDaysBefore; return this; }
        public Builder emailAlertsEnabled(boolean emailAlertsEnabled) { this.emailAlertsEnabled = emailAlertsEnabled; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }

        public Domain build() {
            Domain d = new Domain();
            d.id = this.id;
            d.user = this.user;
            d.hostname = this.hostname;
            d.port = this.port;
            d.status = this.status != null ? this.status : DomainStatus.PENDING;
            d.daysUntilExpiry = this.daysUntilExpiry;
            d.lastChecked = this.lastChecked;
            d.alertDaysBefore = this.alertDaysBefore;
            d.emailAlertsEnabled = this.emailAlertsEnabled;
            d.notes = this.notes;
            return d;
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }

    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }

    public DomainStatus getStatus() { return status; }
    public void setStatus(DomainStatus status) { this.status = status; }

    public Integer getDaysUntilExpiry() { return daysUntilExpiry; }
    public void setDaysUntilExpiry(Integer daysUntilExpiry) { this.daysUntilExpiry = daysUntilExpiry; }

    public LocalDateTime getLastChecked() { return lastChecked; }
    public void setLastChecked(LocalDateTime lastChecked) { this.lastChecked = lastChecked; }

    public int getAlertDaysBefore() { return alertDaysBefore; }
    public void setAlertDaysBefore(int alertDaysBefore) { this.alertDaysBefore = alertDaysBefore; }

    public boolean isEmailAlertsEnabled() { return emailAlertsEnabled; }
    public void setEmailAlertsEnabled(boolean emailAlertsEnabled) { this.emailAlertsEnabled = emailAlertsEnabled; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<SslCertificateRecord> getCertificateRecords() { return certificateRecords; }
    public void setCertificateRecords(List<SslCertificateRecord> certificateRecords) { this.certificateRecords = certificateRecords; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum DomainStatus {
        VALID, EXPIRING_SOON, EXPIRED, INVALID, PENDING, UNREACHABLE
    }
}
