package com.vedansh.taal.dto;

public class HabitResponse {

    private Long id;

    private String name;

    private boolean completedToday;

    public HabitResponse( Long id, String name, boolean completedToday){
        this.id=id;
        this.name=name;
        this.completedToday=completedToday;
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
}