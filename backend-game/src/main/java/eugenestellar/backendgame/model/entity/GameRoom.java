package eugenestellar.backendgame.model.entity;

import eugenestellar.backendgame.model.GameStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GameRoom {

  private String id;
  private GameStatus status;
  private List<Player> players;

  private Date countdownEndTime; // null if there's no timer
}