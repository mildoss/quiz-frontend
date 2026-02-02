package eugenestellar.quiz.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

  private final ObjectMapper objectMapper;

  public TestController(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @GetMapping
  public ResponseEntity<String> sendString() throws JsonProcessingException {
    String json = objectMapper.writeValueAsString(Map.of("status", "success"));

    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_JSON)
        .body(json);
  }
}