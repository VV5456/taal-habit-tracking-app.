package com.vedansh.taal.service;

import com.vedansh.taal.entity.Habit;
import com.vedansh.taal.entity.User;
import com.vedansh.taal.repository.HabitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.vedansh.taal.entity.HabitEntry;
import com.vedansh.taal.repository.HabitEntryRepository;
import java.util.List;

import java.time.LocalDate;

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
    @Autowired
    private HabitEntryRepository habitEntryRepository;

    public String completeHabit(Long habitId) {

        User currentUser = authService.getCurrentUser();

        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        LocalDate today = LocalDate.now();

        boolean alreadyCompleted =
                habitEntryRepository
                        .findByHabitAndCompletedDate(habit, today)
                        .isPresent();

        if (alreadyCompleted) {
            return "Habit already completed today";
        }

        HabitEntry entry = new HabitEntry();

        entry.setHabit(habit);
        entry.setCompletedDate(today);

        habitEntryRepository.save(entry);

        return "Habit marked as completed";
    }

    public List<HabitEntry> getHabitEntries(Long habitId) {

        User currentUser = authService.getCurrentUser();

        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() ->
                        new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return habitEntryRepository
                .findByHabitOrderByCompletedDateDesc(habit);
    }
}

