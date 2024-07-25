package com.securemeet.eventlisteners;

import com.securemeet.dtos.user.UserStatusDto;
import com.securemeet.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@RequiredArgsConstructor
@Component
public class WebsocketListener {

    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    /**
     * Khi thiết lập kết nối websocket thành công
     * => người dùng online
     * => gửi thông tin này đến người dùng khác
     *
     * @param event
     */
    @EventListener
    public void handleOnlineStatus(SessionConnectedEvent event) {
        UserStatusDto userStatusDto = userService.setStatus(event.getUser().getName(), 1);
        simpMessagingTemplate.convertAndSend("/topic/user/status", userStatusDto);
    }

    /**
     * Khi ngắt kết nối websocket thành công
     * => người dùng offline
     * => gửi thông tin này đến người dùng khác
     *
     * @param event
     */
    @EventListener
    public void handleOfflineStatus(SessionDisconnectEvent event) {
        UserStatusDto userStatusDto = userService.setStatus(event.getUser().getName(), 0);
        simpMessagingTemplate.convertAndSend("/topic/user/status", userStatusDto);
    }
}
