package aliya.edumatch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "aliya.edumatch")
public class EdumatchApplication {
    public static void main(String[] args) {
        SpringApplication.run(EdumatchApplication.class, args);
    }
}

