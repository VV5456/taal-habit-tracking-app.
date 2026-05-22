package com.vedansh.taal.dto;

import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.List;

public class HabitResponse {

    private Long id;

    private String name;

    private boolean completedToday;

    private int streak;

    private List<LocalDate> completedDates;

    private String icon;

    public HabitResponse( Long id, String name,String icon, boolean completedToday, int streak, List<LocalDate> completedDates){
        this.id=id;
        this.name=name;
        this.completedToday=completedToday;
        this.streak=streak;
        this.completedDates=completedDates;
        this.icon=icon;

    }

    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public boolean isCompletedToday(){
        return completedToday;
    }
    public int getStreak(){
        return streak;
    }
    public List<LocalDate> getCompletedDates() {
        return completedDates;
    }
    public String getIcon(){return icon;}

}