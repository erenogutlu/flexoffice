package com.flexoffice.flexoffice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name="reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User reservedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="meeting_room_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private MeetingRoom reservedMeetingRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="desk_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Desk reservedDesk;

}