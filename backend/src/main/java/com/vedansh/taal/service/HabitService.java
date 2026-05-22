package com.vedansh.taal.service;

import com.vedansh.taal.entity.Habit;
import com.vedansh.taal.entity.User;
import com.vedansh.taal.repository.HabitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import java.util.List;
import com.vedansh.taal.entity.HabitEntry;
import com.vedansh.taal.repository.HabitEntryRepository;
import java.util.Set;
import java.util.stream.Collectors;
import com.vedansh.taal.dto.HabitResponse;
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

            HabitEntry existingEntry =
                    habitEntryRepository
                            .findByHabitAndCompletedDate(
                                    habit,
                                    today
                            )
                            .orElseThrow();

            habitEntryRepository.delete(existingEntry);

            return "Habit uncompleted";
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

    public int getHabitStreak(Long habitId){
        User currentUser= authService.getCurrentUser();

        Habit habit=habitRepository.findById(habitId)
                .orElseThrow(()-> new RuntimeException("Habit not found"));

        if(!habit.getUser().getId().equals(currentUser.getId())){
            throw new RuntimeException("Unauthorized");
        }

        List<HabitEntry>entries=habitEntryRepository.findByHabitOrderByCompletedDateDesc(habit);

        Set<LocalDate> completedDates=entries.stream().map(HabitEntry::getCompletedDate).collect(Collectors.toSet());

        LocalDate currentDate= LocalDate.now();

        if (!completedDates.contains(currentDate)) {

            currentDate=currentDate.minusDays(1);
        }

        int streak=0;

        while(completedDates.contains(currentDate)){
            streak++;

            currentDate=currentDate.minusDays(1);
        }
        return streak;
    }

    public void deleteHabit(Long habitId){
        User currentUser=authService.getCurrentUser();

        Habit habit=habitRepository.findById(habitId).orElseThrow(()-> new RuntimeException("Habit not found."));

        if(!habit.getUser().getId().equals(currentUser.getId())){
            throw new RuntimeException("Unauthorized");
        }

        habitRepository.delete(habit);
    }

    public Habit updateHabit(Long habitId, Habit updatedHabit){
        User currentUser=authService.getCurrentUser();

        Habit existingHabit= habitRepository.findById(habitId).orElseThrow(()-> new RuntimeException(("Habit not found")));

        if(!existingHabit.getUser().getId().equals(currentUser.getId())){
            throw new RuntimeException("Unauthorized");
        }
        existingHabit.setName(updatedHabit.getName());

        return habitRepository.save(existingHabit);
    }


    public List<HabitResponse> getUserHabits(){
        User currentUser=authService.getCurrentUser();

        List<Habit> habits= habitRepository.findByUser(currentUser);

        return habits.stream().map(habit-> {
            boolean completedToday=habitEntryRepository.existsByHabitAndCompletedDate(habit,LocalDate.now());
            List<LocalDate> completedDates=habitEntryRepository
                    .findByHabitOrderByCompletedDateDesc(habit)
                    .stream()
                    .map(HabitEntry::getCompletedDate)
                    .toList();
            return new HabitResponse(habit.getId(), habit.getName(),habit.getIcon(), completedToday, getHabitStreak(habit.getId()),completedDates);
        }).toList();
    }
}

