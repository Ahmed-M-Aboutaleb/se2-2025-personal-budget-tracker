# Stage 1: build the jar
FROM maven:3.9.9-eclipse-temurin-24 AS build
WORKDIR /app

# Copy only what’s needed to download dependencies (speed up caching)
COPY pom.xml .
COPY src ./src

# Build without running tests to save time (remove -DskipTests if you want tests)
RUN mvn clean package -DskipTests

# Stage 2: run the jar
FROM eclipse-temurin:24-jdk-alpine
WORKDIR /app

# Copy the built jar from the previous stage
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/src/main/resources/configurations /config

# Expose the default port (override with SERVICE_PORT env)
EXPOSE 8888

# Run the jar
ENTRYPOINT ["java","-jar","app.jar"]
