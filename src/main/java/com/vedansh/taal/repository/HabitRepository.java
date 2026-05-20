package com.vedansh.taal.repository;

import com.vedansh.taal.entity.Habit;
import com.vedansh.taal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabitRepository extends JpaRepository<Habit, Long>{
    List<Habit> findByUser(User user);
}