Open src/main/resources/application.properties and update your credentials:

spring.datasource.url=jdbc:mysql://localhost:3306/netflix_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update


to build and run :
# Install dependencies
mvn clean install

# Start the application
mvn spring-boot:run
