//package eugenestellar.backendgame.controller;
//
//import eugenestellar.backendgame.model.GameRoom;
//import eugenestellar.backendgame.model.JoinRoomResponse;
//import eugenestellar.backendgame.model.UserInfoDto;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.messaging.simp.annotation.SendToUser;
//import org.springframework.stereotype.Controller;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//import java.util.Random;
//
//@Controller
//public class TestSpreadMsgController {
//
//  private final SimpMessagingTemplate messagingTemplate;
//  private List<GameRoom> gameRooms = new ArrayList<>();
//  private long nextRoomId = 1;
//
//  public TestSpreadMsgController(SimpMessagingTemplate messagingTemplate) {
//    this.messagingTemplate = messagingTemplate;
//  }
//
//  @MessageMapping("/join-room") // destination for a client
//  @SendToUser("/queue/reply") // destination for a server
//  public JoinRoomResponse putUserIntoRoom(UserInfoDto userInfoDto) {
//
//    GameRoom targetRoom = null;
//
//    for (GameRoom gameRoom : gameRooms) {
//      if (gameRoom.getPlayers().size() < 4) {
//        targetRoom = gameRoom;
//        break;
//      }
//    }
//    if (targetRoom == null) {
//      targetRoom = new GameRoom();
//      targetRoom.setSessionId(nextRoomId++);
//      targetRoom.setPlayers(new ArrayList<>());
//      gameRooms.add(targetRoom);
//    }
//
//    targetRoom.getPlayers().add(userInfoDto);
//
//    String topic = "/topic/room/" + targetRoom.getSessionId();
//    messagingTemplate.convertAndSend(topic, targetRoom.getPlayers());
//
//    return new JoinRoomResponse(targetRoom.getSessionId(), targetRoom.getPlayers());
//  }
//}
//
////    for (GameRoom gameRoom : gameRooms) {
////      System.out.println(gameRoom.getSessionId());
////      for (UserInfoDto infoDto : gameRoom.getPlayers()) {
////        System.out.println(infoDto.getId() + " " + infoDto.getUsername());
////      }
////      System.out.println();
////      System.out.println();
////    }