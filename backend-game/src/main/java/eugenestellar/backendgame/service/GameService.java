//package eugenestellar.backendgame.service;
//
//import eugenestellar.backendgame.model.GameRoom;
//import eugenestellar.backendgame.model.UserInfoDto;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//public class GameService {
//
//  private final SimpMessagingTemplate messagingTemplate;
//
//  public GameService(SimpMessagingTemplate messagingTemplate) {
//    this.messagingTemplate = messagingTemplate;
//  }
//
//
//  public void joinGameRoom(UserInfoDto user) {
//    GameRoom session = new GameRoom();
//    if (session.getPlayers().size() < 4) {
//      session.addPlayer(user);
//
//  }
//
//}