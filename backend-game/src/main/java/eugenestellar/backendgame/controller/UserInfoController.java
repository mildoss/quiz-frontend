package eugenestellar.backendgame.controller;

import eugenestellar.backendgame.model.entity.UserInfo;
import eugenestellar.backendgame.model.dto.UserInfoAfterRegisterDto;
import eugenestellar.backendgame.repository.UserInfoRepo;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user_info")
public class UserInfoController {

  private final UserInfoRepo userInfoRepo;

  public UserInfoController(UserInfoRepo userInfoRepo) {
    this.userInfoRepo = userInfoRepo;
  }

  @PostMapping("/{id}")
  public ResponseEntity<?> setUserInfo(@PathVariable Long id,
                                       @Valid @RequestBody UserInfoAfterRegisterDto userInfoDtoAfterRegister) {

    UserInfo userInfo = new UserInfo();
    userInfo.setId(id);
    userInfo.setUsername(userInfoDtoAfterRegister.getUsername());
    userInfo.setWins(0);
    userInfo.setTotalScore(0);
    userInfo.setLosses(0);
    userInfo.setGameQuantity(0);
    try {
      userInfoRepo.save(userInfo);
      return ResponseEntity.status(HttpStatus.OK).build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database error: " + e.getMessage());
    }
  }
}