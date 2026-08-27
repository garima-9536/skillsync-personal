package com.skillsync.utility;

public class SkillSyncException extends Exception {
    public SkillSyncException(String messageKey) {
        super(messageKey);
    }
}
