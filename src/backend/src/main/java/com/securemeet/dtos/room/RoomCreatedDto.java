package com.securemeet.dtos.room;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomCreatedDto {
    @JsonProperty("room_name")
    private String roomName;

    @JsonProperty("room_id")
    private String roomID;

    @JsonProperty("is_breakout")
    private boolean isBreakout;

    @JsonProperty("created_at")
    private long createdAt;
}
