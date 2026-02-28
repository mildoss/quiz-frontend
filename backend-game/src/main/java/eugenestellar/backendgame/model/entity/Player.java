package eugenestellar.backendgame.model.entity;

import eugenestellar.backendgame.model.PlayerStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Player {

  private String username;
  private Long id;
  private PlayerStatus playerStatus;

}