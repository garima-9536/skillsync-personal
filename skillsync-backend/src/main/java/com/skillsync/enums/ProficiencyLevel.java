package com.skillsync.enums;

public enum ProficiencyLevel {
    BEGINNER, INTERMEDIATE, ADVANCED, EXPERT;

    public int getWeight() {
        return switch (this) {
            case BEGINNER     -> 1;
            case INTERMEDIATE -> 2;
            case ADVANCED     -> 3;
            case EXPERT       -> 4;
        };
    }
}
