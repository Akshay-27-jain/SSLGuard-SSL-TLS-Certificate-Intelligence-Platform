package com.sslchecker.dto.request;

import jakarta.validation.constraints.NotBlank;

public class DomainRequest {

    @NotBlank(message = "Hostname is required")
    private String hostname;

    private Integer port = 443;

    private String notes;

    private Integer alertDaysBefore = 30;

    private boolean emailAlertsEnabled = true;

    public DomainRequest() {}

    public DomainRequest(String hostname, Integer port, String notes, Integer alertDaysBefore, boolean emailAlertsEnabled) {
        this.hostname = hostname;
        this.port = port != null ? port : 443;
        this.notes = notes;
        this.alertDaysBefore = alertDaysBefore != null ? alertDaysBefore : 30;
        this.emailAlertsEnabled = emailAlertsEnabled;
    }

    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }

    public Integer getPort() { return port; }
    public void setPort(Integer port) { this.port = port; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getAlertDaysBefore() { return alertDaysBefore; }
    public void setAlertDaysBefore(Integer alertDaysBefore) { this.alertDaysBefore = alertDaysBefore; }

    public boolean isEmailAlertsEnabled() { return emailAlertsEnabled; }
    public void setEmailAlertsEnabled(boolean emailAlertsEnabled) { this.emailAlertsEnabled = emailAlertsEnabled; }
}
