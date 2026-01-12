//package eugenestellar.backendgame.websocket;
//
//import eugenestellar.backendgame.model.entity.Game;
//import eugenestellar.backendgame.repository.GameRepo;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.CloseStatus;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//@Component
//public class CustomWebSocketHandler extends TextWebSocketHandler {
//
//  private final GameRepo gameRepo;
//
//  public CustomWebSocketHandler(GameRepo gameRepo) {
//    this.gameRepo = gameRepo;
//  }
//
//  @Override
//  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//    super.afterConnectionEstablished(session);
//    Game game = gameRepo.findById(45L).orElseThrow();
//    // session.sendMessage(new game));
//    session.sendMessage(new TextMessage("Burdovka"));
//
//  }
//
//  @Override
//  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//    super.afterConnectionClosed(session, status);
//  }
//
//  @Override
//  public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
//    super.handleMessage(session, message);
//  }
//}