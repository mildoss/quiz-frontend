package eugenestellar.backendgame.model.entity;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;

@Embeddable
@EqualsAndHashCode // tells hibernate to compare GamePlayerComposedId
// not by addresses and by values of the fields inside the object
public class GamePlayerComposedId {
  private Long userId;
  private Long gameId;
}