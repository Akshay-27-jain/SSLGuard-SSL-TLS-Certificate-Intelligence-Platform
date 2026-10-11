package com.sslchecker.repository;

import com.sslchecker.model.Domain;
import com.sslchecker.model.SslCertificateRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SslCertificateRecordRepository extends JpaRepository<SslCertificateRecord, UUID> {

    List<SslCertificateRecord> findByDomainOrderByCheckedAtDesc(Domain domain);

    Optional<SslCertificateRecord> findFirstByDomainOrderByCheckedAtDesc(Domain domain);

    @Query("SELECT r FROM SslCertificateRecord r WHERE r.domain.id = :domainId ORDER BY r.checkedAt DESC")
    List<SslCertificateRecord> findByDomainIdOrderByCheckedAtDesc(@Param("domainId") UUID domainId);

    @Query("SELECT r FROM SslCertificateRecord r WHERE r.domain.user.id = :userId ORDER BY r.checkedAt DESC")
    List<SslCertificateRecord> findRecentByUserId(@Param("userId") UUID userId,
                                                   org.springframework.data.domain.Pageable pageable);
}
