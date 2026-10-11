package com.sslchecker.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "alert_configs")
public class AlertConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain_id")
    private Domain domain;

    @Column(name = "alert_days_before")
    private int alertDaysBefore = 30;

    @Column(name = "email_enabled")
    private boolean emailEnabled = true;

    @Column(name = "webhook_url")
    private String webhookUrl;

    @Column(name = "slack_webhook_url")
    private String slackWebhookUrl;

    @Column(name = "last_notified")
    private LocalDateTime lastNotified;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public AlertConfig() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private User user;
        private Domain domain;
        private int alertDaysBefore = 30;
        private boolean emailEnabled = true;
        private String webhookUrl;
        private String slackWebhookUrl;
        private LocalDateTime lastNotified;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder domain(Domain domain) { this.domain = domain; return this; }
        public Builder alertDaysBefore(int alertDaysBefore) { this.alertDaysBefore = alertDaysBefore; return this; }
        public Builder emailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; return this; }
        public Builder webhookUrl(String webhookUrl) { this.webhookUrl = webhookUrl; return this; }
        public Builder slackWebhookUrl(String slackWebhookUrl) { this.slackWebhookUrl = slackWebhookUrl; return this; }
        public Builder lastNotified(LocalDateTime lastNotified) { this.lastNotified = lastNotified; return this; }

        public AlertConfig build() {
            AlertConfig ac = new AlertConfig();
            ac.id = this.id;
            ac.user = this.user;
            ac.domain = this.domain;
            ac.alertDaysBefore = this.alertDaysBefore;
            ac.emailEnabled = this.emailEnabled;
            ac.webhookUrl = this.webhookUrl;
            ac.slackWebhookUrl = this.slackWebhookUrl;
            ac.lastNotified = this.lastNotified;
            return ac;
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }

    public int getAlertDaysBefore() { return alertDaysBefore; }
    public void setAlertDaysBefore(int alertDaysBefore) { this.alertDaysBefore = alertDaysBefore; }

    public boolean isEmailEnabled() { return emailEnabled; }
    public void setEmailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; }

    public String getWebhookUrl() { return webhookUrl; }
    public void setWebhookUrl(String webhookUrl) { this.webhookUrl = webhookUrl; }

    public String getSlackWebhookUrl() { return slackWebhookUrl; }
    public void setSlackWebhookUrl(String slackWebhookUrl) { this.slackWebhookUrl = slackWebhookUrl; }

    public LocalDateTime getLastNotified() { return lastNotified; }
    public void setLastNotified(LocalDateTime lastNotified) { this.lastNotified = lastNotified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
