package com.vedansh.taal.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name="habits")
public class Habit{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String icon;

    public String getIcon(){
        return icon;
    }
    public void setIcon(String icon){
        this.icon=icon;
    }

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @OneToMany(mappedBy = "habit",
    cascade=CascadeType.ALL, orphanRemoval = true) private List<HabitEntry> entries;

    public Habit(){

    }

    public Habit(String name, User user){
        this.name=name;
        this.user=user;
    }

    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public User getUser(){
        return user;
    }
    public void setName(String name){
        this.name=name;
    }
    public void setUser(User user){
        this.user=user;
    }
}