package com.flexoffice.flexoffice.controller;

import com.flexoffice.flexoffice.entity.Reservation;
import com.flexoffice.flexoffice.service.ReservationService;
import jakarta.persistence.PostRemove;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins ="*")
public class ReservationController {
    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PostMapping("/desk")
    public ResponseEntity<Reservation> createDeskReservation(@RequestBody Reservation reservation) {
        Reservation createdReservation = reservationService.createDeskReservation(reservation);
        return ResponseEntity.ok(createdReservation);
    }

    @PostMapping("/room")
    public ResponseEntity<Reservation> createRoomReservation(@RequestBody Reservation reservation) {
        Reservation createdReservation = reservationService.createMeetingRoomReservation(reservation);
        return ResponseEntity.ok(createdReservation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok("Reservation cancelled succesfully.");
    }

    @DeleteMapping()
    public ResponseEntity<String> deleteReservation() {
        reservationService.deleteAllReservations();
        return ResponseEntity.ok("All Reservations cancelled succesfully");
    }
}
