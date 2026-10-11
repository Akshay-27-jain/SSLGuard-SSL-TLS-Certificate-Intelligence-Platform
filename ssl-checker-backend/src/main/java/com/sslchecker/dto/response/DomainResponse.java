package com.sslchecker.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public class DomainResponse {
    private UUID id;
    private String hostname;
    private int port;
    private String status;
    private Integer daysUntilExpiry;
    private LocalDateTime lastChecked;
    private int alertDaysBefore;
    private boolean emailAlertsEnabled;
    private String notes;
    private LocalDateTime createdAt;
    private String grade;
    private String issuer;
    private LocalDateTime validUntil;

    public DomainResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private String hostname;
        private int port;
        private String status;
        private Integer daysUntilExpiry;
        private LocalDateTime lastChecked;
        private int alertDaysBefore;
        private boolean emailAlertsEnabled;
        private String notes;
        private LocalDateTime createdAt;
        private String grade;
        private String issuer;
        private LocalDateTime validUntil;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder hostname(String hostname) { this.hostname = hostname; return this; }
        public Builder port(int port) { this.port = port; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder daysUntilExpiry(Integer daysUntilExpiry) { this.daysUntilExpiry = daysUntilExpiry; return this; }
        public Builder lastChecked(LocalDateTime lastChecked) { this.lastChecked = lastChecked; return this; }
        public Builder alertDaysBefore(int alertDaysBefore) { this.alertDaysBefore = alertDaysBefore; return this; }
        public Builder emailAlertsEnabled(boolean emailAlertsEnabled) { this.emailAlertsEnabled = emailAlertsEnabled; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder grade(String grade) { this.grade = grade; return this; }
        public Builder issuer(String issuer) { this.issuer = issuer; return this; }
        public Builder validUntil(LocalDateTime validUntil) { this.validUntil = validUntil; return this; }

        public DomainResponse build() {
            DomainResponse dr = new DomainResponse();
            dr.id = this.id;
            dr.hostname = this.hostname;
            dr.port = this.port;
            dr.status = this.status;
            dr.daysUntilExpiry = this.daysUntilExpiry;
            dr.lastChecked = this.lastChecked;
            dr.alertDaysBefore = this.alertDaysBefore;
            dr.emailAlertsEnabled = this.emailAlertsEnabled;
            dr.notes = this.notes;
            dr.createdAt = this.createdAt;
            dr.grade = this.grade;
            dr.issuer = this.issuer;
            dr.validUntil = this.validUntil;
            return dr;
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }

    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
}
