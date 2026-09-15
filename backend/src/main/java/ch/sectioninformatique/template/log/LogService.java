package ch.sectioninformatique.template.log;

import jakarta.persistence.EntityManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ch.sectioninformatique.template.log.LogExceptions.LogNotFoundException;

@Service
public class LogService {

    private static final Logger logger = LoggerFactory.getLogger(LogService.class);

    @Autowired
    private LogRepository logRepository;
    @Autowired
    private EntityManager entityManager;

    public LogService(LogRepository logRepository, EntityManager entityManager) {
        this.logRepository = logRepository;
        this.entityManager = entityManager;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String currentUserEmail = authentication.getPrincipal().toString();

        currentUserEmail = currentUserEmail.substring(currentUserEmail.indexOf("login=") + 6);
        currentUserEmail = currentUserEmail.substring(0, currentUserEmail.indexOf(","));
        return currentUserEmail;
    }


    public Log createLog(Log log) {
        String currentUserEmail = getCurrentUserEmail();

        if (!logRepository.existsByLogin(currentUserEmail)) {
            Log newLog = new Log();
            newLog.setLogin(currentUserEmail);
            newLog.setDate(log.getDate());
            logRepository.save(newLog);
        }

        Log author = logRepository.findByLogin(currentUserEmail)
            .orElseThrow(logNotFoundException::new);

            newLog.setAuthor(author);

        return logRepository.save(log);
    }

    public Optional<Log> getLog(final Long id) {
        return logRepository.findById(id);
    }

    public Iterable<Log> getLogs(boolean includeDeleted) {
        Session session = entityManager.unwrap(Session.class);
        if(includeDeleted) {
            session.disableFilter("delete");
        } else {
            session.enableFilter("delete").setParameter("deleted", false);
        }
        List<Log> logs = new ArrayList<>();
        logRepository.findAll().forEach(logs::add);
        return logs;
    }


    public void deleteLog(final Long id) {
        String currentUserEmail = getCurrentUserEmail();

        Log currentLog = logRepository.findById(id)
            .orElseThrow(() -> new LogNotFoundException(id));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        boolean isSuperAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));

        if (!isAdmin && !isSuperAdmin) {
            if (log.getAuthor().getId() != currentLog.getId()) {
                throw new UnauthorizedLogException("delete");
            }
        }    

        logRepository.deleteById(id);
    }

    public void deletePermanentById(Long id) {
        try {
            logRepository.deletePermanentlyById(id);
        } catch (Exception e) {
            throw new LogNotFoundException(id);
        }
    }

    public Log updateLog(final Long id, Log updatedLog) {
        String currentUserEmail = getCurrentUserEmail();

        Log currentLog = logRepository.findByLogin(currentUserEmail)
            .orElseThrow(LogNotFoundException::new);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return logRepository.findById(id)
            .map(log -> {
                boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
                boolean isSuperAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));

                if (!isAdmin && !isSuperAdmin) {
                    if (log.getAuthor().getId() != currentLog.getId()) {
                        throw new UnauthorizedLogException("update");
                    }
                }

                log.setDate(updatedLog.getDate());
                log.setIsOuting(updatedLog.getIsOuting());
                log.setAuthor(currentLog);
                return logRepository.save(log);
            })
            .orElseThrow(() -> new LogNotFoundException(id));
    }

}