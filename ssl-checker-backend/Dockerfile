# ========================================================
# SSLGuard Backend - Multi-Stage Production Dockerfile
# ========================================================

# Stage 1: Build stage with Maven and OpenJDK 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code and compile optimized production JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal, secure runtime stage with Temurin JRE 17
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Create non-root application user for container security hardening
RUN addgroup -S sslguard && adduser -S sslguard -G sslguard

# Copy executable jar from builder stage
COPY --from=builder /app/target/ssl-checker-backend-*.jar app.jar
RUN chown -R sslguard:sslguard /app

USER sslguard

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
