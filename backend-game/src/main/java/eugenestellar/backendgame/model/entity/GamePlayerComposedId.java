package eugenestellar.backendgame.model.entity;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;

@Embeddable
@EqualsAndHashCode // tells hibernate to compare GamePlayerComposedId
// by values of the fields inside the object, rather than by addresses
public class GamePlayerComposedId {
  private Long userId;
  private Long gameId;
}