package com.sslchecker.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ssl_certificate_records")
public class SslCertificateRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain_id", nullable = true)
    private Domain domain;

    @Column(nullable = false)
    private String issuer;

    @Column(name = "issuer_org")
    private String issuerOrg;

    @Column(nullable = false)
    private String subject;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "signature_algorithm")
    private String signatureAlgorithm;

    @Column(name = "key_algorithm")
    private String keyAlgorithm;

    @Column(name = "key_size")
    private Integer keySize;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "days_remaining")
    private Integer daysRemaining;

    @Enumerated(EnumType.STRING)
    private CertificateStatus status;

    @Column(name = "grade")
    private String grade;

    @Column(name = "grade_score")
    private Integer gradeScore;

    @Column(name = "is_wildcard")
    private boolean isWildcard;

    @Column(name = "is_self_signed")
    private boolean isSelfSigned;

    @Column(name = "san_list", columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> sanList = new ArrayList<>();

    @Column(name = "chain_info", columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<ChainCertInfo> chainInfo = new ArrayList<>();

    @Column(name = "protocols_supported", columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> protocolsSupported = new ArrayList<>();

    @Column(name = "cipher_suites", columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> cipherSuites = new ArrayList<>();

    @Column(name = "vulnerabilities", columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> vulnerabilities = new ArrayList<>();

    @Column(name = "hostname_verified")
    private boolean hostnameVerified;

    @Column(name = "is_trusted")
    private boolean isTrusted;

    @Column(name = "ocsp_stapling")
    private boolean ocspStapling;

    @CreationTimestamp
    @Column(name = "checked_at", updatable = false)
    private LocalDateTime checkedAt;

    public SslCertificateRecord() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private Domain domain;
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
        private CertificateStatus status;
        private String grade;
        private Integer gradeScore;
        private boolean isWildcard;
        private boolean isSelfSigned;
        private List<String> sanList = new ArrayList<>();
        private List<ChainCertInfo> chainInfo = new ArrayList<>();
        private List<String> protocolsSupported = new ArrayList<>();
        private List<String> cipherSuites = new ArrayList<>();
        private List<String> vulnerabilities = new ArrayList<>();
        private boolean hostnameVerified;
        private boolean isTrusted;
        private boolean ocspStapling;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder domain(Domain domain) { this.domain = domain; return this; }
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
        public Builder status(CertificateStatus status) { this.status = status; return this; }
        public Builder grade(String grade) { this.grade = grade; return this; }
        public Builder gradeScore(Integer gradeScore) { this.gradeScore = gradeScore; return this; }
        public Builder isWildcard(boolean isWildcard) { this.isWildcard = isWildcard; return this; }
        public Builder isSelfSigned(boolean isSelfSigned) { this.isSelfSigned = isSelfSigned; return this; }
        public Builder sanList(List<String> sanList) { this.sanList = sanList; return this; }
        public Builder chainInfo(List<ChainCertInfo> chainInfo) { this.chainInfo = chainInfo; return this; }
        public Builder protocolsSupported(List<String> protocolsSupported) { this.protocolsSupported = protocolsSupported; return this; }
        public Builder cipherSuites(List<String> cipherSuites) { this.cipherSuites = cipherSuites; return this; }
        public Builder vulnerabilities(List<String> vulnerabilities) { this.vulnerabilities = vulnerabilities; return this; }
        public Builder hostnameVerified(boolean hostnameVerified) { this.hostnameVerified = hostnameVerified; return this; }
        public Builder isTrusted(boolean isTrusted) { this.isTrusted = isTrusted; return this; }
        public Builder ocspStapling(boolean ocspStapling) { this.ocspStapling = ocspStapling; return this; }

        public SslCertificateRecord build() {
            SslCertificateRecord r = new SslCertificateRecord();
            r.id = this.id;
            r.domain = this.domain;
            r.issuer = this.issuer;
            r.issuerOrg = this.issuerOrg;
            r.subject = this.subject;
            r.serialNumber = this.serialNumber;
            r.signatureAlgorithm = this.signatureAlgorithm;
            r.keyAlgorithm = this.keyAlgorithm;
            r.keySize = this.keySize;
            r.validFrom = this.validFrom;
            r.validUntil = this.validUntil;
            r.daysRemaining = this.daysRemaining;
            r.status = this.status;
            r.grade = this.grade;
            r.gradeScore = this.gradeScore;
            r.isWildcard = this.isWildcard;
            r.isSelfSigned = this.isSelfSigned;
            r.sanList = this.sanList;
            r.chainInfo = this.chainInfo;
            r.protocolsSupported = this.protocolsSupported;
            r.cipherSuites = this.cipherSuites;
            r.vulnerabilities = this.vulnerabilities;
            r.hostnameVerified = this.hostnameVerified;
            r.isTrusted = this.isTrusted;
            r.ocspStapling = this.ocspStapling;
            return r;
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }

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

    public CertificateStatus getStatus() { return status; }
    public void setStatus(CertificateStatus status) { this.status = status; }

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

    public List<ChainCertInfo> getChainInfo() { return chainInfo; }
    public void setChainInfo(List<ChainCertInfo> chainInfo) { this.chainInfo = chainInfo; }

    public List<String> getProtocolsSupported() { return protocolsSupported; }
    public void setProtocolsSupported(List<String> protocolsSupported) { this.protocolsSupported = protocolsSupported; }

    public List<String> getCipherSuites() { return cipherSuites; }
    public void setCipherSuites(List<String> cipherSuites) { this.cipherSuites = cipherSuites; }

    public List<String> getVulnerabilities() { return vulnerabilities; }
    public void setVulnerabilities(List<String> vulnerabilities) { this.vulnerabilities = vulnerabilities; }

    public boolean isHostnameVerified() { return hostnameVerified; }
    public void setHostnameVerified(boolean hostnameVerified) { this.hostnameVerified = hostnameVerified; }

    public boolean isTrusted() { return isTrusted; }
    public void setTrusted(boolean trusted) { isTrusted = trusted; }

    public boolean isOcspStapling() { return ocspStapling; }
    public void setOcspStapling(boolean ocspStapling) { this.ocspStapling = ocspStapling; }

    public LocalDateTime getCheckedAt() { return checkedAt; }
    public void setCheckedAt(LocalDateTime checkedAt) { this.checkedAt = checkedAt; }

    public enum CertificateStatus {
        VALID, EXPIRING_SOON, EXPIRED, INVALID, ERROR
    }

    public static class ChainCertInfo {
        private String subject;
        private String issuer;
        private String type;
        private LocalDateTime validFrom;
        private LocalDateTime validUntil;
        private boolean trusted;

        public ChainCertInfo() {}

        public ChainCertInfo(String subject, String issuer, String type, LocalDateTime validFrom, LocalDateTime validUntil, boolean trusted) {
            this.subject = subject;
            this.issuer = issuer;
            this.type = type;
            this.validFrom = validFrom;
            this.validUntil = validUntil;
            this.trusted = trusted;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private String subject;
            private String issuer;
            private String type;
            private LocalDateTime validFrom;
            private LocalDateTime validUntil;
            private boolean trusted;

            public Builder subject(String subject) { this.subject = subject; return this; }
            public Builder issuer(String issuer) { this.issuer = issuer; return this; }
            public Builder type(String type) { this.type = type; return this; }
            public Builder validFrom(LocalDateTime validFrom) { this.validFrom = validFrom; return this; }
            public Builder validUntil(LocalDateTime validUntil) { this.validUntil = validUntil; return this; }
            public Builder trusted(boolean trusted) { this.trusted = trusted; return this; }

            public ChainCertInfo build() {
                return new ChainCertInfo(subject, issuer, type, validFrom, validUntil, trusted);
            }
        }

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public LocalDateTime getValidFrom() { return validFrom; }
        public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }
        public LocalDateTime getValidUntil() { return validUntil; }
        public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
        public boolean isTrusted() { return trusted; }
        public void setTrusted(boolean trusted) { this.trusted = trusted; }
    }
}
