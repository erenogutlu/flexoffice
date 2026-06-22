package com.flexoffice.flexoffice;

import com.flexoffice.flexoffice.dto.UserDto;
import com.flexoffice.flexoffice.entity.Desk;
import com.flexoffice.flexoffice.entity.MeetingRoom;
import com.flexoffice.flexoffice.entity.Role;
import com.flexoffice.flexoffice.entity.User;
import com.flexoffice.flexoffice.repository.DeskRepository;
import com.flexoffice.flexoffice.repository.MeetingRoomRepository;
import com.flexoffice.flexoffice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class FlexofficeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlexofficeApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, DeskRepository deskRepository, MeetingRoomRepository meetingRoomRepository) {
        return args -> {
            if(userRepository.count() == 0) {
                User user = new User();
                user.setFirstName("First");
                user.setLastName("Last");
                user.setEmail("user@gmail.com");
                user.setRole(Role.USER);
                userRepository.save(user);

                Desk desk = new Desk();
                desk.setDeskCode("Desk-01");
                desk.setLocation("In the Middle");
                desk.setIsActive(true);

                Desk desk2 = new Desk();
                desk2.setDeskCode("Desk-02");
                desk2.setLocation("In the Right");
                desk2.setIsActive(true);

                deskRepository.saveAll(List.of(desk, desk2));
            }
            if(meetingRoomRepository.count() == 0) {

                MeetingRoom meetingRoom = new MeetingRoom();
                meetingRoom.setIsActive(true);
                meetingRoom.setRoomName("Meeting Room 01");
                meetingRoom.setHasProjector(true);
                meetingRoom.setCapacity(10);
                meetingRoomRepository.save(meetingRoom);

                MeetingRoom meetingRoom2 = new MeetingRoom();
                meetingRoom2.setIsActive(true);
                meetingRoom2.setRoomName("Meeting Room 02");
                meetingRoom2.setHasProjector(false);
                meetingRoom2.setCapacity(10);

                meetingRoomRepository.saveAll(List.of(meetingRoom, meetingRoom2));

                System.out.println("Test User, Meeting Room and Desk are created");

            }
        };
    }
}