package com.vedansh.taal.entity;

import jakarta.persistence.*;


import java.time.LocalDate;

@Entity
@Table(
        name = "habit_entries",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"habit_id", "completed_date"}
                )
        }
)
public class HabitEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate completedDate;

    @ManyToOne
    @JoinColumn(name= "habit_id")
    private Habit habit;


    public HabitEntry() {
    }

    public HabitEntry(LocalDate completedDate, Habit habit){
        this.completedDate=completedDate;
        this.habit=habit;
    }

    public Long getId(){
        return id;
    }

    public LocalDate getCompletedDate(){
        return completedDate;
    }
    public Habit getHabit(){
        return habit;
    }
    public void setCompletedDate(LocalDate completedDate){
        this.completedDate=completedDate;
    }
    public void setHabit(Habit habit){
        this.habit=habit;
    }
}