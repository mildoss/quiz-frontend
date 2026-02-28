package eugenestellar.backendgame.service;

import eugenestellar.backendgame.model.GameStatus;
import eugenestellar.backendgame.model.PlayerStatus;
import eugenestellar.backendgame.model.dto.GameRoomDto;
import eugenestellar.backendgame.model.entity.Game;
import eugenestellar.backendgame.model.entity.GameRoom;
import eugenestellar.backendgame.model.dto.UserInfoDto;
import eugenestellar.backendgame.model.entity.Player;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Slf4j
@Service
public class GameService {

  private static final int MAX_PLAYERS = 4;

  private final SimpMessagingTemplate messagingTemplate;
  private final Map<String, GameRoom> gameRooms = new ConcurrentHashMap<>();
  // timers, ScheduledFuture<?> is a reference to expiredTimer() method i.e.
  // expiredTimer() executes only when it's time to do so
  private final Map<String , ScheduledFuture<?>> timers = new ConcurrentHashMap<>();
  private final TaskScheduler taskScheduler;

  public GameService(SimpMessagingTemplate messagingTemplate, TaskScheduler taskScheduler) {
    this.messagingTemplate = messagingTemplate;
    this.taskScheduler = taskScheduler;
  }

  public String getPlayerState(Long userId) {
    Optional<GameRoom> gameRoomOpt = findGameRoomByPlayerId(userId);
    if (gameRoomOpt.isEmpty()) {
      return "NOT_IN_GAME";
    }

    for (Player player : gameRoomOpt.get().getPlayers()) {
      if (player.getId().equals(userId)) {
        return player.getPlayerStatus().toString();
      }
    }
    // just in case
    return "NOT_IN_GAME";
  }

  public synchronized GameRoomDto joinGameRoom(UserInfoDto user) {
    // checking whether it does any room contain the user or not,
    // if yes then return the user in that room and change its status on CONNECTED,
    // if no then it is placed in a room with a free capacity
    // or creating a new one.

    GameRoom targetRoom;
    Long userId = user.getId();
    // checking whether it does any room contain the user or not
    Optional<GameRoom> existingGameRoomOpt = findGameRoomByPlayerId(userId);
    if (existingGameRoomOpt.isPresent()) {
      targetRoom = existingGameRoomOpt.get();

      for (Player p : targetRoom.getPlayers()) {
        if (p.getId().equals(userId)) {
          p.setPlayerStatus(PlayerStatus.CONNECTED);
          break;
        }
      }
    } /* looking for a new GameRoom or creating it */
      else {
        Optional<GameRoom> optionalGameRoom = findAvailableGameRoom();
        // A Short way: GameRoom targetGameRoom = findAvailableGameRoom()
        //    .orElseGet(this::createGameRoom);
        if (optionalGameRoom.isPresent()) {
          targetRoom = optionalGameRoom.get();
        } else {
          targetRoom = createGameRoom();
        }
        targetRoom.getPlayers().add(new Player(
            user.getUsername(),
            userId,
            PlayerStatus.CONNECTED));
    }

    int playersQuantity = targetRoom.getPlayers().size();
    String gameTopic = "/topic/game_room/" + targetRoom.getId();

    // 2 players -> start timer
    // TODO: if at least two of players are CONNECTED
    if (playersQuantity == 2 && targetRoom.getStatus() == GameStatus.WAITING) {
      targetRoom.setStatus(GameStatus.COUNTDOWN);

      // timer propagation
      Instant endTimeInst = ZonedDateTime.now().plusSeconds(60).toInstant();
      Date endTime = Date.from(endTimeInst);
      targetRoom.setCountdownEndTime(endTime);

      ScheduledFuture<?> timerTask = taskScheduler
          .schedule(
              () -> expiredTimer(targetRoom), endTimeInst
          );

      timers.put(targetRoom.getId(), timerTask);
    }

    // 4 players -> countdown finished and start game
    if (playersQuantity == MAX_PLAYERS) {
      // cancelTimer(targetRoom);
      ScheduledFuture<?> timer = timers.remove(targetRoom.getId());
      // if there's a task cancel it i.e. cancel the timer
      if (timer != null) {
        timer.cancel(false);
      }

      targetRoom.setCountdownEndTime(null);
      startGame(targetRoom);
    }

    // sending the topic(of this room) to client so that he could subscribe on it and
    // sending to all player the current list of players
    messagingTemplate.convertAndSend(gameTopic, targetRoom);

    // return topic(of this room) to this user and the list of players in the room
    return new GameRoomDto(gameTopic, targetRoom);
  }

  private void expiredTimer(GameRoom room) {
    // status can be active if 4 players started at the same time
    if (room != null && room.getStatus() == GameStatus.COUNTDOWN) {
      startGame(room);
      room.setCountdownEndTime(null);
      timers.remove(room.getId());

      messagingTemplate.convertAndSend("/topic/game_room/" + room.getId(), room);
    }
  }

  private void startGame(GameRoom room) {
    room.setStatus(GameStatus.ACTIVE);
    // TODO: question propagation
  }

  private Optional<GameRoom> findGameRoomByPlayerId(long userId) {
    for (GameRoom gameRoom : gameRooms.values()) {
      for (Player player : gameRoom.getPlayers()) {
        if (player.getId().equals(userId)) {
          return Optional.of(gameRoom);
        }
      }
    }
    return Optional.empty();
  }

  // checking is there a room with a free capacity
  private Optional<GameRoom> findAvailableGameRoom() {

    for (GameRoom gameRoom : gameRooms.values()) {
      if ((gameRoom.getStatus() == GameStatus.WAITING || gameRoom.getStatus() == GameStatus.COUNTDOWN) &&
          gameRoom.getPlayers().size() < MAX_PLAYERS) {
        return Optional.of(gameRoom);
      }
    }
    return Optional.empty();
  }

  // creating a brand-new GameRoom
  public GameRoom createGameRoom() {
    String gameRoomId;
    do {
      gameRoomId = UUID.randomUUID().toString();
    } while (gameRooms.containsKey(gameRoomId));

    GameRoom gameRoom = new GameRoom(
        gameRoomId,
        GameStatus.WAITING,
        new ArrayList<>(),
        null
    );
    gameRooms.put(gameRoomId, gameRoom);
    return gameRoom;
  }

  // delete user from game room
  public void leaveGameRoom(Long userId) {
    Optional<GameRoom> roomOpt = findGameRoomByPlayerId(userId);

    if (roomOpt.isPresent()) {
      GameRoom room = roomOpt.get();
      room.getPlayers().removeIf(player -> player.getId().equals(userId));
      // delete room if it's empty
      if (room.getPlayers().isEmpty()) {
        if (room.getStatus() == GameStatus.COUNTDOWN) {
          ScheduledFuture<?> timer = timers.remove(roomOpt.get().getId());
          // if there's a task cancel it i.e. cancel the timer
          if (timer != null) {
            timer.cancel(false);
          }
        }

        gameRooms.remove(room.getId());
        return;
      }
      // change status of game room if there's 1 player and
      // status of the room is COUNTDOWN
      if (roomOpt.get().getPlayers().size() < 2 &&
          roomOpt.get().getStatus() == GameStatus.COUNTDOWN) {
        ScheduledFuture<?> timer = timers.remove(roomOpt.get().getId());
        // if there's a task cancel it i.e. cancel the timer
        if (timer != null) {
          timer.cancel(false);
        }
        roomOpt.get().setCountdownEndTime(null);
        roomOpt.get().setStatus(GameStatus.WAITING);
      }

      messagingTemplate.convertAndSend("/topic/game_room/" + roomOpt.get().getId(), roomOpt);
    }
  }

  // change status if user disconnected i.e. closed a tab or browser
  public void disconnectGameRoom(Long userId) {
    Optional<GameRoom> roomOpt = findGameRoomByPlayerId(userId);

    if (roomOpt.isPresent()) {
      GameRoom room = roomOpt.get();
      for (Player p : room.getPlayers()) {
        if (p.getId().equals(userId)) {
          p.setPlayerStatus(PlayerStatus.DISCONNECTED);
          break;
        }
      }

      long connectedPlayersCount = room.getPlayers().stream()
          .filter(player -> player.getPlayerStatus() == PlayerStatus.CONNECTED)
          .count();
      // if there's only one player and RoomStatus is COUNTDOWN then change status to WAITING
      // and restart countdown only when there are two Connected users
      if (connectedPlayersCount < 2 && room.getStatus() == GameStatus.COUNTDOWN) {
        ScheduledFuture<?> timer = timers.remove(room.getId());
        if (timer != null) { timer.cancel(false); }
        room.setCountdownEndTime(null);
        room.setStatus(GameStatus.WAITING);
      }

      // TODO: если все в комнате в ауте и статус ACTIVE то вся комната удаляется нахер через минуту
      // TODO: комната удаляется если никто к неё не зашел в течении минуты
      //  то есть устанавливается таймер и по его истечению если никого нет CONNECTED в комнате тогда комната удаляется
      if (connectedPlayersCount == 0 && room.getStatus() == GameStatus.ACTIVE) {
          Instant deleteTime = ZonedDateTime.now().plusSeconds(60).toInstant();
          taskScheduler.schedule(() -> deleteRoomIfEmpty(room.getId()), deleteTime);
      }
      messagingTemplate.convertAndSend("/topic/game_room/" + room.getId(), room);
    }
  }

  private void deleteRoomIfEmpty(String roomId) {
    GameRoom room = gameRooms.get(roomId);
    if (room == null) { return; } // if already deleted

    // if there's one connected user then game continues, otherwise
    // all users are disconnected then room and timer are deleted
    boolean hasConnectedPlayer = room.getPlayers().stream()
        .anyMatch(player -> player.getPlayerStatus() == PlayerStatus.CONNECTED);

    if (!hasConnectedPlayer) {
      ScheduledFuture<?> timer = timers.remove(roomId);
      if (timer != null) { timer.cancel(false); }

      gameRooms.remove(room.getId());
      GameService.log.info("GameRoom " + roomId + " deleted due to inactivity");
    }
  }
}