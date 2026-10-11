package com.sslchecker.service;

import com.sslchecker.model.SslCertificateRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.net.ssl.*;
import java.net.InetSocketAddress;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

@Service
public class SslCheckerService {

    private static final Logger log = LoggerFactory.getLogger(SslCheckerService.class);

    @Value("${ssl.check.timeout.seconds:10}")
    private int timeoutSeconds;

    /**
     * Performs a full SSL certificate check for the given hostname and port.
     */
    public SslCertificateRecord checkSsl(String hostname, int port) {
        log.info("Checking SSL for {}:{}", hostname, port);

        try {
            SSLContext sslContext = SSLContext.getInstance("TLS");
            TrustManagerWrapper trustWrapper = new TrustManagerWrapper();
            sslContext.init(null, new TrustManager[]{trustWrapper}, new java.security.SecureRandom());

            SSLSocketFactory factory = sslContext.getSocketFactory();

            try (SSLSocket socket = (SSLSocket) factory.createSocket()) {
                socket.connect(new InetSocketAddress(hostname, port), timeoutSeconds * 1000);
                socket.setSoTimeout(timeoutSeconds * 1000);
                socket.setEnabledProtocols(getAvailableProtocols(socket));
                socket.startHandshake();

                SSLSession session = socket.getSession();
                Certificate[] chain = session.getPeerCertificates();

                if (chain == null || chain.length == 0) {
                    throw new RuntimeException("No certificates found");
                }

                X509Certificate leafCert = (X509Certificate) chain[0];
                boolean trusted = trustWrapper.isTrusted();
                boolean hostnameVerified = verifyHostname(hostname, leafCert);
                String[] enabledProtocols = socket.getEnabledProtocols();
                String[] enabledCiphers = socket.getEnabledCipherSuites();

                return buildCertificateRecord(leafCert, chain, hostname, trusted, hostnameVerified,
                        Arrays.asList(enabledProtocols), Arrays.asList(enabledCiphers));
            }

        } catch (Exception e) {
            log.error("SSL check failed for {}:{} - {}", hostname, port, e.getMessage());
            return buildErrorRecord(hostname, e.getMessage());
        }
    }

    private SslCertificateRecord buildCertificateRecord(
            X509Certificate cert,
            Certificate[] chain,
            String hostname,
            boolean trusted,
            boolean hostnameVerified,
            List<String> protocols,
            List<String> ciphers) {

        LocalDateTime validFrom = cert.getNotBefore().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime validUntil = cert.getNotAfter().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime now = LocalDateTime.now();

        long daysRemaining = ChronoUnit.DAYS.between(now, validUntil);

        SslCertificateRecord.CertificateStatus status;
        if (daysRemaining < 0) {
            status = SslCertificateRecord.CertificateStatus.EXPIRED;
        } else if (daysRemaining <= 30) {
            status = SslCertificateRecord.CertificateStatus.EXPIRING_SOON;
        } else {
            status = SslCertificateRecord.CertificateStatus.VALID;
        }

        String issuerDN = cert.getIssuerX500Principal().getName();
        String subjectDN = cert.getSubjectX500Principal().getName();
        String issuerOrg = extractCNFromDN(issuerDN);

        boolean isWildcard = subjectDN.contains("CN=*.") || hasSanWildcard(cert);
        boolean isSelfSigned = cert.getIssuerX500Principal().equals(cert.getSubjectX500Principal());

        List<String> sanList = extractSANs(cert);
        List<SslCertificateRecord.ChainCertInfo> chainInfo = buildChainInfo(chain);
        List<String> vulnerabilities = checkVulnerabilities(protocols, ciphers);

        String grade = calculateGrade(daysRemaining, trusted, hostnameVerified, protocols, ciphers, vulnerabilities);
        int gradeScore = gradeToScore(grade);

        List<String> topCiphers = ciphers.size() > 5 ? ciphers.subList(0, 5) : ciphers;
        List<String> modernProtocols = protocols.stream()
                .filter(p -> !p.equals("SSLv2") && !p.equals("SSLv3"))
                .toList();

        return SslCertificateRecord.builder()
                .issuer(issuerDN)
                .issuerOrg(issuerOrg)
                .subject(subjectDN)
                .serialNumber(cert.getSerialNumber().toString(16))
                .signatureAlgorithm(cert.getSigAlgName())
                .keyAlgorithm(cert.getPublicKey().getAlgorithm())
                .keySize(getKeySize(cert))
                .validFrom(validFrom)
                .validUntil(validUntil)
                .daysRemaining((int) daysRemaining)
                .status(status)
                .grade(grade)
                .gradeScore(gradeScore)
                .isWildcard(isWildcard)
                .isSelfSigned(isSelfSigned)
                .sanList(sanList)
                .chainInfo(chainInfo)
                .protocolsSupported(modernProtocols)
                .cipherSuites(topCiphers)
                .vulnerabilities(vulnerabilities)
                .hostnameVerified(hostnameVerified)
                .isTrusted(trusted)
                .ocspStapling(false)
                .build();
    }

    private SslCertificateRecord buildErrorRecord(String hostname, String errorMessage) {
        return SslCertificateRecord.builder()
                .subject("CN=" + hostname)
                .issuer("Unknown")
                .issuerOrg("Unknown")
                .serialNumber("N/A")
                .signatureAlgorithm("N/A")
                .keyAlgorithm("N/A")
                .keySize(0)
                .status(SslCertificateRecord.CertificateStatus.ERROR)
                .grade("F")
                .gradeScore(0)
                .daysRemaining(0)
                .sanList(List.of())
                .chainInfo(List.of())
                .protocolsSupported(List.of())
                .cipherSuites(List.of())
                .vulnerabilities(List.of("Connection failed: " + errorMessage))
                .hostnameVerified(false)
                .isTrusted(false)
                .build();
    }

    private List<String> extractSANs(X509Certificate cert) {
        List<String> sans = new ArrayList<>();
        try {
            Collection<List<?>> sanCollection = cert.getSubjectAlternativeNames();
            if (sanCollection != null) {
                for (List<?> san : sanCollection) {
                    if (san.size() >= 2) {
                        Integer type = (Integer) san.get(0);
                        if (type == 2 || type == 7) {
                            sans.add(san.get(1).toString());
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error extracting SANs: {}", e.getMessage());
        }
        return sans;
    }

    private List<SslCertificateRecord.ChainCertInfo> buildChainInfo(Certificate[] chain) {
        List<SslCertificateRecord.ChainCertInfo> chainInfoList = new ArrayList<>();
        for (int i = 0; i < chain.length; i++) {
            if (chain[i] instanceof X509Certificate x509) {
                String type = i == 0 ? "end-entity" : (i == chain.length - 1 ? "root" : "intermediate");
                LocalDateTime validFrom = x509.getNotBefore().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                LocalDateTime validUntil = x509.getNotAfter().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

                chainInfoList.add(SslCertificateRecord.ChainCertInfo.builder()
                        .subject(x509.getSubjectX500Principal().getName())
                        .issuer(x509.getIssuerX500Principal().getName())
                        .type(type)
                        .validFrom(validFrom)
                        .validUntil(validUntil)
                        .trusted(true)
                        .build());
            }
        }
        return chainInfoList;
    }

    private List<String> checkVulnerabilities(List<String> protocols, List<String> ciphers) {
        List<String> vulns = new ArrayList<>();

        if (protocols.contains("SSLv2")) vulns.add("SSLv2 enabled (DROWN risk)");
        if (protocols.contains("SSLv3")) vulns.add("SSLv3 enabled (POODLE risk)");
        if (protocols.contains("TLSv1")) vulns.add("TLS 1.0 enabled (deprecated)");
        if (protocols.contains("TLSv1.1")) vulns.add("TLS 1.1 enabled (deprecated)");

        boolean hasWeakCipher = ciphers.stream().anyMatch(c ->
                c.contains("RC4") || c.contains("DES") || c.contains("NULL") ||
                c.contains("EXPORT") || c.contains("anon") || c.contains("MD5"));

        if (hasWeakCipher) vulns.add("Weak cipher suites detected");

        return vulns;
    }

    private String calculateGrade(long daysRemaining, boolean trusted, boolean hostnameVerified,
                                   List<String> protocols, List<String> ciphers, List<String> vulns) {
        if (daysRemaining < 0 || !trusted || !hostnameVerified) return "F";
        if (!vulns.isEmpty()) return "C";

        boolean onlyModern = protocols.stream().noneMatch(p ->
                p.equals("SSLv2") || p.equals("SSLv3") || p.equals("TLSv1") || p.equals("TLSv1.1"));
        boolean hasTls13 = protocols.contains("TLSv1.3");

        if (onlyModern && hasTls13 && daysRemaining > 30) return "A+";
        if (onlyModern && daysRemaining > 14) return "A";
        if (daysRemaining > 7) return "B";
        return "C";
    }

    private int gradeToScore(String grade) {
        return switch (grade) {
            case "A+" -> 100;
            case "A" -> 90;
            case "B" -> 70;
            case "C" -> 50;
            case "D" -> 30;
            default -> 0;
        };
    }

    private String extractCNFromDN(String dn) {
        if (dn == null) return "Unknown";
        String[] parts = dn.split(",");
        for (String part : parts) {
            String trimmed = part.trim();
            if (trimmed.startsWith("O=")) {
                return trimmed.substring(2);
            }
        }
        for (String part : parts) {
            String trimmed = part.trim();
            if (trimmed.startsWith("CN=")) {
                return trimmed.substring(3);
            }
        }
        return "Unknown";
    }

    private boolean hasSanWildcard(X509Certificate cert) {
        try {
            Collection<List<?>> sans = cert.getSubjectAlternativeNames();
            if (sans != null) {
                return sans.stream().anyMatch(san ->
                        san.size() >= 2 && san.get(1).toString().startsWith("*.")
                );
            }
        } catch (Exception ignored) {}
        return false;
    }

    private boolean verifyHostname(String hostname, X509Certificate cert) {
        try {
            Collection<List<?>> sans = cert.getSubjectAlternativeNames();
            if (sans != null) {
                for (List<?> san : sans) {
                    if (san.size() >= 2 && san.get(0).equals(2)) {
                        String sanValue = san.get(1).toString();
                        if (matchesHostname(hostname, sanValue)) return true;
                    }
                }
            }
            String cn = extractCNFromDN(cert.getSubjectX500Principal().getName()).replace("CN=", "");
            return matchesHostname(hostname, cn);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean matchesHostname(String hostname, String pattern) {
        if (pattern.startsWith("*.")) {
            String suffix = pattern.substring(2);
            return hostname.endsWith("." + suffix) || hostname.equals(suffix);
        }
        return hostname.equalsIgnoreCase(pattern);
    }

    private int getKeySize(X509Certificate cert) {
        try {
            String algorithm = cert.getPublicKey().getAlgorithm();
            if ("RSA".equals(algorithm)) {
                java.security.interfaces.RSAPublicKey rsaKey =
                        (java.security.interfaces.RSAPublicKey) cert.getPublicKey();
                return rsaKey.getModulus().bitLength();
            } else if ("EC".equals(algorithm)) {
                java.security.interfaces.ECPublicKey ecKey =
                        (java.security.interfaces.ECPublicKey) cert.getPublicKey();
                return ecKey.getParams().getCurve().getField().getFieldSize();
            }
        } catch (Exception ignored) {}
        return 0;
    }

    private String[] getAvailableProtocols(SSLSocket socket) {
        List<String> protocols = new ArrayList<>(Arrays.asList(socket.getSupportedProtocols()));
        protocols.remove("SSLv2Hello");
        return protocols.toArray(new String[0]);
    }

    private static class TrustManagerWrapper implements X509TrustManager {

        private boolean trusted = true;
        private X509TrustManager defaultTrustManager;

        public TrustManagerWrapper() {
            try {
                javax.net.ssl.TrustManagerFactory tmf =
                        javax.net.ssl.TrustManagerFactory.getInstance(
                                javax.net.ssl.TrustManagerFactory.getDefaultAlgorithm());
                tmf.init((java.security.KeyStore) null);
                for (TrustManager tm : tmf.getTrustManagers()) {
                    if (tm instanceof X509TrustManager) {
                        defaultTrustManager = (X509TrustManager) tm;
                        break;
                    }
                }
            } catch (Exception e) {
                log.error("Failed to initialize default trust manager", e);
            }
        }

        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType) {}

        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType) {
            try {
                if (defaultTrustManager != null) {
                    defaultTrustManager.checkServerTrusted(chain, authType);
                }
            } catch (Exception e) {
                trusted = false;
            }
        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return defaultTrustManager != null ? defaultTrustManager.getAcceptedIssuers() : new X509Certificate[0];
        }

        public boolean isTrusted() {
            return trusted;
        }
    }
}
