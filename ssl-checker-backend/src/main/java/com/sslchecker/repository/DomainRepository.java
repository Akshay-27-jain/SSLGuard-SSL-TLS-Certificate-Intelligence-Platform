package com.sslchecker.repository;

import com.sslchecker.model.Domain;
import com.sslchecker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DomainRepository extends JpaRepository<Domain, UUID> {

    List<Domain> findByUserOrderByCreatedAtDesc(User user);

    Optional<Domain> findByIdAndUser(UUID id, User user);

    boolean existsByHostnameAndUser(String hostname, User user);

    @Query("SELECT d FROM Domain d WHERE d.user = :user AND d.status = :status")
    List<Domain> findByUserAndStatus(@Param("user") User user,
                                      @Param("status") Domain.DomainStatus status);

    @Query("SELECT COUNT(d) FROM Domain d WHERE d.user = :user")
    long countByUser(@Param("user") User user);

    @Query("SELECT COUNT(d) FROM Domain d WHERE d.user = :user AND d.status = :status")
    long countByUserAndStatus(@Param("user") User user,
                               @Param("status") Domain.DomainStatus status);

    @Query("SELECT d FROM Domain d WHERE d.emailAlertsEnabled = true AND d.daysUntilExpiry <= d.alertDaysBefore AND d.daysUntilExpiry > 0")
    List<Domain> findDomainsNeedingAlerts();

    @Query("SELECT d FROM Domain d ORDER BY d.lastChecked ASC NULLS FIRST")
    List<Domain> findAllOrderByLastCheckedAsc();
}
