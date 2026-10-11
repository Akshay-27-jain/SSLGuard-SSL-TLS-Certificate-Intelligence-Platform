package com.sslchecker.dto.response;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long totalDomains;
    private long validDomains;
    private long expiringSoonDomains;
    private long expiredDomains;
    private long invalidDomains;
    private long unreachableDomains;
    private List<ExpiryDataPoint> expiryTimeline = new ArrayList<>();
    private Map<String, Long> gradeDistribution = new HashMap<>();

    public DashboardStatsDTO() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalDomains;
        private long validDomains;
        private long expiringSoonDomains;
        private long expiredDomains;
        private long invalidDomains;
        private long unreachableDomains;
        private List<ExpiryDataPoint> expiryTimeline = new ArrayList<>();
        private Map<String, Long> gradeDistribution = new HashMap<>();

        public Builder totalDomains(long totalDomains) { this.totalDomains = totalDomains; return this; }
        public Builder validDomains(long validDomains) { this.validDomains = validDomains; return this; }
        public Builder expiringSoonDomains(long expiringSoonDomains) { this.expiringSoonDomains = expiringSoonDomains; return this; }
        public Builder expiredDomains(long expiredDomains) { this.expiredDomains = expiredDomains; return this; }
        public Builder invalidDomains(long invalidDomains) { this.invalidDomains = invalidDomains; return this; }
        public Builder unreachableDomains(long unreachableDomains) { this.unreachableDomains = unreachableDomains; return this; }
        public Builder expiryTimeline(List<ExpiryDataPoint> expiryTimeline) { this.expiryTimeline = expiryTimeline; return this; }
        public Builder gradeDistribution(Map<String, Long> gradeDistribution) { this.gradeDistribution = gradeDistribution; return this; }

        public DashboardStatsDTO build() {
            DashboardStatsDTO dto = new DashboardStatsDTO();
            dto.totalDomains = this.totalDomains;
            dto.validDomains = this.validDomains;
            dto.expiringSoonDomains = this.expiringSoonDomains;
            dto.expiredDomains = this.expiredDomains;
            dto.invalidDomains = this.invalidDomains;
            dto.unreachableDomains = this.unreachableDomains;
            dto.expiryTimeline = this.expiryTimeline;
            dto.gradeDistribution = this.gradeDistribution;
            return dto;
        }
    }

    public long getTotalDomains() { return totalDomains; }
    public void setTotalDomains(long totalDomains) { this.totalDomains = totalDomains; }

    public long getValidDomains() { return validDomains; }
    public void setValidDomains(long validDomains) { this.validDomains = validDomains; }

    public long getExpiringSoonDomains() { return expiringSoonDomains; }
    public void setExpiringSoonDomains(long expiringSoonDomains) { this.expiringSoonDomains = expiringSoonDomains; }

    public long getExpiredDomains() { return expiredDomains; }
    public void setExpiredDomains(long expiredDomains) { this.expiredDomains = expiredDomains; }

    public long getInvalidDomains() { return invalidDomains; }
    public void setInvalidDomains(long invalidDomains) { this.invalidDomains = invalidDomains; }

    public long getUnreachableDomains() { return unreachableDomains; }
    public void setUnreachableDomains(long unreachableDomains) { this.unreachableDomains = unreachableDomains; }

    public List<ExpiryDataPoint> getExpiryTimeline() { return expiryTimeline; }
    public void setExpiryTimeline(List<ExpiryDataPoint> expiryTimeline) { this.expiryTimeline = expiryTimeline; }

    public Map<String, Long> getGradeDistribution() { return gradeDistribution; }
    public void setGradeDistribution(Map<String, Long> gradeDistribution) { this.gradeDistribution = gradeDistribution; }

    public static class ExpiryDataPoint {
        private String domain;
        private int daysRemaining;
        private String status;

        public ExpiryDataPoint() {}

        public ExpiryDataPoint(String domain, int daysRemaining, String status) {
            this.domain = domain;
            this.daysRemaining = daysRemaining;
            this.status = status;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private String domain;
            private int daysRemaining;
            private String status;

            public Builder domain(String domain) { this.domain = domain; return this; }
            public Builder daysRemaining(int daysRemaining) { this.daysRemaining = daysRemaining; return this; }
            public Builder status(String status) { this.status = status; return this; }

            public ExpiryDataPoint build() {
                return new ExpiryDataPoint(domain, daysRemaining, status);
            }
        }

        public String getDomain() { return domain; }
        public void setDomain(String domain) { this.domain = domain; }

        public int getDaysRemaining() { return daysRemaining; }
        public void setDaysRemaining(int daysRemaining) { this.daysRemaining = daysRemaining; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
