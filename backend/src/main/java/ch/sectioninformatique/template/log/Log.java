package ch.sectioninformatique.template.log;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;

import ch.sectioninformatique.template.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "logs")
@Entity
@Builder
@NoArgsConstructor
@SQLDelete(sql = "UPDATE logs SET deleted = true WHERE id = ?")
@FilterDef(name = "delete", parameters = @ParamDef(name = "deleted", type = Boolean.class))
@Filter(name = "delete", condition = "deleted = :deleted")
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private Date date;

    private boolean isOuting;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    public Log(
        long id,
        User user,
        Date date,
        boolean isOuting,
        Date createdAt,
        Date updatedAt,
        boolean deleted
    ) {
        this.id = id;
        this.user = user;
        this.date = date;
        this.isOuting = isOuting;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deleted = deleted;
    }
}