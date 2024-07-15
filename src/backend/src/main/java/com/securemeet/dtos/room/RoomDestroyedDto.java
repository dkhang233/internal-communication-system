package com.securemeet.dtos.room;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.securemeet.dtos.occupant.OccupantDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomDestroyedDto {
    @JsonProperty("room_name")
    private String roomName;

    @JsonProperty("room_id")
    private String roomID;

    @JsonProperty("is_breakout")
    private boolean isBreakout;

    @JsonProperty("created_at")
    private long createdAt;

    @JsonProperty("destroyed_at")
    private long destroyedAt;

    @JsonProperty("all_occupants")
    private List<OccupantDto> allOccupants;
}
/**
 * {
 * "event_name": "muc-room-destroyed",
 * "room_name": "catchup",
 * "room_jid": "catchup@conference.meet.mydomain.com",
 * "is_breakout": false,
 * "created_at": 1625823996,
 * "destroyed_at": 1625824035,
 * "all_occupants": [
 * {
 * "name": "James Barrow",
 * "email": "j.barrow@domain.com",
 * "id": "00380324-a840-400d-880f-7ee0933b7556",
 * "occupant_jid":
 * "14f01c40-5195-4a4d-8efb-f58b49d18741@meet.mydomain.com/OWhl8jSh",
 * "joined_at": 1625823996,
 * "left_at": 1625824035
 * }
 * ]
 * }
 * 
 */