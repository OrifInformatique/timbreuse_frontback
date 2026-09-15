package ch.sectioninformatique.template.log;
import ch.sectioninformatique.template.user.User;

import java.util.Date;

import lombok.Data;

@Data
public class LogDTO {
    private Long id;
    private User user;
    private Date date;
    private boolean isOuting;
    private Date createdAt;
    private Date updatedAt;
    private boolean deleted;

    public LogDTO(Log log) {
        this.id = log.getId();
        this.user = log.getUser();
        this.date = log.getDate();
        this.isOuting = log.getIsOuting();
        this.createdAt = log.getCreatedAt();
        this.updatedAt = log.getUpdatedAt();
        this.deleted = log.isDeleted();
    }

}