package eugenestellar.backendgame.websocket;

import eugenestellar.backendgame.service.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  private final CustomHandshakeInterceptor customHandshakeInterceptor;

  public WebSocketConfig(CustomHandshakeInterceptor customHandshakeInterceptor) {
    this.customHandshakeInterceptor = customHandshakeInterceptor;
  }

  @Value("${FRONTEND_URL}")
  private String frontendUrl;

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/topic", "/queue"); // Префикс для маршрутов, на которые клиенты будут подписываться
    registry.setApplicationDestinationPrefixes("/app"); // Префикс для маршрутов, по которым клиенты будут отправлять сообщения
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws-game")
        .addInterceptors(customHandshakeInterceptor)
        .setHandshakeHandler(new CustomHandshakeHandler())
        .setAllowedOrigins(frontendUrl);
  }
}