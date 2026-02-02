package eugenestellar.backendgame.websocket;

import eugenestellar.backendgame.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Component
public class WsEventListener {

  private static final Logger log = LoggerFactory.getLogger(WsEventListener.class);
  private final GameService gameService;

  public WsEventListener(@Lazy GameService gameService) {
    this.gameService = gameService;
  }

  @EventListener
  public void handleWsDisconnectListener(SessionDisconnectEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();

    if (sessionAttributes != null) {
      Long userId = (Long) sessionAttributes.get("userId");
      if (userId != null) {
        log.info("User Disconnected: " + userId);
        gameService.disconnectGameRoom(userId);
      }
    }
  }

}