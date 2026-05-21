package com.vedansh.taal.controller;
import com.vedansh.taal.dto.HabitResponse;
import com.vedansh.taal.entity.Habit;
import com.vedansh.taal.service.HabitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.vedansh.taal.entity.HabitEntry;

@RestController
@RequestMapping("api/habits")
public class HabitController {

    @Autowired
    private HabitService habitService;

    @PostMapping
    public Habit createHabit(@RequestBody Habit habit){
        return habitService.createHabit(habit);
    }

    @GetMapping
    public List<HabitResponse> getHabits() {

        return habitService.getUserHabits();
    }

    @PostMapping("/{habitId}/complete")
    public String completeHabit(@PathVariable Long habitId)
    {
        return habitService.completeHabit(habitId);
    }
    @GetMapping("/{habitId}/entries")
    public List<HabitEntry> getHabitEntries(@PathVariable Long habitId){
        return habitService.getHabitEntries(habitId);
    }
    @GetMapping("/{habitId}/streak")
    public int getHabitStreak(@PathVariable Long habitId){
        return habitService.getHabitStreak(habitId);
    }



}