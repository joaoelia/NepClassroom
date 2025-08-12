# Dockerfile para backend Spring Boot
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY target/nep-backend-0.0.1-SNAPSHOT.jar app.jar

# Cria diretório para uploads de vídeos
RUN mkdir -p /app/uploads/videos

VOLUME ["/app/uploads/videos"]

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
