//package eugenestellar.backendgame.websocket;
//
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.web.socket.WebSocketHandler;
//import org.springframework.web.socket.server.HandshakeInterceptor;
//
//import java.util.Map;
//
//@Slf4j
//public class WsHandshakeLoggingInterceptor implements HandshakeInterceptor {
//
//  @Override
//  public boolean beforeHandshake(
//      ServerHttpRequest request,
//      ServerHttpResponse response,
//      WebSocketHandler wsHandler,
//      Map<String, Object> attributes
//  ) {
//    log.info("🔥 WS HANDSHAKE REQUEST");
//    log.info("URI: {}", request.getURI());
//    log.info("Headers: {}", request.getHeaders());
//    return true; // ВАЖНО
//  }
//
//  @Override
//  public void afterHandshake(
//      ServerHttpRequest request,
//      ServerHttpResponse response,
//      WebSocketHandler wsHandler,
//      Exception exception
//  ) {
//    log.info("🔥 WS HANDSHAKE RESPONSE status={}", response.setStatusCode());
//    if (exception != null) {
//      log.error("🔥 WS HANDSHAKE EXCEPTION", exception);
//    }
//  }
//}
