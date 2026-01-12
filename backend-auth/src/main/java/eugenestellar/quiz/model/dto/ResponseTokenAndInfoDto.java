package eugenestellar.quiz.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter @AllArgsConstructor @NoArgsConstructor
public class ResponseTokenAndInfoDto {
  private String token;
  private long id;
  private String username;
}