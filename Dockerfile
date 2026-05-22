FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY jarfile/Quiz_App_Jar.jar app.jar

EXPOSE ${PORT:-8080}

CMD ["java", "-jar", "app.jar", "--server.port=${PORT:-8080}"]
