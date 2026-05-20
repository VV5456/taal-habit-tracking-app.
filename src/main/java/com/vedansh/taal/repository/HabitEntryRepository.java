package com.vedansh.taal.repository;

import com.vedansh.taal.entity.Habit;
import com.vedansh.taal.entity.HabitEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;



import java.time.LocalDate;
import java.util.Optional;

public interface HabitEntryRepository extends JpaRepository<HabitEntry, Long>{
    Optional<HabitEntry> findByHabitAndCompletedDate(
            Habit habit,
            LocalDate completedDate
    );

    List<HabitEntry> findByHabitOrderByCompletedDateDesc(
            Habit habit
    );
}
