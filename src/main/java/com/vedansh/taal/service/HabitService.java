package com.vedansh.taal.service;

import com.vedansh.taal.entity.Habit;
import com.vedansh.taal.entity.User;
import com.vedansh.taal.repository.HabitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HabitService {
    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private AuthService authService;

    public Habit createHabit(Habit habit){
        User currentUser=authService.getCurrentUser();

        habit.setUser(currentUser);

        return habitRepository.save(habit);

    }
    public List<Habit> getUserHabits(){
        User currentUser=authService.getCurrentUser();

        return habitRepository.findByUser(currentUser);
    }
}

