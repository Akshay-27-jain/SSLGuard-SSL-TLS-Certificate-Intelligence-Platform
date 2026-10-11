package com.sslchecker.dto.response;

import com.sslchecker.model.SslCertificateRecord;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SslCertificateDTO {
    private UUID id;
    private String issuer;
    private String issuerOrg;
    private String subject;
    private String serialNumber;
    private String signatureAlgorithm;
    private String keyAlgorithm;
    private Integer keySize;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Integer daysRemaining;
    private String status;
    private String grade;
    private Integer gradeScore;
    private boolean isWildcard;
    private boolean isSelfSigned;
    private List<String> sanList = new ArrayList<>();
    private List<SslCertificateRecord.ChainCertInfo> chainInfo = new ArrayList<>();
    private List<String> protocolsSupported = new ArrayList<>();
    private List<String> cipherSuites = new ArrayList<>();
    private List<String> vulnerabilities = new ArrayList<>();
    private boolean hostnameVerified;
    private boolean isTrusted;
    private LocalDateTime checkedAt;

    public SslCertificateDTO() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private String issuer;
        private String issuerOrg;
        private String subject;
        private String serialNumber;
        private String signatureAlgorithm;
        private String keyAlgorithm;
        private Integer keySize;
        private LocalDateTime validFrom;
        private LocalDateTime validUntil;
        private Integer daysRemaining;
        private String status;
        private String grade;
        private Integer gradeScore;
        private boolean isWildcard;
        private boolean isSelfSigned;
        private List<String> sanList = new ArrayList<>();
        private List<SslCertificateRecord.ChainCertInfo> chainInfo = new ArrayList<>();
        private List<String> protocolsSupported = new ArrayList<>();
        private List<String> cipherSuites = new ArrayList<>();
        private List<String> vulnerabilities = new ArrayList<>();
        private boolean hostnameVerified;
        private boolean isTrusted;
        private LocalDateTime checkedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder issuer(String issuer) { this.issuer = issuer; return this; }
        public Builder issuerOrg(String issuerOrg) { this.issuerOrg = issuerOrg; return this; }
        public Builder subject(String subject) { this.subject = subject; return this; }
        public Builder serialNumber(String serialNumber) { this.serialNumber = serialNumber; return this; }
        public Builder signatureAlgorithm(String signatureAlgorithm) { this.signatureAlgorithm = signatureAlgorithm; return this; }
        public Builder keyAlgorithm(String keyAlgorithm) { this.keyAlgorithm = keyAlgorithm; return this; }
        public Builder keySize(Integer keySize) { this.keySize = keySize; return this; }
        public Builder validFrom(LocalDateTime validFrom) { this.validFrom = validFrom; return this; }
        public Builder validUntil(LocalDateTime validUntil) { this.validUntil = validUntil; return this; }
        public Builder daysRemaining(Integer daysRemaining) { this.daysRemaining = daysRemaining; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder grade(String grade) { this.grade = grade; return this; }
        public Builder gradeScore(Integer gradeScore) { this.gradeScore = gradeScore; return this; }
        public Builder isWildcard(boolean isWildcard) { this.isWildcard = isWildcard; return this; }
        public Builder isSelfSigned(boolean isSelfSigned) { this.isSelfSigned = isSelfSigned; return this; }
        public Builder sanList(List<String> sanList) { this.sanList = sanList; return this; }
        public Builder chainInfo(List<SslCertificateRecord.ChainCertInfo> chainInfo) { this.chainInfo = chainInfo; return this; }
        public Builder protocolsSupported(List<String> protocolsSupported) { this.protocolsSupported = protocolsSupported; return this; }
        public Builder cipherSuites(List<String> cipherSuites) { this.cipherSuites = cipherSuites; return this; }
        public Builder vulnerabilities(List<String> vulnerabilities) { this.vulnerabilities = vulnerabilities; return this; }
        public Builder hostnameVerified(boolean hostnameVerified) { this.hostnameVerified = hostnameVerified; return this; }
        public Builder isTrusted(boolean isTrusted) { this.isTrusted = isTrusted; return this; }
        public Builder checkedAt(LocalDateTime checkedAt) { this.checkedAt = checkedAt; return this; }

        public SslCertificateDTO build() {
            SslCertificateDTO dto = new SslCertificateDTO();
            dto.id = this.id;
            dto.issuer = this.issuer;
            dto.issuerOrg = this.issuerOrg;
            dto.subject = this.subject;
            dto.serialNumber = this.serialNumber;
            dto.signatureAlgorithm = this.signatureAlgorithm;
            dto.keyAlgorithm = this.keyAlgorithm;
            dto.keySize = this.keySize;
            dto.validFrom = this.validFrom;
            dto.validUntil = this.validUntil;
            dto.daysRemaining = this.daysRemaining;
            dto.status = this.status;
            dto.grade = this.grade;
            dto.gradeScore = this.gradeScore;
            dto.isWildcard = this.isWildcard;
            dto.isSelfSigned = this.isSelfSigned;
            dto.sanList = this.sanList;
            dto.chainInfo = this.chainInfo;
            dto.protocolsSupported = this.protocolsSupported;
            dto.cipherSuites = this.cipherSuites;
            dto.vulnerabilities = this.vulnerabilities;
            dto.hostnameVerified = this.hostnameVerified;
            dto.isTrusted = this.isTrusted;
            dto.checkedAt = this.checkedAt;
            return dto;
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public String getIssuerOrg() { return issuerOrg; }
    public void setIssuerOrg(String issuerOrg) { this.issuerOrg = issuerOrg; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getSignatureAlgorithm() { return signatureAlgorithm; }
    public void setSignatureAlgorithm(String signatureAlgorithm) { this.signatureAlgorithm = signatureAlgorithm; }

    public String getKeyAlgorithm() { return keyAlgorithm; }
    public void setKeyAlgorithm(String keyAlgorithm) { this.keyAlgorithm = keyAlgorithm; }

    public Integer getKeySize() { return keySize; }
    public void setKeySize(Integer keySize) { this.keySize = keySize; }

    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }

    public Integer getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(Integer daysRemaining) { this.daysRemaining = daysRemaining; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public Integer getGradeScore() { return gradeScore; }
    public void setGradeScore(Integer gradeScore) { this.gradeScore = gradeScore; }

    public boolean isWildcard() { return isWildcard; }
    public void setWildcard(boolean wildcard) { isWildcard = wildcard; }

    public boolean isSelfSigned() { return isSelfSigned; }
    public void setSelfSigned(boolean selfSigned) { isSelfSigned = selfSigned; }

    public List<String> getSanList() { return sanList; }
    public void setSanList(List<String> sanList) { this.sanList = sanList; }

    public List<SslCertificateRecord.ChainCertInfo> getChainInfo() { return chainInfo; }
    public void setChainInfo(List<SslCertificateRecord.ChainCertInfo> chainInfo) { this.chainInfo = chainInfo; }

    public List<String> getProtocolsSupported() { return protocolsSupported; }
    public void setProtocolsSupported(List<String> protocolsSupported) { this.protocolsSupported = protocolsSupported; }

    public List<String> getCipherSuites() { return cipherSuites; }
    public void setCipherSuites(List<String> cipherSuites) { this.cipherSuites = cipherSuites; }

    public List<String> getVulnerabilities() { return vulnerabilities; }
    public void setVulnerabilities(List<String> vulnerabilities) { this.vulnerabilities = vulnerabilities; }

    public boolean isHostnameVerified() { return hostnameVerified; }
    public void setHostnameVerified(boolean hostnameVerified) { this.hostnameVerified = hostnameVerified; }

    public boolean isTrusted() { return isTrusted; }
    public void setTrusted(boolean trusted) { this.isTrusted = trusted; }

    public LocalDateTime getCheckedAt() { return checkedAt; }
    public void setCheckedAt(LocalDateTime checkedAt) { this.checkedAt = checkedAt; }
}
